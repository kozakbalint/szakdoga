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
	router.HandlerFunc(http.MethodPost, "/v1/tokens/authentication", app.createAuthenticationTokenHandler)

	router.HandlerFunc(http.MethodGet, "/v1/search/movies", app.searchMoviesHandler)
	router.HandlerFunc(http.MethodGet, "/v1/search/tv", app.searchTvHandler)
	router.HandlerFunc(http.MethodGet, "/v1/search/people", app.searchPeopleHandler)

	router.HandlerFunc(http.MethodGet, "/v1/movies/:id", app.getMovieByIdHandler)

	router.HandlerFunc(http.MethodGet, "/v1/tv/:id", app.getTvByIdHandler)
	router.HandlerFunc(http.MethodGet, "/v1/tv/:id/seasons", app.getTvSeasonsHandler)
	router.HandlerFunc(http.MethodGet, "/v1/tv/:id/seasons/:season/episodes", app.getTvEpisodesHandler)
	router.HandlerFunc(http.MethodGet, "/v1/tv/:id/seasons/:season/episodes/:episode", app.getTvEpisodeHandler)

	router.HandlerFunc(http.MethodGet, "/v1/people/:id", app.getPersonByIdHandler)

	router.HandlerFunc(http.MethodGet, "/v1/cast/movies/:id", app.getMovieCastHandler)
	router.HandlerFunc(http.MethodGet, "/v1/cast/tv/:id", app.getTvCastHandler)

	router.HandlerFunc(http.MethodGet, "/v1/watch/movies/:id", app.watchMovieHandler)
	router.HandlerFunc(http.MethodGet, "/v1/watch/tv/:id", app.watchTvHandler)

	return app.recoverPanic(app.enableCORS(app.authenticate(router)))
}
