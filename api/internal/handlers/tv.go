package handlers

import (
	"net/http"

	"github.com/kozakbalint/szakdoga/api/internal/data"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/tmdbclient"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type TvHandler struct {
	Models     *data.Models
	TmdbClient *tmdbclient.Client
}

func (h *TvHandler) GetTvByIDHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	tv, err := h.TmdbClient.GetTv(int(id))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"tv": tv}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *TvHandler) GetTvEpisodesHandler(w http.ResponseWriter, r *http.Request) {
	tvID, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	seasonNumber, err := utils.ReadSeasonParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	seasonDetails, err := h.TmdbClient.GetTvSeason(int(tvID), seasonNumber)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"season": seasonDetails}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *TvHandler) GetTvEpisodeHandler(w http.ResponseWriter, r *http.Request) {
	tvID, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	seasonNumber, err := utils.ReadSeasonParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	episodeNumber, err := utils.ReadEpisodeParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	episode, err := h.TmdbClient.GetTvEpisode(int(tvID), seasonNumber, episodeNumber)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"episode": episode}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
