package context

import (
	"context"
	"log/slog"
	"net/http"

	"github.com/kozakbalint/szakdoga/api/internal/config"
	"github.com/kozakbalint/szakdoga/api/internal/data"
	"github.com/kozakbalint/szakdoga/api/internal/database"
	"github.com/kozakbalint/szakdoga/api/internal/repository"
	"github.com/kozakbalint/szakdoga/api/internal/tmdbclient"
	"github.com/redis/go-redis/v9"
)

type ServerContext struct {
	DB         database.Service
	Redis      *redis.Client
	Repository *repository.Queries
	Config     *config.Config
	Logger     slog.Logger
	TmdbClient *tmdbclient.Client
	Models     data.Models
}

type contextKey string

const userContextKey = contextKey("user")

func SetUser(r *http.Request, user *data.User) *http.Request {
	ctx := context.WithValue(r.Context(), userContextKey, user)
	return r.WithContext(ctx)
}

func GetUser(r *http.Request) *data.User {
	user, ok := r.Context().Value(userContextKey).(*data.User)
	if !ok {
		panic("missing user value in request context")
	}

	return user
}
