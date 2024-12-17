package handlers

import (
	e "errors"
	"fmt"
	"net/http"

	"github.com/kozakbalint/szakdoga/api/internal/context"
	"github.com/kozakbalint/szakdoga/api/internal/data"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/tmdbclient"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type WatchlistHandler struct {
	Models     *data.Models
	TmdbClient *tmdbclient.Client
}

func (h *WatchlistHandler) GetMoviesWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	user := context.GetUser(r)
	if user == nil {
		errors.AuthenticationRequiredResponse(w, r)
		return
	}

	moviesWatchlist, err := h.Models.WatchlistMovies.GetWatchlist(user.ID)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"watchlist": moviesWatchlist}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchlistHandler) GetTvShowsWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	user := context.GetUser(r)
	if user == nil {
		errors.AuthenticationRequiredResponse(w, r)
		return
	}

	tvShowsWatchlist, err := h.Models.WatchlistTvShows.GetWatchlist(user.ID)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"watchlist": tvShowsWatchlist}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchlistHandler) AddMovieToWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	user := context.GetUser(r)
	if user == nil {
		errors.AuthenticationRequiredResponse(w, r)
		return
	}

	var input struct {
		TmdbID int64 `json:"tmdb_id"`
	}

	err := utils.ReadJSON(w, r, &input)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	movie, err := h.Models.Movies.GetByTmdbID(int(input.TmdbID))
	if err != nil {
		if !e.Is(err, data.ErrNotFound) {
			errors.ServerErrorResponse(w, r, err)
			return
		}
	}

	moviesWatchlistEntry := &data.WatchlistMoviesEntry{
		UserID:  user.ID,
		MovieID: movie.ID,
	}

	_, err = h.Models.WatchlistMovies.Insert(moviesWatchlistEntry)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusCreated, utils.Envelope{"message": "movie added to watchlist"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchlistHandler) AddTvShowToWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	user := context.GetUser(r)
	if user == nil {
		errors.AuthenticationRequiredResponse(w, r)
		return
	}

	var input struct {
		TmdbID int64 `json:"tmdb_id"`
	}

	err := utils.ReadJSON(w, r, &input)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	tvShow, err := h.Models.TVShows.GetByTmdbID(int(input.TmdbID))
	if err != nil {
		if !e.Is(err, data.ErrNotFound) {
			fmt.Println(err)
			errors.ServerErrorResponse(w, r, err)
			return
		}
	}

	tvShowsWatchlistEntry := &data.WatchlistTVShowsEntry{
		UserID: user.ID,
		TVID:   tvShow.ID,
	}

	_, err = h.Models.WatchlistTvShows.Insert(tvShowsWatchlistEntry)
	if err != nil {
		fmt.Println(err)
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusCreated, utils.Envelope{"message": "tv show added to watchlist"}, nil)
	if err != nil {
		fmt.Println(err)
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchlistHandler) RemoveMovieFromWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	user := context.GetUser(r)
	if user == nil {
		errors.AuthenticationRequiredResponse(w, r)
		return
	}

	id, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	_, err = h.Models.WatchlistMovies.GetWatchlistEntry(user.ID, id)
	if err != nil {
		if e.Is(err, data.ErrNotFound) {
			errors.NotFoundResponse(w, r)
			return
		}
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = h.Models.WatchlistMovies.DeleteWatchlistEntry(id)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"message": "movie removed from watchlist"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchlistHandler) RemoveTvShowFromWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	user := context.GetUser(r)
	if user == nil {
		errors.AuthenticationRequiredResponse(w, r)
		return
	}

	id, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	_, err = h.Models.WatchlistTvShows.GetWatchlistEntry(user.ID, id)
	if err != nil {
		if e.Is(err, data.ErrNotFound) {
			errors.NotFoundResponse(w, r)
			return
		}
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = h.Models.WatchlistTvShows.DeleteWatchlistEntry(id)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"message": "tv show removed from watchlist"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
