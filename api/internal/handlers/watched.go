package handlers

import (
	e "errors"
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
	"github.com/kozakbalint/szakdoga/api/internal/context"
	"github.com/kozakbalint/szakdoga/api/internal/data"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type WatchedHandler struct {
	Models *data.Models
	Tmdb   *tmdb.Client
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

	if movie == nil {
		tmdbMovie, err := h.Tmdb.GetMovieDetails(int(input.MovieID), nil)
		if err != nil || tmdbMovie == nil {
			errors.ServerErrorResponse(w, r, err)
			return
		}

		genres := []string{}
		for _, genre := range tmdbMovie.Genres {
			genres = append(genres, genre.Name)
		}

		movie = &data.Movie{
			TmdbID:      int(input.MovieID),
			Title:       tmdbMovie.Title,
			ReleaseDate: tmdbMovie.ReleaseDate,
			PosterURL:   tmdb.GetImageURL(tmdbMovie.PosterPath, "w500"),
			Overview:    tmdbMovie.Overview,
			Genres:      genres,
			VoteAverage: tmdbMovie.VoteAverage,
			Runtime:     tmdbMovie.Runtime,
		}

		movie, err = h.Models.Movies.Insert(movie)
		if err != nil {
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
