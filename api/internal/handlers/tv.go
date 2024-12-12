package handlers

import (
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type TvHandler struct {
	Tmdb *tmdb.Client
}

type TvResponse struct {
	ID               int64   `json:"id"`
	Name             string  `json:"name"`
	Overview         string  `json:"overview"`
	FirstAirDate     string  `json:"first_air_date"`
	PosterUrl        string  `json:"poster_url"`
	Genres           Genres  `json:"genres"`
	NumberOfSeasons  int     `json:"number_of_seasons"`
	NumberOfEpisodes int     `json:"number_of_episodes"`
	Popularity       float32 `json:"popularity"`
	VoteAverage      float32 `json:"vote_average"`
}

type TvSeasonsResponse struct {
	TvID                   int64                    `json:"tv_id"`
	SeasonCount            int                      `json:"season_count"`
	SeasonsWithoutEpisodes []SeasonsWithoutEpisodes `json:"seasons_without_episodes"`
}

type SeasonsWithoutEpisodes struct {
	SeasonNumber int     `json:"season_number"`
	EpisodeCount int     `json:"episode_count"`
	Name         string  `json:"name"`
	Overview     string  `json:"overview"`
	PosterUrl    string  `json:"poster_url"`
	VoteAverage  float32 `json:"vote_average"`
}

type TvSeasonResponse struct {
	TvID   int64  `json:"tv_id"`
	Season Season `json:"season"`
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

type TvEpisodeResponse struct {
	TvId         int64   `json:"tv_id"`
	SeasonNumber int     `json:"season_number"`
	Episode      Episode `json:"episode"`
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

func (h *TvHandler) GetTvByIdHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	tv, err := h.Tmdb.GetTVDetails(int(id), nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
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

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"tv": response}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *TvHandler) GetTvSeasonsHandler(w http.ResponseWriter, r *http.Request) {
	tvID, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	tvDetails, err := h.Tmdb.GetTVDetails(int(tvID), nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
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

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"seasons": tvSeasonsResponse}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *TvHandler) GetTvEpisodesHandler(w http.ResponseWriter, r *http.Request) {
	tvID, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	seasonNumber, err := utils.ReadSeasonParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	seasonDetails, err := h.Tmdb.GetTVSeasonDetails(int(tvID), int(seasonNumber), nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
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

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"season": tvSeason}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *TvHandler) GetTvEpisodeHandler(w http.ResponseWriter, r *http.Request) {
	tvID, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	seasonNumber, err := utils.ReadSeasonParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	episodeNumber, err := utils.ReadEpisodeParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	episode, err := h.Tmdb.GetTVEpisodeDetails(int(tvID), int(seasonNumber), int(episodeNumber), nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
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

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"episode": episodeDetails}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
