package main

import (
	"errors"
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
)

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

	var response []MovieSearchResponse
	for _, movie := range movies.Results {
		poster_url := ""
		if movie.PosterPath != "" {
			poster_url = tmdb.GetImageURL(movie.PosterPath, "w92")
		}
		response = append(response, MovieSearchResponse{
			ID:          movie.ID,
			Title:       movie.Title,
			Overview:    movie.Overview,
			PosterUrl:   poster_url,
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

	var response []PersonSearchResponse
	for _, person := range people.Results {
		profile_url := ""
		if person.ProfilePath != "" {
			profile_url = tmdb.GetImageURL(person.ProfilePath, "w185")
		}
		response = append(response, PersonSearchResponse{
			ID:         person.ID,
			Name:       person.Name,
			ProfileUrl: profile_url,
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

	var response []TvSearchResponse
	for _, show := range tv.Results {
		posterUrl := ""
		if show.PosterPath != "" {
			posterUrl = tmdb.GetImageURL(show.PosterPath, "w92")
		}

		response = append(response, TvSearchResponse{
			ID:           show.ID,
			Name:         show.Name,
			Overview:     show.Overview,
			PosterUrl:    posterUrl,
			FirstAirDate: show.FirstAirDate,
			Popularity:   show.Popularity,
		})
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"tv": response}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
