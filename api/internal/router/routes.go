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
	router.HandlerFunc(http.MethodPost, "/v1/users/register", h.UsersHandler.CreateUserHandler)
	router.HandlerFunc(http.MethodPost, "/v1/users/login", h.TokensHandler.CreateAuthenticationTokenHandler)
	router.HandlerFunc(http.MethodGet, "/v1/users/logout", middleware.RequireAuthenticatedUser(h.TokensHandler.InvalidateAuthenticationTokenHandler))

	router.HandlerFunc(http.MethodGet, "/v1/search/movies", middleware.RequireAuthenticatedUser(h.SearchHandler.SearchMoviesHandler))
	router.HandlerFunc(http.MethodGet, "/v1/search/tv", middleware.RequireAuthenticatedUser(h.SearchHandler.SearchTvHandler))
	router.HandlerFunc(http.MethodGet, "/v1/search/people", middleware.RequireAuthenticatedUser(h.SearchHandler.SearchPeopleHandler))

	router.HandlerFunc(http.MethodGet, "/v1/movies/:id", middleware.RequireAuthenticatedUser(h.MovieHandler.GetMovieByIDHandler))

	router.HandlerFunc(http.MethodGet, "/v1/tv/:id", middleware.RequireAuthenticatedUser(h.TvHandler.GetTvByIDHandler))
	router.HandlerFunc(http.MethodGet, "/v1/tv/:id/seasons/:season_number", middleware.RequireAuthenticatedUser(h.TvHandler.GetTvSeasonHandler))
	router.HandlerFunc(http.MethodGet, "/v1/tv/:id/seasons/:season_number/episodes/:episode_number", middleware.RequireAuthenticatedUser(h.TvHandler.GetTvEpisodeHandler))

	router.HandlerFunc(http.MethodGet, "/v1/people/:id", middleware.RequireAuthenticatedUser(h.PeopleHandler.GetPersonByIDHandler))

	router.HandlerFunc(http.MethodGet, "/v1/cast/movies/:id", middleware.RequireAuthenticatedUser(h.CastHandler.GetMovieCastHandler))
	router.HandlerFunc(http.MethodGet, "/v1/cast/tv/:id", middleware.RequireAuthenticatedUser(h.CastHandler.GetTvCastHandler))

	router.HandlerFunc(http.MethodGet, "/v1/watchproviders/movies/:id", middleware.RequireAuthenticatedUser(h.WatchProviderHandler.WatchProvidersMovieHandler))
	router.HandlerFunc(http.MethodGet, "/v1/watchproviders/tv/:id", middleware.RequireAuthenticatedUser(h.WatchProviderHandler.WatchProvidersTvHandler))

	router.HandlerFunc(http.MethodGet, "/v1/watchlist", middleware.RequireAuthenticatedUser(h.WatchlistHandler.GetWatchlistHandler))
	router.HandlerFunc(http.MethodGet, "/v1/watchlist/movies/:id", middleware.RequireAuthenticatedUser(h.WatchlistHandler.GetMovieWatchlistHandler))
	router.HandlerFunc(http.MethodPost, "/v1/watchlist/movies/:id", middleware.RequireAuthenticatedUser(h.WatchlistHandler.AddMovieToWatchlistHandler))
	router.HandlerFunc(http.MethodDelete, "/v1/watchlist/movies/:id", middleware.RequireAuthenticatedUser(h.WatchlistHandler.DeleteMovieFromWatchlistHandler))
	router.HandlerFunc(http.MethodGet, "/v1/watchlist/tv/:id", middleware.RequireAuthenticatedUser(h.WatchlistHandler.GetTvShowWatchlistHandler))
	router.HandlerFunc(http.MethodPost, "/v1/watchlist/tv/:id", middleware.RequireAuthenticatedUser(h.WatchlistHandler.AddTvShowToWatchlistHandler))
	router.HandlerFunc(http.MethodDelete, "/v1/watchlist/tv/:id", middleware.RequireAuthenticatedUser(h.WatchlistHandler.DeleteTvShowFromWatchlistHandler))

	router.HandlerFunc(http.MethodGet, "/v1/watched", middleware.RequireAuthenticatedUser(h.WatchedHandler.GetWatchedHandler))
	router.HandlerFunc(http.MethodGet, "/v1/watched/movies/:id", middleware.RequireAuthenticatedUser(h.WatchedHandler.GetMovieWatchedHandler))
	router.HandlerFunc(http.MethodPost, "/v1/watched/movies/:id", middleware.RequireAuthenticatedUser(h.WatchedHandler.AddMovieToWatchedHandler))
	router.HandlerFunc(http.MethodDelete, "/v1/watched/movies/:id", middleware.RequireAuthenticatedUser(h.WatchedHandler.DeleteMovieFromWatchedHandler))
	router.HandlerFunc(http.MethodGet, "/v1/watched/tv/:id", middleware.RequireAuthenticatedUser(h.WatchedHandler.GetTvWatchedHandler))
	router.HandlerFunc(http.MethodPost, "/v1/watched/tv/:id", middleware.RequireAuthenticatedUser(h.WatchedHandler.AddTvToWatchedHandler))
	router.HandlerFunc(http.MethodDelete, "/v1/watched/tv/:id", middleware.RequireAuthenticatedUser(h.WatchedHandler.DeleteTvFromWatchedHandler))
	router.HandlerFunc(http.MethodGet, "/v1/watched/tv/:id/seasons/:season_number", middleware.RequireAuthenticatedUser(h.WatchedHandler.GetTvSeasonWatchedHandler))
	router.HandlerFunc(http.MethodPost, "/v1/watched/tv/:id/seasons/:season_number", middleware.RequireAuthenticatedUser(h.WatchedHandler.AddTvSeasonToWatchedHandler))
	router.HandlerFunc(http.MethodDelete, "/v1/watched/tv/:id/seasons/:season_number", middleware.RequireAuthenticatedUser(h.WatchedHandler.DeleteTvSeasonFromWatchedHandler))
	router.HandlerFunc(http.MethodGet, "/v1/watched/tv/:id/seasons/:season_number/episodes/:episode_number", middleware.RequireAuthenticatedUser(h.WatchedHandler.GetTvEpisodeWatchedHandler))
	router.HandlerFunc(http.MethodPost, "/v1/watched/tv/:id/seasons/:season_number/episodes/:episode_number", middleware.RequireAuthenticatedUser(h.WatchedHandler.AddTvEpisodeToWatchedHandler))
	router.HandlerFunc(http.MethodDelete, "/v1/watched/tv/:id/seasons/:season_number/episodes/:episode_number", middleware.RequireAuthenticatedUser(h.WatchedHandler.DeleteTvEpisodeFromWatchedHandler))

	return middleware.RecoverPanic(middleware.EnableCORS(ctx.Config, middleware.Authenticate(&ctx.Models, router)))
}
