package main

import (
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
)

func (app *application) getMovieCastHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	movie, err := app.tmdb.GetMovieCredits(int(id), nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	var response []MovieCastResponse
	for _, cast := range movie.Cast {
		profile_url := ""
		if cast.ProfilePath != "" {
			profile_url = tmdb.GetImageURL(cast.ProfilePath, "w185")
		}

		response = append(response, MovieCastResponse{
			ID:         cast.ID,
			Name:       cast.Name,
			Character:  cast.Character,
			ProfileUrl: profile_url,
			Popularity: cast.Popularity,
		})
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"cast": response}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) getTvCastHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	tv, err := app.tmdb.GetTVAggregateCredits(int(id), nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	var response []TvCastResponse
	for _, cast := range tv.Cast {
		profile_url := ""
		if cast.ProfilePath != "" {
			profile_url = tmdb.GetImageURL(cast.ProfilePath, "w185")
		}

		roles := []Role{}
		for _, role := range cast.Roles {
			roles = append(roles, Role{
				Character:    role.Character,
				EpisodeCount: role.EpisodeCount,
			})
		}

		response = append(response, TvCastResponse{
			ID:                cast.ID,
			Name:              cast.Name,
			Roles:             roles,
			ProfileUrl:        profile_url,
			TotalEpisodeCount: cast.TotalEpisodeCount,
			Popularity:        cast.Popularity,
		})
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"cast": response}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
