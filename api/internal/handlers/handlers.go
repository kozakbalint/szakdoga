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
			Models:     &ctx.Models,
			TmdbClient: ctx.TmdbClient,
		},
		PeopleHandler: &PeopleHandler{
			Models:     &ctx.Models,
			TmdbClient: ctx.TmdbClient,
		},
		SearchHandler: &SearchHandler{
			Models:     &ctx.Models,
			TmdbClient: ctx.TmdbClient,
		},
		MovieHandler: &MovieHandler{
			Models:     &ctx.Models,
			TmdbClient: ctx.TmdbClient,
		},
		WatchProviderHandler: &WatchProviderHandler{
			Models:     &ctx.Models,
			TmdbClient: ctx.TmdbClient,
		},
		UsersHandler: &UsersHandler{
			Models: &ctx.Models,
		},
		TokensHandler: &TokensHandler{
			Models: &ctx.Models,
		},
		TvHandler: &TvHandler{
			Models:     &ctx.Models,
			TmdbClient: ctx.TmdbClient,
		},
		WatchlistHandler: &WatchlistHandler{
			Models:     &ctx.Models,
			TmdbClient: ctx.TmdbClient,
		},
		WatchedHandler: &WatchedHandler{
			Models:     &ctx.Models,
			TmdbClient: ctx.TmdbClient,
		},
	}
}
