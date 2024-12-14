package handlers

import (
	"net/http"

	"github.com/kozakbalint/szakdoga/api/internal/context"
	"github.com/kozakbalint/szakdoga/api/internal/data"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type WatchedHandler struct {
	Models *data.Models
}

func (h *WatchedHandler) AddWatchedMovieHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		MovieID int64 `json:"movie_id"`
	}

	err := utils.ReadJSON(w, r, &input)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	user := context.GetUser(r)
	if user == nil {
		errors.AuthenticationRequiredResponse(w, r)
		return
	}

	_, err = h.Models.WatchedMovies.AddWatchedMovie(user.ID, input.MovieID)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusCreated, utils.Envelope{"message": "Movie added to watched"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) GetWatchDatesByMovieHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		MovieID int64 `json:"movie_id"`
	}

	err := utils.ReadJSON(w, r, &input)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	user := context.GetUser(r)
	if user == nil {
		errors.AuthenticationRequiredResponse(w, r)
		return
	}

	watchedMovies, err := h.Models.WatchedMovies.GetWatchedMovie(user.ID, input.MovieID)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	watchDates := []string{}
	for _, watched := range *watchedMovies {
		watchDates = append(watchDates, watched.WatchedAt.Format("2006-01-02"))
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"watched_dates": watchDates}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) GetWatchedMoviesHandler(w http.ResponseWriter, r *http.Request) {
	user := context.GetUser(r)
	if user == nil {
		errors.AuthenticationRequiredResponse(w, r)
		return
	}

	watchedMovies, err := h.Models.WatchedMovies.GetWatchedMovies(user.ID)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"watched_movies": watchedMovies}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) RemoveWatchedMovieHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		MovieID int64 `json:"movie_id"`
	}

	err := utils.ReadJSON(w, r, &input)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	user := context.GetUser(r)
	if user == nil {
		errors.AuthenticationRequiredResponse(w, r)
		return
	}

	err = h.Models.WatchedMovies.DeleteWatchedMovie(user.ID, input.MovieID)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"message": "Movie removed from watched"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
