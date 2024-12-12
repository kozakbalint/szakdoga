package handlers

import (
	"net/http"
	"time"

	tmdb "github.com/cyruzin/golang-tmdb"
	"github.com/kozakbalint/szakdoga/api/internal/data"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/repository"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type WatchlistHandler struct {
	Tmdb       *tmdb.Client
	Models     *data.Models
	Repository *repository.Queries
}

type MovieWatchlistResponse struct {
	ID       int64      `json:"id"`
	Movie    data.Movie `json:"movie"`
	AddedAt  time.Time  `json:"added_at"`
	UpdateAt time.Time  `json:"updated_at"`
	Watched  bool       `json:"watched"`
}

func (h *WatchlistHandler) GetMoviesWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	user := utils.ContextGetUser(r)
	if user == nil {
		errors.AuthenticationRequiredResponse(w, r)
		return
	}

	moviesWatchlist, err := h.Models.MoviesWatchlist.GetWatchlist(user.ID)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	var watchlistResponse []MovieWatchlistResponse
	for _, entry := range moviesWatchlist.Entries {
		movie, err := h.Models.Movies.Get(entry.MovieID)
		if err != nil || movie == nil {
			errors.ServerErrorResponse(w, r, err)
			return
		}
		watchlistResponse = append(watchlistResponse, MovieWatchlistResponse{
			ID:       entry.ID,
			Movie:    *movie,
			AddedAt:  entry.AddedAt,
			UpdateAt: entry.UpdateAt,
			Watched:  entry.Watched,
		})
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"watchlist": watchlistResponse}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchlistHandler) AddMovieToWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	user := utils.ContextGetUser(r)
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
		switch err {
		case data.ErrRecordNotFound:
			break
		default:
			errors.ServerErrorResponse(w, r, err)
			return
		}
	}

	if movie == nil {
		tmdb_movie, err := h.Tmdb.GetMovieDetails(int(input.TmdbID), nil)
		if err != nil || tmdb_movie == nil {
			errors.ServerErrorResponse(w, r, err)
			return
		}

		genres := []string{}
		for _, genre := range tmdb_movie.Genres {
			genres = append(genres, genre.Name)
		}

		movie = &data.Movie{
			TmdbID:      int(input.TmdbID),
			Title:       tmdb_movie.Title,
			ReleaseDate: tmdb_movie.ReleaseDate,
			PosterURL:   tmdb.GetImageURL(tmdb_movie.PosterPath, "w500"),
			Overview:    tmdb_movie.Overview,
			Genres:      genres,
			VoteAverage: tmdb_movie.VoteAverage,
			Runtime:     tmdb_movie.Runtime,
		}

		movie, err = h.Models.Movies.Insert(movie)
		if err != nil {
			errors.ServerErrorResponse(w, r, err)
			return
		}
	}

	moviesWatchlistEntry := &data.MoviesWatchlistEntry{
		UserID:  user.ID,
		MovieID: movie.ID,
		Watched: false,
	}

	moviesWatchlistEntry, err = h.Models.MoviesWatchlist.Insert(moviesWatchlistEntry)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusCreated, utils.Envelope{"message": "movie added to watchlist"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchlistHandler) RemoveMovieFromWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	user := utils.ContextGetUser(r)
	if user == nil {
		errors.AuthenticationRequiredResponse(w, r)
		return
	}

	id, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	_, err = h.Models.MoviesWatchlist.GetWatchlistEntry(user.ID, id)
	if err != nil {
		switch err {
		case data.ErrRecordNotFound:
			errors.NotFoundResponse(w, r)
		default:
			errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Models.MoviesWatchlist.DeleteWatchlistEntry(id)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"message": "movie removed from watchlist"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
