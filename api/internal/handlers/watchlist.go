package handlers

import (
	"net/http"

	"github.com/kozakbalint/szakdoga/api/internal/context"
	"github.com/kozakbalint/szakdoga/api/internal/data"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/tmdbclient"
	"github.com/kozakbalint/szakdoga/api/internal/types"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type WatchlistHandler struct {
	Model      *data.Models
	TmdbClient *tmdbclient.Client
}

func (h *WatchlistHandler) GetWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	user := context.GetUser(r)

	tmdbIds, err := h.Model.Watchlist.GetWatchlist(int32(user.ID))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	var movies []types.SearchMovie
	var tvShows []types.SearchTv

	for _, id := range tmdbIds.Movies {
		movie, err := h.TmdbClient.GetMovie(int(*id))
		if err != nil {
			errors.ServerErrorResponse(w, r, err)
			return
		}

		movies = append(movies, types.SearchMovie{
			Id:          movie.Id,
			Title:       movie.Title,
			Overview:    movie.Overview,
			PosterUrl:   movie.PosterUrl,
			ReleaseDate: movie.ReleaseDate,
			VoteAverage: movie.VoteAverage,
			Popularity:  movie.Popularity,
		})
	}

	for _, id := range tmdbIds.Tv {
		tvShow, err := h.TmdbClient.GetTv(int(*id))
		if err != nil {
			errors.ServerErrorResponse(w, r, err)
			return
		}

		tvShows = append(tvShows, types.SearchTv{
			Id:          tvShow.Id,
			Title:       tvShow.Name,
			Overview:    tvShow.Overview,
			PosterUrl:   tvShow.PosterUrl,
			ReleaseDate: tvShow.FirstAirDate,
			VoteAverage: tvShow.VoteAverage,
			Popularity:  tvShow.Popularity,
		})
	}

	resp := &types.Watchlist{
		Movies: movies,
		Tv:     tvShows,
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"watchlist": resp}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchlistHandler) GetMovieWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	user := context.GetUser(r)

	watchlistStatus, err := h.Model.Watchlist.IsMovieOnWatchlist(int32(id), int32(user.ID))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"in_watchlist": watchlistStatus}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchlistHandler) GetTvShowWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	user := context.GetUser(r)

	watchlistStatus, err := h.Model.Watchlist.IsTvShowOnWatchlist(int32(id), int32(user.ID))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"in_watchlist": watchlistStatus}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchlistHandler) AddMovieToWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	user := context.GetUser(r)

	err = h.Model.Watchlist.AddMovieToWatchlist(int32(id), int32(user.ID))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"message": "movie successfully added to watchlist"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchlistHandler) AddTvShowToWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	user := context.GetUser(r)

	err = h.Model.Watchlist.AddTvShowToWatchlist(int32(id), int32(user.ID))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"message": "tv show successfully added to watchlist"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchlistHandler) DeleteMovieFromWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	user := context.GetUser(r)

	err = h.Model.Watchlist.RemoveMovieFromWatchlist(int32(id), int32(user.ID))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"message": "movie successfully deleted from watchlist"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchlistHandler) DeleteTvShowFromWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	user := context.GetUser(r)

	err = h.Model.Watchlist.RemoveTvShowFromWatchlist(int32(id), int32(user.ID))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"message": "tv show successfully deleted from watchlist"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
