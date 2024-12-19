package data

import (
	"context"
	"fmt"
	"time"

	"github.com/kozakbalint/szakdoga/api/internal/repository"
)

type TVShow struct {
	ID          int64          `json:"id"`
	TmdbID      int            `json:"tmdb_id"`
	CreatedAt   time.Time      `json:"created_at"`
	LastFetched time.Time      `json:"last_fetched_at"`
	Title       string         `json:"title"`
	ReleaseDate string         `json:"release_date"`
	PosterURL   string         `json:"poster_url"`
	Overview    string         `json:"overview"`
	Genres      []string       `json:"genres"`
	VoteAverage float32        `json:"vote_average"`
	Seasons     []TVShowSeason `json:"seasons"`
	Version     int            `json:"version"`
}

type TVShowSeason struct {
	ID           int64           `json:"id"`
	SeasonNumber int             `json:"season_number"`
	EpisodeCount int             `json:"episode_count"`
	Episodes     []TVShowEpisode `json:"episodes"`
	AirDate      string          `json:"air_date"`
}

type TVShowEpisode struct {
	ID            int    `json:"id"`
	EpisodeNumber int    `json:"episode_number"`
	Title         string `json:"title"`
	Overview      string `json:"overview"`
	AirDate       string `json:"air_date"`
}

type TVShowModel struct {
	Repository *repository.Queries
}

func (m TVShowModel) Insert(tvShow *TVShow, tvshowSeasons *[]TVShowSeason) (*TVShow, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	argShow := repository.InsertTvShowParams{
		TmdbID:      int32(tvShow.TmdbID),
		Title:       tvShow.Title,
		ReleaseDate: tvShow.ReleaseDate,
		PosterUrl:   tvShow.PosterURL,
		Overview:    tvShow.Overview,
		Genres:      tvShow.Genres,
		VoteAverage: float64(tvShow.VoteAverage),
	}

	insertedTvShow, err := m.Repository.InsertTvShow(ctx, argShow)
	if err != nil {
		return nil, WrapError(err)
	}

	tvShow.ID = insertedTvShow.ID
	tvShow.CreatedAt = insertedTvShow.CreatedAt
	tvShow.LastFetched = insertedTvShow.LastFetchedAt
	tvShow.Version = int(insertedTvShow.Version)

	for _, season := range *tvshowSeasons {
		argSeason := repository.InsertTvShowSeasonParams{
			TvShowID:     tvShow.ID,
			SeasonNumber: int32(season.SeasonNumber),
			EpisodeCount: int32(season.EpisodeCount),
			AirDate:      season.AirDate,
		}

		insertedSeason, err := m.Repository.InsertTvShowSeason(ctx, argSeason)
		if err != nil {
			return nil, WrapError(err)
		}
		season.ID = insertedSeason.ID

		for _, episode := range season.Episodes {
			argEpisode := repository.InsertTvShowEpisodeParams{
				TvShowID:      tvShow.ID,
				SeasonID:      season.ID,
				EpisodeNumber: int32(episode.EpisodeNumber),
				Title:         episode.Title,
				Overview:      episode.Overview,
				AirDate:       episode.AirDate,
			}

			_, err := m.Repository.InsertTvShowEpisode(ctx, argEpisode)
			if err != nil {
				return nil, WrapError(err)
			}
		}

		fmt.Println(tvShow)
	}

	return tvShow, nil
}

func (m TVShowModel) GetByTmdbID(tmdbID int) (*TVShow, error) {
	var tvshow TVShow

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	tvshowRes, err := m.Repository.GetTvShowByTmdbId(ctx, int32(tmdbID))
	if err != nil {
		return nil, WrapError(err)
	}

	tvshow = TVShow{
		ID:          tvshowRes.ID,
		TmdbID:      int(tvshowRes.TmdbID),
		CreatedAt:   tvshowRes.CreatedAt,
		LastFetched: tvshowRes.LastFetchedAt,
		Title:       tvshowRes.Title,
		ReleaseDate: tvshowRes.ReleaseDate,
		PosterURL:   tvshowRes.PosterUrl,
		Overview:    tvshowRes.Overview,
		Genres:      tvshowRes.Genres,
		VoteAverage: float32(tvshowRes.VoteAverage),
		Version:     int(tvshowRes.Version),
	}

	seasons, err := m.GetSeasons(tvshow.ID)
	if err != nil {
		return nil, WrapError(err)
	}

	tvshow.Seasons = seasons

	return &tvshow, nil
}

func (m TVShowModel) GetSeasons(tvshowID int64) ([]TVShowSeason, error) {
	var seasons []TVShowSeason

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	seasonsRes, err := m.Repository.ListTvShowSeasons(ctx, tvshowID)
	if err != nil {
		return nil, WrapError(err)
	}

	for _, s := range seasonsRes {
		episodes, err := m.GetEpisodesBySeasonID(tvshowID, s.ID)
		if err != nil {
			return nil, WrapError(err)
		}

		season := TVShowSeason{
			SeasonNumber: int(s.SeasonNumber),
			EpisodeCount: int(s.EpisodeCount),
			Episodes:     episodes,
			AirDate:      s.AirDate,
		}

		seasons = append(seasons, season)
	}

	return seasons, nil
}

func (m TVShowModel) GetEpisodesBySeasonID(tvShowID, seasonID int64) ([]TVShowEpisode, error) {
	args := repository.ListTvShowEpisodesParams{
		TvShowID: tvShowID,
		SeasonID: seasonID,
	}
	var episodes []TVShowEpisode

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	episodesRes, err := m.Repository.ListTvShowEpisodes(ctx, args)
	if err != nil {
		return nil, WrapError(err)
	}

	for _, e := range episodesRes {
		episode := TVShowEpisode{
			ID:            int(e.ID),
			EpisodeNumber: int(e.EpisodeNumber),
			Title:         e.Title,
			Overview:      e.Overview,
			AirDate:       e.AirDate,
		}

		episodes = append(episodes, episode)
	}

	return episodes, nil
}
