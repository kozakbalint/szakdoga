package handlers

import (
	e "errors"
	"net/http"

	"github.com/kozakbalint/szakdoga/api/internal/data"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/tmdbclient"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type SearchHandler struct {
	Models     *data.Models
	TmdbClient *tmdbclient.Client
}

func (h *SearchHandler) SearchMoviesHandler(w http.ResponseWriter, r *http.Request) {
	queryParams, err := utils.ReadQueryParams(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	query := queryParams["q"]
	if query == "" {
		errors.BadRequestResponse(w, r, e.New("missing query parameter"))
		return
	}

	movies, err := h.TmdbClient.SearchMovies(query)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"movies": movies}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *SearchHandler) SearchTvHandler(w http.ResponseWriter, r *http.Request) {
	queryParams, err := utils.ReadQueryParams(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	query := queryParams["q"]
	if query == "" {
		errors.BadRequestResponse(w, r, e.New("missing query parameter"))
		return
	}

	tv, err := h.TmdbClient.SearchTv(query)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"tv": tv}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *SearchHandler) SearchPeopleHandler(w http.ResponseWriter, r *http.Request) {
	queryParams, err := utils.ReadQueryParams(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	query := queryParams["q"]
	if query == "" {
		errors.BadRequestResponse(w, r, e.New("missing query parameter"))
		return
	}

	people, err := h.TmdbClient.SearchPeople(query)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"people": people}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
