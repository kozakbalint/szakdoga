package database

import (
	"context"
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kozakbalint/szakdoga/api/internal/config"
	"github.com/kozakbalint/szakdoga/api/internal/repository"
)

type Service interface {
	Health() map[string]string
	Close() error
	GetQueries() *repository.Queries
}

type service struct {
	db      *pgxpool.Pool
	queries *repository.Queries
}

// New initializes the database connection pool, runs migrations, and sets up the repository queries.
func New(c *config.Config) (Service, error) {
	connStr := c.DB.DSN

	// Initialize the connection pool
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	pool, err := pgxpool.New(ctx, connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Test the connection
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("database ping failed: %w", err)
	}

	// Run migrations
	if err := runMigrations(connStr); err != nil {
		pool.Close()
		return nil, fmt.Errorf("failed to apply migrations: %w", err)
	}

	// Set up the repository queries
	queries := repository.New(pool)

	return &service{
		db:      pool,
		queries: queries,
	}, nil
}

// Health checks the database connection and returns health statistics.
func (s *service) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	stats := make(map[string]string)

	// Check connection
	if err := s.db.Ping(ctx); err != nil {
		stats["status"] = "down"
		stats["error"] = fmt.Sprintf("database connection error: %v", err)
		return stats
	}

	// Gather connection pool statistics
	dbStats := s.db.Stat()
	stats["status"] = "up"
	stats["open_connections"] = strconv.Itoa(int(dbStats.TotalConns()))
	stats["idle_connections"] = strconv.Itoa(int(dbStats.IdleConns()))
	stats["max_connections"] = strconv.Itoa(int(s.db.Config().MaxConns))
	stats["message"] = "Database is healthy"

	return stats
}

// Close shuts down the database connection pool.
func (s *service) Close() error {
	s.db.Close()
	log.Println("Database connection pool closed")
	return nil
}

// GetQueries returns the repository queries for executing SQL commands.
func (s *service) GetQueries() *repository.Queries {
	return s.queries
}

// runMigrations applies database migrations using the golang-migrate package.
func runMigrations(connStr string) error {
	m, err := migrate.New("file://migrations", connStr)
	if err != nil {
		return fmt.Errorf("failed to initialize migrations: %w", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("migration failed: %w", err)
	}

	log.Println("Database migrations applied successfully")
	return nil
}
