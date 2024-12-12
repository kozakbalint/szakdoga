package router

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/kozakbalint/szakdoga/api/internal/context"
	"github.com/kozakbalint/szakdoga/api/internal/handlers"
	"github.com/kozakbalint/szakdoga/api/internal/middleware"
)

func New(ctx *context.ServerContext) http.Handler {
	router := httprouter.New()
	handlers := handlers.NewHandlers(ctx)

	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", handlers.HealthCheckHandler.HealthcheckHandler)

	router.HandlerFunc(http.MethodGet, "/v1/users/me", middleware.RequireAuthenticatedUser(handlers.UsersHandler.GetRequestUserHandler))
	router.HandlerFunc(http.MethodPost, "/v1/users", handlers.UsersHandler.CreateUserHandler)
	router.HandlerFunc(http.MethodPost, "/v1/users/authenticate", handlers.TokensHandler.CreateAuthenticationTokenHandler)
	router.HandlerFunc(http.MethodGet, "/v1/users/logout", middleware.RequireAuthenticatedUser(handlers.TokensHandler.InvalidateAuthenticationTokenHandler))

	router.HandlerFunc(http.MethodGet, "/v1/search/movies", middleware.RequireAuthenticatedUser(handlers.SearchHandler.SearchMoviesHandler))
	router.HandlerFunc(http.MethodGet, "/v1/search/tv", middleware.RequireAuthenticatedUser(handlers.SearchHandler.SearchTvHandler))
	router.HandlerFunc(http.MethodGet, "/v1/search/people", middleware.RequireAuthenticatedUser(handlers.SearchHandler.SearchPeopleHandler))

	router.HandlerFunc(http.MethodGet, "/v1/movies/:id", middleware.RequireAuthenticatedUser(handlers.MovieHandler.GetMovieByIdHandler))

	router.HandlerFunc(http.MethodGet, "/v1/tv/:id", middleware.RequireAuthenticatedUser(handlers.TvHandler.GetTvByIdHandler))
	router.HandlerFunc(http.MethodGet, "/v1/tv/:id/seasons", middleware.RequireAuthenticatedUser(handlers.TvHandler.GetTvSeasonsHandler))
	router.HandlerFunc(http.MethodGet, "/v1/tv/:id/seasons/:season/episodes", middleware.RequireAuthenticatedUser(handlers.TvHandler.GetTvEpisodesHandler))
	router.HandlerFunc(http.MethodGet, "/v1/tv/:id/seasons/:season/episodes/:episode", middleware.RequireAuthenticatedUser(handlers.TvHandler.GetTvEpisodeHandler))

	router.HandlerFunc(http.MethodGet, "/v1/people/:id", middleware.RequireAuthenticatedUser(handlers.PeopleHandler.GetPersonByIdHandler))

	router.HandlerFunc(http.MethodGet, "/v1/cast/movies/:id", middleware.RequireAuthenticatedUser(handlers.CastHandler.GetMovieCastHandler))
	router.HandlerFunc(http.MethodGet, "/v1/cast/tv/:id", middleware.RequireAuthenticatedUser(handlers.CastHandler.GetTvCastHandler))

	router.HandlerFunc(http.MethodGet, "/v1/watch/movies/:id", middleware.RequireAuthenticatedUser(handlers.WatchProviderHandler.WatchProvidersMovieHandler))
	router.HandlerFunc(http.MethodGet, "/v1/watch/tv/:id", middleware.RequireAuthenticatedUser(handlers.WatchProviderHandler.WatchProvidersTvHandler))

	router.HandlerFunc(http.MethodGet, "/v1/watchlist/movies", middleware.RequireAuthenticatedUser(handlers.WatchlistHandler.GetMoviesWatchlistHandler))
	router.HandlerFunc(http.MethodPost, "/v1/watchlist/movies", middleware.RequireAuthenticatedUser(handlers.WatchlistHandler.AddMovieToWatchlistHandler))
	router.HandlerFunc(http.MethodDelete, "/v1/watchlist/movies/:id", middleware.RequireAuthenticatedUser(handlers.WatchlistHandler.RemoveMovieFromWatchlistHandler))

	return middleware.RecoverPanic(middleware.EnableCORS(*ctx.Config, middleware.Authenticate(&ctx.Models, router)))
}
