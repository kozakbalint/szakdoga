package main

import (
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
)

type personResponse struct {
	ID         int64   `json:"id"`
	Name       string  `json:"name"`
	ProfileUrl string  `json:"profile_url"`
	Popularity float32 `json:"popularity"`
}

func (app *application) getPersonByIdHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	person, err := app.tmdb.GetPersonDetails(int(id), nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	response := personResponse{
		ID:         person.ID,
		Name:       person.Name,
		ProfileUrl: tmdb.GetImageURL(person.ProfilePath, "w185"),
		Popularity: person.Popularity,
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"person": response}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
