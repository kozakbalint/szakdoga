package main

import (
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
)

type castResponse struct {
	ID         int64   `json:"id"`
	Name       string  `json:"name"`
	Character  string  `json:"character"`
	ProfileUrl string  `json:"profile_url"`
	Popularity float32 `json:"popularity"`
}

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

	var response []castResponse
	for _, cast := range movie.Cast {
		profile_url := ""
		if cast.ProfilePath != "" {
			profile_url = tmdb.GetImageURL(cast.ProfilePath, "w185")
		}

		response = append(response, castResponse{
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

type tvCastResponse struct {
	ID                int64   `json:"id"`
	Name              string  `json:"name"`
	Roles             []Role  `json:"roles"`
	ProfileUrl        string  `json:"profile_url"`
	TotalEpisodeCount int     `json:"total_episode_count"`
	Popularity        float64 `json:"popularity"`
}

type Role struct {
	Character    string `json:"character"`
	EpisodeCount int    `json:"episode_count"`
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

	var response []tvCastResponse
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

		response = append(response, tvCastResponse{
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
