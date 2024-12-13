package handlers

import (
	"github.com/kozakbalint/szakdoga/api/internal/context"
)

type Handlers struct {
	HealthCheckHandler   *HealthCheckHandler
	CastHandler          *CastHandler
	PeopleHandler        *PeopleHandler
	SearchHandler        *SearchHandler
	MovieHandler         *MovieHandler
	WatchProviderHandler *WatchProviderHandler
	UsersHandler         *UsersHandler
	TokensHandler        *TokensHandler
	TvHandler            *TvHandler
	WatchlistHandler     *WatchlistHandler
	WatchedHandler       *WatchedHandler
}

func NewHandlers(ctx *context.ServerContext) *Handlers {
	return &Handlers{
		HealthCheckHandler: &HealthCheckHandler{
			Config: ctx.Config,
		},
		CastHandler: &CastHandler{
			Tmdb: ctx.Tmdb,
		},
		PeopleHandler: &PeopleHandler{
			Tmdb: ctx.Tmdb,
		},
		SearchHandler: &SearchHandler{
			Tmdb: ctx.Tmdb,
		},
		MovieHandler: &MovieHandler{
			Tmdb: ctx.Tmdb,
		},
		WatchProviderHandler: &WatchProviderHandler{
			Tmdb: ctx.Tmdb,
		},
		UsersHandler: &UsersHandler{
			Models: &ctx.Models,
		},
		TokensHandler: &TokensHandler{
			Models: &ctx.Models,
		},
		TvHandler: &TvHandler{
			Tmdb: ctx.Tmdb,
		},
		WatchlistHandler: &WatchlistHandler{
			Models: &ctx.Models,
		},
		WatchedHandler: &WatchedHandler{
			Models: &ctx.Models,
		},
	}
}
