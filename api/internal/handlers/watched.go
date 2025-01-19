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

type WatchedHandler struct {
	Model      *data.Models
	TmdbClient *tmdbclient.Client
}

func (h *WatchedHandler) GetWatchedHandler(w http.ResponseWriter, r *http.Request) {
	user := context.GetUser(r)

	tmdbIds, err := h.Model.Watched.GetWatched(int32(user.ID))
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

	resp := &types.Watched{
		Movies: movies,
		Tv:     tvShows,
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"watched": resp}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) GetMovieWatchedHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	user := context.GetUser(r)

	watchedStatus, err := h.Model.Watched.IsMovieOnWatched(int32(id), int32(user.ID))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"in_watched": watchedStatus}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) AddMovieToWatchedHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	user := context.GetUser(r)

	err = h.Model.Watched.AddMovieToWatched(int32(id), int32(user.ID))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"message": "movie successfully added to watched"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) DeleteMovieFromWatchedHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	user := context.GetUser(r)

	err = h.Model.Watched.RemoveMovieFromWatched(int32(id), int32(user.ID))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"message": "movie successfully deleted from watched"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) GetTvWatchedHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	user := context.GetUser(r)

	watchedStatus, err := h.Model.Watched.IsTvOnWatched(int32(id), int32(user.ID))
	if err != nil {
		if err.Error() != "record not found" {
			errors.ServerErrorResponse(w, r, err)
			return
		}
		watchedStatus = types.WatchedTv{
			Id:       int64(id),
			Progress: 0,
			Status:   "not watched",
			Seasons:  nil,
		}
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"watched_tv": watchedStatus}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) AddTvToWatchedHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	user := context.GetUser(r)

	tv, err := h.TmdbClient.GetTv(int(id))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = h.Model.Watched.AddTvToWatched(int32(id), int32(user.ID), int32(tv.NumberOfSeasons), int32(tv.NumberOfEpisodes))
	if err != nil {
		if err.Error() != "record not found" {
			errors.ServerErrorResponse(w, r, err)
			return
		}
	}

	for i, season := range tv.Seasons {
		err = h.Model.Watched.AddTvSeasonToWatched(int32(id), int32(user.ID), int32(i+1), int32(season.EpisodeCount))
		if err != nil {
			if err.Error() != "record not found" {
				errors.ServerErrorResponse(w, r, err)
				return
			}
		}

		for j := 1; j <= season.EpisodeCount; j++ {
			err = h.Model.Watched.AddTvEpisodeToWatched(int32(id), int32(user.ID), int32(i+1), int32(j))
			if err != nil {
				if err.Error() != "record not found" {
					errors.ServerErrorResponse(w, r, err)
					return
				}
			}
		}
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"message": "tv show successfully added to watched"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) DeleteTvFromWatchedHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	user := context.GetUser(r)

	err = h.Model.Watched.RemoveTvFromWatched(int32(id), int32(user.ID))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"message": "tv show successfully deleted from watched"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) GetTvSeasonWatchedHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	season, err := utils.ReadPathParam(r, "season_number")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	user := context.GetUser(r)

	watchedStatus, err := h.Model.Watched.IsTvSeasonOnWatched(int32(id), int32(user.ID), int32(season))
	if err != nil {
		if err.Error() != "record not found" {
			errors.ServerErrorResponse(w, r, err)
			return
		}
		watchedStatus = types.WatchedTvSeason{
			Episodes:     nil,
			SeasonNumber: season,
			Status:       "not watched",
		}
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"watched_season": watchedStatus}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) AddTvSeasonToWatchedHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	season, err := utils.ReadPathParam(r, "season_number")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	user := context.GetUser(r)

	tv, err := h.TmdbClient.GetTv(int(id))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = h.Model.Watched.AddTvToWatched(int32(id), int32(user.ID), int32(tv.NumberOfSeasons), int32(tv.NumberOfEpisodes))
	if err != nil {
		if err.Error() != "record not found" {
			errors.ServerErrorResponse(w, r, err)
			return
		}
	}

	err = h.Model.Watched.AddTvSeasonToWatched(int32(id), int32(user.ID), int32(season), int32(tv.Seasons[season-1].EpisodeCount))
	if err != nil {
		if err.Error() != "record not found" {
			errors.ServerErrorResponse(w, r, err)
			return
		}
	}

	for i := 1; i <= tv.Seasons[season-1].EpisodeCount; i++ {
		err = h.Model.Watched.AddTvEpisodeToWatched(int32(id), int32(user.ID), int32(season), int32(i))
		if err != nil {
			if err.Error() != "record not found" {
				errors.ServerErrorResponse(w, r, err)
				return
			}
		}
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"message": "tv season successfully added to watched"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) DeleteTvSeasonFromWatchedHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	season, err := utils.ReadPathParam(r, "season_number")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	user := context.GetUser(r)

	err = h.Model.Watched.RemoveTvSeasonFromWatched(int32(id), int32(user.ID), int32(season))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"message": "tv season successfully deleted from watched"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) GetTvEpisodeWatchedHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	season, err := utils.ReadPathParam(r, "season_number")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	episode, err := utils.ReadPathParam(r, "episode_number")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	user := context.GetUser(r)

	watchedStatus, err := h.Model.Watched.IsTvEpisodeOnWatched(int32(id), int32(user.ID), int32(season), int32(episode))
	if err != nil {

		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"in_watched": watchedStatus}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) AddTvEpisodeToWatchedHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	season, err := utils.ReadPathParam(r, "season_number")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	episode, err := utils.ReadPathParam(r, "episode_number")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	user := context.GetUser(r)

	tv, err := h.TmdbClient.GetTv(int(id))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = h.Model.Watched.AddTvToWatched(int32(id), int32(user.ID), int32(tv.NumberOfSeasons), int32(tv.NumberOfEpisodes))
	if err != nil {
		if err.Error() != "record not found" {
			errors.ServerErrorResponse(w, r, err)
			return
		}
	}

	err = h.Model.Watched.AddTvSeasonToWatched(int32(id), int32(user.ID), int32(season), int32(tv.Seasons[season-1].EpisodeCount))
	if err != nil {
		if err.Error() != "record not found" {
			errors.ServerErrorResponse(w, r, err)
			return
		}
	}

	err = h.Model.Watched.AddTvEpisodeToWatched(int32(id), int32(user.ID), int32(season), int32(episode))
	if err != nil {
		if err.Error() != "record not found" {
			errors.ServerErrorResponse(w, r, err)
			return
		}
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"message": "tv episode successfully added to watched"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchedHandler) DeleteTvEpisodeFromWatchedHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	season, err := utils.ReadPathParam(r, "season_number")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	episode, err := utils.ReadPathParam(r, "episode_number")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	user := context.GetUser(r)

	err = h.Model.Watched.RemoveTvEpisodeFromWatched(int32(id), int32(user.ID), int32(season), int32(episode))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"message": "tv episode successfully deleted from watched"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
