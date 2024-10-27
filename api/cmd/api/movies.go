package main

import (
	"errors"
	"net/http"
)

type movieResponse struct {
	ID       int64  `json:"id"`
	Title    string `json:"title"`
	Overview string `json:"overview"`
}

func (app *application) getMovieByIdHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	movie, err := app.tmdb.GetMovieDetails(int(id), nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	response := movieResponse{
		ID:       movie.ID,
		Title:    movie.Title,
		Overview: movie.Overview,
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"movie": response}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) searchMoviesHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("query")
	if query == "" {
		app.badRequestResponse(w, r, errors.New("missing query parameter"))
		return
	}

	movies, err := app.tmdb.GetSearchMovies(query, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	var response []movieResponse
	for _, movie := range movies.Results {
		response = append(response, movieResponse{
			ID:       movie.ID,
			Title:    movie.Title,
			Overview: movie.Overview,
		})
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"movies": response}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
