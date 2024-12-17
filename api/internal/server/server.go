package server

import (
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"time"

	tmdb "github.com/cyruzin/golang-tmdb"
	"github.com/kozakbalint/szakdoga/api/internal/config"
	"github.com/kozakbalint/szakdoga/api/internal/context"
	"github.com/kozakbalint/szakdoga/api/internal/data"
	"github.com/kozakbalint/szakdoga/api/internal/database"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/router"
	"github.com/kozakbalint/szakdoga/api/internal/tmdbclient"
)

type Server struct {
	Port          int
	Logger        slog.Logger
	ServerContext *context.ServerContext
}

func NewServer() *http.Server {
	c, err := config.Load()
	if err != nil {
		fmt.Println("Error loading config: ", err)
	}

	db, err := database.New(&c)
	if err != nil {
		fmt.Println("Error connecting to database: ", err)
	}

	tmdbInit, err := tmdb.Init(c.TMDB.APIKey)
	if err != nil {
		fmt.Println("Error connecting to tmdb: ", err)
	}

	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	errors.Init(logger)

	serverContext := &context.ServerContext{
		Logger:     *logger,
		DB:         db,
		Repository: db.GetQueries(),
		Config:     &c,
		TmdbClient: tmdbclient.NewClient(tmdbInit, db.GetQueries()),
		Models:     data.NewModels(db.GetQueries()),
	}

	newServer := &Server{
		Port:          c.Port,
		Logger:        *logger,
		ServerContext: serverContext,
	}

	// Declare Server config
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", newServer.Port),
		Handler:      router.New(serverContext),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server
}
