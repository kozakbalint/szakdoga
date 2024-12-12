package context

import (
	"log/slog"

	tmdb "github.com/cyruzin/golang-tmdb"
	"github.com/kozakbalint/szakdoga/api/internal/config"
	"github.com/kozakbalint/szakdoga/api/internal/data"
	"github.com/kozakbalint/szakdoga/api/internal/database"
	"github.com/kozakbalint/szakdoga/api/internal/repository"
)

type ServerContext struct {
	DB         database.Service
	Repository *repository.Queries
	Config     *config.Config
	Logger     slog.Logger
	Tmdb       *tmdb.Client
	Models     data.Models
}
