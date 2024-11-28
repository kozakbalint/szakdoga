package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", app.healthcheckHandler)

	router.HandlerFunc(http.MethodGet, "/v1/users/me", app.requireAuthenticatedUser(app.getRequestUserHandler))
	router.HandlerFunc(http.MethodPost, "/v1/users", app.createUserHandler)
	router.HandlerFunc(http.MethodPost, "/v1/users/authenticate", app.createAuthenticationTokenHandler)
	router.HandlerFunc(http.MethodGet, "/v1/users/logout", app.requireAuthenticatedUser(app.invalidateAuthenticationTokenHandler))

	router.HandlerFunc(http.MethodGet, "/v1/search/movies", app.requireAuthenticatedUser(app.searchMoviesHandler))
	router.HandlerFunc(http.MethodGet, "/v1/search/tv", app.requireAuthenticatedUser(app.searchTvHandler))
	router.HandlerFunc(http.MethodGet, "/v1/search/people", app.requireAuthenticatedUser(app.searchPeopleHandler))

	router.HandlerFunc(http.MethodGet, "/v1/movies/:id", app.requireAuthenticatedUser(app.getMovieByIdHandler))

	router.HandlerFunc(http.MethodGet, "/v1/tv/:id", app.requireAuthenticatedUser(app.getTvByIdHandler))
	router.HandlerFunc(http.MethodGet, "/v1/tv/:id/seasons", app.requireAuthenticatedUser(app.getTvSeasonsHandler))
	router.HandlerFunc(http.MethodGet, "/v1/tv/:id/seasons/:season/episodes", app.requireAuthenticatedUser(app.getTvEpisodesHandler))
	router.HandlerFunc(http.MethodGet, "/v1/tv/:id/seasons/:season/episodes/:episode", app.requireAuthenticatedUser(app.getTvEpisodeHandler))

	router.HandlerFunc(http.MethodGet, "/v1/people/:id", app.requireAuthenticatedUser(app.getPersonByIdHandler))

	router.HandlerFunc(http.MethodGet, "/v1/cast/movies/:id", app.requireAuthenticatedUser(app.getMovieCastHandler))
	router.HandlerFunc(http.MethodGet, "/v1/cast/tv/:id", app.requireAuthenticatedUser(app.getTvCastHandler))

	router.HandlerFunc(http.MethodGet, "/v1/watch/movies/:id", app.requireAuthenticatedUser(app.watchMovieHandler))
	router.HandlerFunc(http.MethodGet, "/v1/watch/tv/:id", app.requireAuthenticatedUser(app.watchTvHandler))

	router.HandlerFunc(http.MethodGet, "/v1/watchlist/movies", app.requireAuthenticatedUser(app.getMoviesWatchlistHandler))
	router.HandlerFunc(http.MethodPost, "/v1/watchlist/movies", app.requireAuthenticatedUser(app.addMovieToWatchlistHandler))
	router.HandlerFunc(http.MethodDelete, "/v1/watchlist/movies/:id", app.requireAuthenticatedUser(app.removeMovieFromWatchlistHandler))

	return app.recoverPanic(app.enableCORS(app.authenticate(router)))
}
