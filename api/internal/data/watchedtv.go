package data

import (
	"context"
	"time"

	"github.com/kozakbalint/szakdoga/api/internal/repository"
)

type WatchedTV struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	TvID      int64     `json:"tv_id"`
	WatchedAt time.Time `json:"watched_at"`
}

type WatchedTVModel struct {
	Repository *repository.Queries
}

func (m *WatchedTVModel) GetWatchedTVs(userID int64) ([]TVShow, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	watchedTVs, err := m.Repository.ListWatchedTvShows(ctx, int32(userID))
	if err != nil {
		return nil, WrapError(err)
	}

	var watchedTVsResponse []TVShow
	for _, watchedTV := range watchedTVs {
		watchedTVsResponse = append(watchedTVsResponse, TVShow{
			ID:          int64(watchedTV.ID),
			TmdbID:      int(watchedTV.TmdbID),
			CreatedAt:   watchedTV.CreatedAt,
			LastFetched: watchedTV.LastFetchedAt,
			Title:       watchedTV.Title,
			ReleaseDate: watchedTV.ReleaseDate,
			PosterURL:   watchedTV.PosterUrl,
			Overview:    watchedTV.Overview,
			Genres:      watchedTV.Genres,
			VoteAverage: float32(watchedTV.VoteAverage),
			Version:     int(watchedTV.Version),
		})
	}

	return watchedTVsResponse, nil
}

func (m *WatchedTVModel) AddWatchedEpisode(userID, tvID, episodeID int64) (*WatchedTV, error) {
	args := repository.InsertWatchedEpisodeParams{
		UserID:    int32(userID),
		EpisodeID: int32(episodeID),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	watchedTV, err := m.Repository.InsertWatchedEpisode(ctx, args)
	if err != nil {
		return nil, WrapError(err)
	}

	return &WatchedTV{
		ID:        int64(watchedTV.ID),
		UserID:    int64(watchedTV.UserID),
		TvID:      tvID,
		WatchedAt: watchedTV.WatchedAt,
	}, nil
}

func (m *WatchedTVModel) RemoveWatchedEpisode(userID, episodeID int64) error {
	args := repository.DeleteWatchedEpisodeParams{
		UserID:    int32(userID),
		EpisodeID: int32(episodeID),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.DeleteWatchedEpisode(ctx, args)
	if err != nil {
		return WrapError(err)
	}

	return nil
}

type WatchProgress struct {
	TvID            int64   `json:"tv_id"`
	Progress        float32 `json:"progress"`
	TotalEpisodes   int64   `json:"total_episodes"`
	WatchedEpisodes int64   `json:"watched_episodes"`
}

func (m *WatchedTVModel) GetTvWatchProgress(userID, tvID int64) (*WatchProgress, error) {
	args := repository.GetWatchedProgressParams{
		ID:     tvID,
		UserID: int32(userID),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	progress, err := m.Repository.GetWatchedProgress(ctx, args)
	if err != nil {
		return nil, WrapError(err)
	}

	return &WatchProgress{
		TvID:            progress.TvShowID,
		Progress:        progress.WatchedPercentage,
		TotalEpisodes:   progress.TotalCount,
		WatchedEpisodes: progress.WatchedCount,
	}, nil
}
