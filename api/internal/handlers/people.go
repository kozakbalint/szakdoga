package handlers

import (
	"net/http"

	"github.com/kozakbalint/szakdoga/api/internal/data"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/tmdbclient"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type PeopleHandler struct {
	Models     *data.Models
	TmdbClient *tmdbclient.Client
}

func (h *PeopleHandler) GetPersonByIDHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadPathParam(r, "id")
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	person, err := h.TmdbClient.GetPerson(int(id))
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"person": person}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
