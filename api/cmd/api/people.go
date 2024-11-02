package main

import (
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
)

type personResponse struct {
	ID         int64   `json:"id"`
	Name       string  `json:"name"`
	Biography  string  `json:"biography"`
	Birthday   string  `json:"birthday"`
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

	profile_url := ""
	if person.ProfilePath != "" {
		profile_url = tmdb.GetImageURL(person.ProfilePath, "w185")
	}

	response := personResponse{
		ID:         person.ID,
		Name:       person.Name,
		Biography:  person.Biography,
		Birthday:   person.Birthday,
		ProfileUrl: profile_url,
		Popularity: person.Popularity,
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"person": response}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
