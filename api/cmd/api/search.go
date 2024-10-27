package main

import (
	"errors"
	"net/http"
)

type movieSearchResponse struct {
	ID          int64   `json:"id"`
	Title       string  `json:"title"`
	Overview    string  `json:"overview"`
	ReleaseDate string  `json:"release_date"`
	Popularity  float32 `json:"popularity"`
}

type tvSearchResponse struct {
	ID           int64   `json:"id"`
	Name         string  `json:"name"`
	Overview     string  `json:"overview"`
	FirstAirDate string  `json:"first_air_date"`
	Popularity   float32 `json:"popularity"`
}

type personSearchResponse struct {
	ID         int64   `json:"id"`
	Name       string  `json:"name"`
	Popularity float32 `json:"popularity"`
}

func (app *application) searchMoviesHandler(w http.ResponseWriter, r *http.Request) {
	queryParams, err := app.readQueryParams(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	query := queryParams["q"]
	if query == "" {
		app.badRequestResponse(w, r, errors.New("missing query parameter"))
		return
	}

	movies, err := app.tmdb.GetSearchMovies(query, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	var response []movieSearchResponse
	for _, movie := range movies.Results {
		response = append(response, movieSearchResponse{
			ID:          movie.ID,
			Title:       movie.Title,
			Overview:    movie.Overview,
			ReleaseDate: movie.ReleaseDate,
			Popularity:  movie.Popularity,
		})
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"movies": response}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) searchPeopleHandler(w http.ResponseWriter, r *http.Request) {
	queryParams, err := app.readQueryParams(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	query := queryParams["q"]
	if query == "" {
		app.badRequestResponse(w, r, errors.New("missing query parameter"))
		return
	}

	people, err := app.tmdb.GetSearchPeople(query, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	var response []personSearchResponse
	for _, person := range people.Results {
		response = append(response, personSearchResponse{
			ID:         person.ID,
			Name:       person.Name,
			Popularity: person.Popularity,
		})
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"people": response}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) searchTvHandler(w http.ResponseWriter, r *http.Request) {
	queryParams, err := app.readQueryParams(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	query := queryParams["q"]
	if query == "" {
		app.badRequestResponse(w, r, errors.New("missing query parameter"))
		return
	}

	tv, err := app.tmdb.GetSearchTVShow(query, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	var response []tvSearchResponse
	for _, show := range tv.Results {
		response = append(response, tvSearchResponse{
			ID:           show.ID,
			Name:         show.Name,
			Overview:     show.Overview,
			FirstAirDate: show.FirstAirDate,
			Popularity:   show.Popularity,
		})
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"tv": response}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
