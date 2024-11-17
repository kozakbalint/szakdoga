package main

import (
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
)

type tvResponse struct {
	ID           int64  `json:"id"`
	Name         string `json:"name"`
	Overview     string `json:"overview"`
	FirstAirDate string `json:"first_air_date"`
	PosterUrl    string `json:"poster_url"`
	Genres       []struct {
		ID   int64  `json:"id"`
		Name string `json:"name"`
	} `json:"genres"`
	NumberOfSeasons  int     `json:"number_of_seasons"`
	NumberOfEpisodes int     `json:"number_of_episodes"`
	Popularity       float32 `json:"popularity"`
	VoteAverage      float32 `json:"vote_average"`
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

	poster_url := ""
	if tv.PosterPath != "" {
		poster_url = tmdb.GetImageURL(tv.PosterPath, "w500")
	}

	response := tvResponse{
		ID:           tv.ID,
		Name:         tv.Name,
		Overview:     tv.Overview,
		FirstAirDate: tv.FirstAirDate,
		PosterUrl:    poster_url,
		Genres:       tv.Genres,
		Popularity:   tv.Popularity,
		VoteAverage:  tv.VoteAverage,
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"tv": response}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

type tvSeasonsResponse struct {
	TvID            int64    `json:"tv_id"`
	NumberOfSeasons int      `json:"number_of_seasons"`
	Seasons         []Season `json:"seasons"`
}

type Season struct {
	SeasonNumber int       `json:"season_number"`
	EpisodeCount int       `json:"episode_count"`
	Name         string    `json:"name"`
	Overview     string    `json:"overview"`
	PosterUrl    string    `json:"poster_url"`
	VoteAverage  float32   `json:"vote_average"`
	Episodes     []Episode `json:"episodes"`
}

type Episode struct {
	AirDate       string  `json:"air_date"`
	EpisodeNumber int     `json:"episode_number"`
	Name          string  `json:"name"`
	Overview      string  `json:"overview"`
	Runtime       int     `json:"runtime"`
	StillUrl      string  `json:"still_url"`
	VoteAverage   float32 `json:"vote_average"`
}

func (app *application) getTvSeasonsHandler(w http.ResponseWriter, r *http.Request) {
	tvID, err := app.readIDParam(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	tvshow, err := app.tmdb.GetTVDetails(int(tvID), nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	var tvSeasons tvSeasonsResponse
	tvSeasons.TvID = tvshow.ID
	tvSeasons.NumberOfSeasons = tvshow.NumberOfSeasons

	for _, season := range tvshow.Seasons {
		if season.SeasonNumber == 0 {
			continue
		}
		seasonDetails, err := app.tmdb.GetTVSeasonDetails(int(tvID), int(season.SeasonNumber), nil)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
		var episodes []Episode
		for _, episode := range seasonDetails.Episodes {
			episodes = append(episodes, Episode{
				AirDate:       episode.AirDate,
				EpisodeNumber: episode.EpisodeNumber,
				Name:          episode.Name,
				Overview:      episode.Overview,
				Runtime:       episode.Runtime,
				StillUrl:      tmdb.GetImageURL(episode.StillPath, "w500"),
				VoteAverage:   episode.VoteAverage,
			})
		}

		tvSeasons.Seasons = append(tvSeasons.Seasons, Season{
			SeasonNumber: seasonDetails.SeasonNumber,
			EpisodeCount: len(episodes),
			Name:         seasonDetails.Name,
			Overview:     seasonDetails.Overview,
			VoteAverage:  seasonDetails.VoteAverage,
			PosterUrl:    tmdb.GetImageURL(seasonDetails.PosterPath, "w500"),
			Episodes:     episodes,
		})
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"seasons": tvSeasons}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
