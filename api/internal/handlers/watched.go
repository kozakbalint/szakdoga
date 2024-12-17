package handlers

import (
	e "errors"
	"net/http"

	"github.com/kozakbalint/szakdoga/api/internal/context"
	"github.com/kozakbalint/szakdoga/api/internal/data"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/tmdbclient"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type WatchedHandler struct {
	Models     *data.Models
	TmdbClient *tmdbclient.Client
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

	movie, err := h.Models.Movies.GetByTmdbID(int(input.MovieID))
	if err != nil {
		if !e.Is(err, data.ErrNotFound) {
			errors.ServerErrorResponse(w, r, err)
			return
		}
	}

	_, err = h.Models.WatchedMovies.AddWatchedMovie(user.ID, movie.ID)
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
	movieID, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	user := context.GetUser(r)
	if user == nil {
		errors.AuthenticationRequiredResponse(w, r)
		return
	}

	movie, err := h.Models.Movies.GetByTmdbID(int(movieID))
	if movie == nil {
		err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"watched_dates": []string{}}, nil)
		if err != nil {
			errors.ServerErrorResponse(w, r, err)
		}
		return
	}
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	watchedMovies, err := h.Models.WatchedMovies.GetWatchedMovie(user.ID, movie.ID)
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

type WatchedMovieResponse struct {
	ID        int64      `json:"id"`
	Movie     data.Movie `json:"movie"`
	WatchedAt string     `json:"watched_at"`
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
	var watchedMoviesResponse []WatchedMovieResponse
	for _, watched := range watchedMovies {
		movie, err := h.Models.Movies.Get(watched.MovieID)
		if err != nil {
			errors.ServerErrorResponse(w, r, err)
			return
		}
		watchedMoviesResponse = append(watchedMoviesResponse, WatchedMovieResponse{
			ID:        watched.ID,
			Movie:     *movie,
			WatchedAt: watched.WatchedAt.Format("2006-01-02"),
		})
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"watched_movies": watchedMoviesResponse}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) RemoveWatchedMovieHandler(w http.ResponseWriter, r *http.Request) {
	movieID, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	user := context.GetUser(r)
	if user == nil {
		errors.AuthenticationRequiredResponse(w, r)
		return
	}

	movie, err := h.Models.Movies.GetByTmdbID(int(movieID))
	if err != nil || movie == nil {
		errors.NotFoundResponse(w, r)
		return
	}

	err = h.Models.WatchedMovies.DeleteWatchedMoviesForMovie(user.ID, movie.ID)
	if err != nil {
		if e.Is(err, data.ErrNotFound) {
			errors.NotFoundResponse(w, r)
			return
		}
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"message": "Movie removed from watched"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) GetWatchedTvShowsHandler(w http.ResponseWriter, r *http.Request) {
	user := context.GetUser(r)
	if user == nil {
		errors.AuthenticationRequiredResponse(w, r)
		return
	}

	watchedTvShows, err := h.Models.WatchedTV.GetWatchedTVs(user.ID)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"watched_tv_shows": watchedTvShows}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) AddWatchedTvShowHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		TvID int64 `json:"tv_id"`
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

	tvShow, err := h.Models.TVShows.GetByTmdbID(int(input.TvID))
	if err != nil {
		if !e.Is(err, data.ErrNotFound) {
			errors.ServerErrorResponse(w, r, err)
			return
		}
	}

	_, err = h.Models.WatchedTV.AddWatchedShow(user.ID, tvShow.ID)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusCreated, utils.Envelope{"message": "TV Show added to watched"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) AddWatchedTvShowEpisodesHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		TvID      int64 `json:"tv_id"`
		Season    int   `json:"season"`
		Episode   int   `json:"episode"`
		WatchedAt string
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

	tvShow, err := h.Models.TVShows.GetByTmdbID(int(input.TvID))
	if err != nil {
		if !e.Is(err, data.ErrNotFound) {
			errors.ServerErrorResponse(w, r, err)
			return
		}
	}

	tvSeasons, err := h.Models.TVShows.GetSeasons(input.TvID)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	tvEpisodes, err := h.Models.TVShows.GetEpisodesBySeasonID(tvSeasons[input.Season].ID)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	_, err = h.Models.WatchedTV.AddWatchedEpisode(user.ID, tvShow.ID, int64(tvEpisodes[input.Episode].ID))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusCreated, utils.Envelope{"message": "TV Show episode added to watched"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
