package main

import (
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
)

type movieResponse struct {
	ID          int64  `json:"id"`
	Title       string `json:"title"`
	Overview    string `json:"overview"`
	ReleaseDate string `json:"release_date"`
	Genres      []struct {
		ID   int64  `json:"id"`
		Name string `json:"name"`
	} `json:"genres"`
	Runtime     int     `json:"runtime"`
	PosterUrl   string  `json:"poster_url"`
	Popularity  float32 `json:"popularity"`
	VoteAverage float32 `json:"vote_average"`
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

	poster_url := ""
	if movie.PosterPath != "" {
		poster_url = tmdb.GetImageURL(movie.PosterPath, "w500")
	}

	response := movieResponse{
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
