package handlers

import (
	"net/http"

	"github.com/kozakbalint/szakdoga/api/internal/data"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/tmdbclient"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type MovieHandler struct {
	Models     *data.Models
	TmdbClient *tmdbclient.Client
}

func (h *MovieHandler) GetMovieByIDHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	movie, err := h.TmdbClient.GetMovie(int(id))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"movie": movie}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
