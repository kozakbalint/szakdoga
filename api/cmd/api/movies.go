package main

import (
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
)

type movieResponse struct {
	ID          int64   `json:"id"`
	Title       string  `json:"title"`
	Overview    string  `json:"overview"`
	ReleaseDate string  `json:"release_date"`
	PosterPath  string  `json:"poster_path"`
	Popularity  float32 `json:"popularity"`
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
		ID:          movie.ID,
		Title:       movie.Title,
		Overview:    movie.Overview,
		ReleaseDate: movie.ReleaseDate,
		PosterPath:  tmdb.GetImageURL(movie.PosterPath, "w185"),
		Popularity:  movie.Popularity,
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"movie": response}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
