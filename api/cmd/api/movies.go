package main

import (
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
)

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

	poster_url := ""
	if movie.PosterPath != "" {
		poster_url = tmdb.GetImageURL(movie.PosterPath, "w500")
	}

	response := MovieResponse{
		ID:          movie.ID,
		Title:       movie.Title,
		Overview:    movie.Overview,
		ReleaseDate: movie.ReleaseDate,
		Genres:      movie.Genres,
		Runtime:     movie.Runtime,
		PosterUrl:   poster_url,
		Popularity:  movie.Popularity,
		VoteAverage: movie.VoteAverage,
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"movie": response}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
