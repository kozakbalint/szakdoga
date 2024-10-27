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

	router.HandlerFunc(http.MethodGet, "/v1/movies/:id", app.getMovieByIdHandler)
	router.HandlerFunc(http.MethodGet, "/v1/search/movies", app.searchMoviesHandler)

	return app.recoverPanic(app.enableCORS(app.authenticate(router)))
}
