package data

import (
	"context"
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
	SeasonNumber int             `json:"season_number"`
	EpisodeCount int             `json:"episode_count"`
	Episodes     []TVShowEpisode `json:"episodes"`
	AirDate      time.Time       `json:"air_date"`
}

type TVShowEpisode struct {
	EpisodeNumber int       `json:"episode_number"`
	Title         string    `json:"title"`
	Overview      string    `json:"overview"`
	AirDate       time.Time `json:"air_date"`
}

type TVShowModel struct {
	Repository *repository.Queries
}

func (m TVShowModel) Insert(tvshow *TVShow) (*TVShow, error) {
	args := repository.InsertTvShowParams{
		TmdbID:      int32(tvshow.TmdbID),
		Title:       tvshow.Title,
		ReleaseDate: tvshow.ReleaseDate,
		PosterUrl:   tvshow.PosterURL,
		Overview:    tvshow.Overview,
		Genres:      tvshow.Genres,
		VoteAverage: float64(tvshow.VoteAverage),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	tvshowRes, err := m.Repository.InsertTvShow(ctx, args)
	if err != nil {
		return nil, WrapError(err)
	}

	tvshow = &TVShow{
		ID:          tvshowRes.ID,
		TmdbID:      int(tvshowRes.TmdbID),
		CreatedAt:   tvshowRes.CreatedAt,
		LastFetched: tvshowRes.LastFetchedAt,
		Title:       tvshowRes.Title,
		ReleaseDate: tvshowRes.ReleaseDate,
		PosterURL:   tvshowRes.PosterUrl,
		Overview:    tvshowRes.Overview,
		Genres:      tvshowRes.Genres,
		VoteAverage: tvshow.VoteAverage,
		Version:     int(tvshowRes.Version),
	}

	return tvshow, nil
}

func (m TVShowModel) Get(id int64) (*TVShow, error) {
	var tvshow TVShow

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	tvshowRes, err := m.Repository.GetTvShowById(ctx, id)
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

	return &tvshow, nil
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

	return &tvshow, nil
}

func (m TVShowModel) GetSeasons(tvshowID int64) ([]TVShowSeason, error) {
	var seasons []TVShowSeason

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	seasonsRes, err := m.Repository.GetTvShowSeasons(ctx, tvshowID)
	if err != nil {
		return nil, WrapError(err)
	}

	for _, s := range seasonsRes {
		season := TVShowSeason{
			SeasonNumber: int(s.SeasonNumber),
			EpisodeCount: int(s.EpisodeCount),
			AirDate:      s.AirDate,
		}

		seasons = append(seasons, season)
	}

	return seasons, nil
}

func (m TVShowModel) GetEpisodesBySeasonID(seasonID int64) ([]TVShowEpisode, error) {
	var episodes []TVShowEpisode

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	episodesRes, err := m.Repository.GetTvShowSeasonEpisodes(ctx, seasonID)
	if err != nil {
		return nil, WrapError(err)
	}

	for _, e := range episodesRes {
		episode := TVShowEpisode{
			EpisodeNumber: int(e.EpisodeNumber),
			Title:         e.Title,
			Overview:      e.Overview,
			AirDate:       e.AirDate,
		}

		episodes = append(episodes, episode)
	}

	return episodes, nil
}

func (m TVShowModel) GetAllEpisodes(tvshowID int64) ([]TVShowEpisode, error) {
	var episodes []TVShowEpisode

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	episodesRes, err := m.Repository.GetTvShowEpisodes(ctx, tvshowID)
	if err != nil {
		return nil, WrapError(err)
	}

	for _, e := range episodesRes {
		episode := TVShowEpisode{
			EpisodeNumber: int(e.EpisodeNumber),
			Title:         e.Title,
			Overview:      e.Overview,
			AirDate:       e.AirDate,
		}

		episodes = append(episodes, episode)
	}

	return episodes, nil
}

func (m TVShowModel) InsertSeason(tvshowID int64, season *TVShowSeason) (*TVShowSeason, error) {
	args := repository.InsertTvShowSeasonParams{
		TvShowID:     tvshowID,
		SeasonNumber: int32(season.SeasonNumber),
		EpisodeCount: int32(season.EpisodeCount),
		AirDate:      season.AirDate,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	seasonRes, err := m.Repository.InsertTvShowSeason(ctx, args)
	if err != nil {
		return nil, WrapError(err)
	}

	season = &TVShowSeason{
		SeasonNumber: int(seasonRes.SeasonNumber),
		EpisodeCount: int(seasonRes.EpisodeCount),
		AirDate:      seasonRes.AirDate,
	}

	return season, nil
}

func (m TVShowModel) InsertEpisode(seasonID int64, episode *TVShowEpisode) (*TVShowEpisode, error) {
	args := repository.InsertTvShowEpisodeParams{
		SeasonID:      seasonID,
		EpisodeNumber: int32(episode.EpisodeNumber),
		Title:         episode.Title,
		Overview:      episode.Overview,
		AirDate:       episode.AirDate,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	episodeRes, err := m.Repository.InsertTvShowEpisode(ctx, args)
	if err != nil {
		return nil, WrapError(err)
	}

	episode = &TVShowEpisode{
		EpisodeNumber: int(episodeRes.EpisodeNumber),
		Title:         episodeRes.Title,
		Overview:      episodeRes.Overview,
		AirDate:       episodeRes.AirDate,
	}

	return episode, nil
}
