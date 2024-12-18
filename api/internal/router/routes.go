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
	h := handlers.NewHandlers(ctx)

	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", h.HealthCheckHandler.HealthcheckHandler)

	router.HandlerFunc(http.MethodGet, "/v1/users/me", middleware.RequireAuthenticatedUser(h.UsersHandler.GetRequestUserHandler))
	router.HandlerFunc(http.MethodPost, "/v1/users", h.UsersHandler.CreateUserHandler)
	router.HandlerFunc(http.MethodPost, "/v1/users/authenticate", h.TokensHandler.CreateAuthenticationTokenHandler)
	router.HandlerFunc(http.MethodGet, "/v1/users/logout", middleware.RequireAuthenticatedUser(h.TokensHandler.InvalidateAuthenticationTokenHandler))

	router.HandlerFunc(http.MethodGet, "/v1/search/movies", middleware.RequireAuthenticatedUser(h.SearchHandler.SearchMoviesHandler))
	router.HandlerFunc(http.MethodGet, "/v1/search/tv", middleware.RequireAuthenticatedUser(h.SearchHandler.SearchTvHandler))
	router.HandlerFunc(http.MethodGet, "/v1/search/people", middleware.RequireAuthenticatedUser(h.SearchHandler.SearchPeopleHandler))

	router.HandlerFunc(http.MethodGet, "/v1/movies/:id", middleware.RequireAuthenticatedUser(h.MovieHandler.GetMovieByIDHandler))

	router.HandlerFunc(http.MethodGet, "/v1/tv/:id", middleware.RequireAuthenticatedUser(h.TvHandler.GetTvByIDHandler))
	router.HandlerFunc(http.MethodGet, "/v1/tv/:id/seasons", middleware.RequireAuthenticatedUser(h.TvHandler.GetTvSeasonsHandler))
	router.HandlerFunc(http.MethodGet, "/v1/tv/:id/seasons/:season/episodes", middleware.RequireAuthenticatedUser(h.TvHandler.GetTvEpisodesHandler))
	router.HandlerFunc(http.MethodGet, "/v1/tv/:id/seasons/:season/episodes/:episode", middleware.RequireAuthenticatedUser(h.TvHandler.GetTvEpisodeHandler))

	router.HandlerFunc(http.MethodGet, "/v1/people/:id", middleware.RequireAuthenticatedUser(h.PeopleHandler.GetPersonByIDHandler))

	router.HandlerFunc(http.MethodGet, "/v1/cast/movies/:id", middleware.RequireAuthenticatedUser(h.CastHandler.GetMovieCastHandler))
	router.HandlerFunc(http.MethodGet, "/v1/cast/tv/:id", middleware.RequireAuthenticatedUser(h.CastHandler.GetTvCastHandler))

	router.HandlerFunc(http.MethodGet, "/v1/watch/movies/:id", middleware.RequireAuthenticatedUser(h.WatchProviderHandler.WatchProvidersMovieHandler))
	router.HandlerFunc(http.MethodGet, "/v1/watch/tv/:id", middleware.RequireAuthenticatedUser(h.WatchProviderHandler.WatchProvidersTvHandler))

	router.HandlerFunc(http.MethodGet, "/v1/watchlist/movies", middleware.RequireAuthenticatedUser(h.WatchlistHandler.GetMoviesWatchlistHandler))
	router.HandlerFunc(http.MethodPost, "/v1/watchlist/movies", middleware.RequireAuthenticatedUser(h.WatchlistHandler.AddMovieToWatchlistHandler))
	router.HandlerFunc(http.MethodDelete, "/v1/watchlist/movies/:id", middleware.RequireAuthenticatedUser(h.WatchlistHandler.RemoveMovieFromWatchlistHandler))
	router.HandlerFunc(http.MethodGet, "/v1/watchlist/tv", middleware.RequireAuthenticatedUser(h.WatchlistHandler.GetTvShowsWatchlistHandler))
	router.HandlerFunc(http.MethodPost, "/v1/watchlist/tv", middleware.RequireAuthenticatedUser(h.WatchlistHandler.AddTvShowToWatchlistHandler))
	router.HandlerFunc(http.MethodDelete, "/v1/watchlist/tv/:id", middleware.RequireAuthenticatedUser(h.WatchlistHandler.RemoveTvShowFromWatchlistHandler))

	router.HandlerFunc(http.MethodGet, "/v1/watched/movies", middleware.RequireAuthenticatedUser(h.WatchedHandler.GetWatchedMoviesHandler))
	router.HandlerFunc(http.MethodGet, "/v1/watched/movies/:id", middleware.RequireAuthenticatedUser(h.WatchedHandler.GetWatchDatesByMovieHandler))
	router.HandlerFunc(http.MethodPost, "/v1/watched/movies", middleware.RequireAuthenticatedUser(h.WatchedHandler.AddWatchedMovieHandler))
	router.HandlerFunc(http.MethodDelete, "/v1/watched/movies/:id", middleware.RequireAuthenticatedUser(h.WatchedHandler.RemoveWatchedMovieHandler))

	router.HandlerFunc(http.MethodGet, "/v1/watched/tv", middleware.RequireAuthenticatedUser(h.WatchedHandler.GetWatchedTvShowsHandler))
	router.HandlerFunc(http.MethodPost, "/v1/watched/tv", middleware.RequireAuthenticatedUser(h.WatchedHandler.AddWatchedTvShowHandler))
	router.HandlerFunc(http.MethodDelete, "/v1/watched/tv/show/:id", middleware.RequireAuthenticatedUser(h.WatchedHandler.RemoveWatchedTvShowHandler))
	router.HandlerFunc(http.MethodPost, "/v1/watched/tv/episodes", middleware.RequireAuthenticatedUser(h.WatchedHandler.AddWatchedTvShowEpisodesHandler))
	router.HandlerFunc(http.MethodDelete, "/v1/watched/tv/episodes/:id", middleware.RequireAuthenticatedUser(h.WatchedHandler.RemoveWatchedTvShowEpisodeHandler))
	router.HandlerFunc(http.MethodPost, "/v1/watched/tv/seasons", middleware.RequireAuthenticatedUser(h.WatchedHandler.AddWatchedTvShowSeasonsHandler))
	router.HandlerFunc(http.MethodDelete, "/v1/watched/tv/show/:id/seasons/:season", middleware.RequireAuthenticatedUser(h.WatchedHandler.RemoveWatchedTvShowHandler))

	return middleware.RecoverPanic(middleware.EnableCORS(ctx.Config, middleware.Authenticate(&ctx.Models, router)))
}
