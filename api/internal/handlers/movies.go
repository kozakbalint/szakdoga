package handlers

import (
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type MovieHandler struct {
	Tmdb *tmdb.Client
}

type MovieResponse struct {
	ID          int64   `json:"id"`
	Title       string  `json:"title"`
	Overview    string  `json:"overview"`
	ReleaseDate string  `json:"release_date"`
	Genres      Genres  `json:"genres"`
	Runtime     int     `json:"runtime"`
	PosterURL   string  `json:"poster_url"`
	Popularity  float32 `json:"popularity"`
	VoteAverage float32 `json:"vote_average"`
}

type Genres []struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

func (h *MovieHandler) GetMovieByIDHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	movie, err := h.Tmdb.GetMovieDetails(int(id), nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	posterURL := ""
	if movie.PosterPath != "" {
		posterURL = tmdb.GetImageURL(movie.PosterPath, "w500")
	}

	response := MovieResponse{
		ID:          movie.ID,
		Title:       movie.Title,
		Overview:    movie.Overview,
		ReleaseDate: movie.ReleaseDate,
		Genres:      movie.Genres,
		Runtime:     movie.Runtime,
		PosterURL:   posterURL,
		Popularity:  movie.Popularity,
		VoteAverage: movie.VoteAverage,
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"movie": response}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
