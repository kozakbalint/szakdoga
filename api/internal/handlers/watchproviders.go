package handlers

import (
	"net/http"

	"github.com/kozakbalint/szakdoga/api/internal/data"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/tmdbclient"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type WatchProviderHandler struct {
	Models     *data.Models
	TmdbClient *tmdbclient.Client
}

func (h *WatchProviderHandler) WatchProvidersMovieHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	providers, err := h.TmdbClient.GetMovieWatchProviders(int(id))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"providers": providers}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchProviderHandler) WatchProvidersTvHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	providers, err := h.TmdbClient.GetTvWatchProviders(int(id))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"providers": providers}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
