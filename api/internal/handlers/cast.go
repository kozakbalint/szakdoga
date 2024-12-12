package handlers

import (
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type CastHandler struct {
	Tmdb *tmdb.Client
}

type MovieCastResponse struct {
	ID         int64   `json:"id"`
	Name       string  `json:"name"`
	Character  string  `json:"character"`
	ProfileURL string  `json:"profile_url"`
	Popularity float32 `json:"popularity"`
}

type TvCastResponse struct {
	ID                int64   `json:"id"`
	Name              string  `json:"name"`
	Roles             []Role  `json:"roles"`
	ProfileURL        string  `json:"profile_url"`
	TotalEpisodeCount int     `json:"total_episode_count"`
	Popularity        float64 `json:"popularity"`
}

type Role struct {
	Character    string `json:"character"`
	EpisodeCount int    `json:"episode_count"`
}

func (h *CastHandler) GetMovieCastHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	movie, err := h.Tmdb.GetMovieCredits(int(id), nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	var response []MovieCastResponse
	for i := range movie.Cast {
		cast := &movie.Cast[i]
		profileURL := ""
		if cast.ProfilePath != "" {
			profileURL = tmdb.GetImageURL(cast.ProfilePath, "w185")
		}

		response = append(response, MovieCastResponse{
			ID:         cast.ID,
			Name:       cast.Name,
			Character:  cast.Character,
			ProfileURL: profileURL,
			Popularity: cast.Popularity,
		})
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"cast": response}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *CastHandler) GetTvCastHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	tv, err := h.Tmdb.GetTVAggregateCredits(int(id), nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	var response []TvCastResponse
	for i := range tv.Cast {
		cast := &tv.Cast[i]
		profileURL := ""
		if cast.ProfilePath != "" {
			profileURL = tmdb.GetImageURL(cast.ProfilePath, "w185")
		}

		roles := []Role{}
		for _, role := range cast.Roles {
			roles = append(roles, Role{
				Character:    role.Character,
				EpisodeCount: role.EpisodeCount,
			})
		}

		response = append(response, TvCastResponse{
			ID:                cast.ID,
			Name:              cast.Name,
			Roles:             roles,
			ProfileURL:        profileURL,
			TotalEpisodeCount: cast.TotalEpisodeCount,
			Popularity:        cast.Popularity,
		})
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"cast": response}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
