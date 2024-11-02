package main

import (
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
)

type tvResponse struct {
	ID           int64   `json:"id"`
	Name         string  `json:"name"`
	Overview     string  `json:"overview"`
	FirstAirDate string  `json:"first_air_date"`
	PosterPath   string  `json:"poster_path"`
	Popularity   float32 `json:"popularity"`
}

func (app *application) getTvByIdHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	tv, err := app.tmdb.GetTVDetails(int(id), nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	response := tvResponse{
		ID:           tv.ID,
		Name:         tv.Name,
		Overview:     tv.Overview,
		FirstAirDate: tv.FirstAirDate,
		PosterPath:   tmdb.GetImageURL(tv.PosterPath, "w185"),
		Popularity:   tv.Popularity,
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"tv": response}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
