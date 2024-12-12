package handlers

import (
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type PeopleHandler struct {
	Tmdb *tmdb.Client
}

type PersonResponse struct {
	ID         int64   `json:"id"`
	Name       string  `json:"name"`
	Biography  string  `json:"biography"`
	Birthday   string  `json:"birthday"`
	ProfileURL string  `json:"profile_url"`
	Popularity float32 `json:"popularity"`
}

func (h *PeopleHandler) GetPersonByIDHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	person, err := h.Tmdb.GetPersonDetails(int(id), nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	profileURL := ""
	if person.ProfilePath != "" {
		profileURL = tmdb.GetImageURL(person.ProfilePath, "w185")
	}

	response := PersonResponse{
		ID:         person.ID,
		Name:       person.Name,
		Biography:  person.Biography,
		Birthday:   person.Birthday,
		ProfileURL: profileURL,
		Popularity: person.Popularity,
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"person": response}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
