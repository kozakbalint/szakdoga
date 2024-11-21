package main

import (
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
)

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

	response := TvResponse{
		ID:               tv.ID,
		Name:             tv.Name,
		Overview:         tv.Overview,
		FirstAirDate:     tv.FirstAirDate,
		PosterUrl:        poster_url,
		Genres:           tv.Genres,
		NumberOfSeasons:  tv.NumberOfSeasons,
		NumberOfEpisodes: tv.NumberOfEpisodes,
		Popularity:       tv.Popularity,
		VoteAverage:      tv.VoteAverage,
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"tv": response}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) getTvSeasonsHandler(w http.ResponseWriter, r *http.Request) {
	tvID, err := app.readIDParam(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	tvDetails, err := app.tmdb.GetTVDetails(int(tvID), nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

	var tvSeasonsResponse = TvSeasonsResponse{
		TvID:        tvID,
		SeasonCount: tvDetails.NumberOfSeasons,
	}
	for _, season := range tvDetails.Seasons {
		if season.SeasonNumber == 0 {
			continue
		}

		var posterUrl = ""
		posterUrl = tmdb.GetImageURL(season.PosterPath, "w500")

		tvSeasonsResponse.SeasonsWithoutEpisodes = append(tvSeasonsResponse.SeasonsWithoutEpisodes, SeasonsWithoutEpisodes{
			SeasonNumber: season.SeasonNumber,
			EpisodeCount: season.EpisodeCount,
			Name:         season.Name,
			Overview:     season.Overview,
			PosterUrl:    posterUrl,
			VoteAverage:  season.VoteAverage,
		})
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"seasons": tvSeasonsResponse}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) getTvEpisodesHandler(w http.ResponseWriter, r *http.Request) {
	tvID, err := app.readIDParam(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	seasonNumber, err := app.readSeasonParam(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	seasonDetails, err := app.tmdb.GetTVSeasonDetails(int(tvID), int(seasonNumber), nil)
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

	var tvSeason = TvSeasonResponse{
		TvID: tvID,
		Season: Season{
			SeasonNumber: seasonDetails.SeasonNumber,
			EpisodeCount: len(episodes),
			Name:         seasonDetails.Name,
			Overview:     seasonDetails.Overview,
			VoteAverage:  seasonDetails.VoteAverage,
			PosterUrl:    tmdb.GetImageURL(seasonDetails.PosterPath, "w500"),
			Episodes:     episodes,
		},
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"season": tvSeason}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) getTvEpisodeHandler(w http.ResponseWriter, r *http.Request) {
	tvID, err := app.readIDParam(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	seasonNumber, err := app.readSeasonParam(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	episodeNumber, err := app.readEpisodeParam(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	episode, err := app.tmdb.GetTVEpisodeDetails(int(tvID), int(seasonNumber), int(episodeNumber), nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	episodeDetails := TvEpisodeResponse{
		TvId:         tvID,
		SeasonNumber: seasonNumber,
		Episode: Episode{
			AirDate:       episode.AirDate,
			EpisodeNumber: episode.EpisodeNumber,
			Name:          episode.Name,
			Overview:      episode.Overview,
			Runtime:       episode.Runtime,
			StillUrl:      tmdb.GetImageURL(episode.StillPath, "w500"),
			VoteAverage:   episode.VoteAverage,
		},
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"episode": episodeDetails}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
