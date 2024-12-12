package config

import (
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Port    int
	Env     string
	DB      DatabaseConfig
	TMDB    TMDBConfig
	CORS    CORSConfig
	Version string
}

type DatabaseConfig struct {
	DSN          string
	MaxOpenConns int
	MaxIdleConns int
	MaxIdleTime  int
}

type TMDBConfig struct {
	APIKey string
}

type CORSConfig struct {
	TrustedOrigins []string
}

func Load() (Config, error) {
	// print the current working directory
	err := godotenv.Load(".env")
	if err != nil {
		return Config{}, err
	}

	port, err := strconv.Atoi(os.Getenv("API_PORT"))
	if err != nil {
		port = 4000
	}

	return Config{
		Port: port,
		Env:  os.Getenv("API_ENV"),
		DB: DatabaseConfig{
			DSN:          os.Getenv("DB_DSN"),
			MaxOpenConns: 25,
			MaxIdleConns: 25,
			MaxIdleTime:  5,
		},
		TMDB: TMDBConfig{
			APIKey: os.Getenv("TMDB_API_KEY"),
		},
		CORS: CORSConfig{
			TrustedOrigins: strings.Fields(os.Getenv("CORS_TRUSTED_ORIGINS")),
		},
	}, nil
}
