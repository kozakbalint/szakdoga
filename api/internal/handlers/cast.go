package handlers

import (
	"net/http"

	"github.com/kozakbalint/szakdoga/api/internal/data"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/tmdbclient"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type CastHandler struct {
	Models     *data.Models
	TmdbClient *tmdbclient.Client
}

func (h *CastHandler) GetMovieCastHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	cast, err := h.TmdbClient.GetMovieCast(int(id))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"cast": cast}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *CastHandler) GetTvCastHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	cast, err := h.TmdbClient.GetTvCast(int(id))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"cast": cast}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
