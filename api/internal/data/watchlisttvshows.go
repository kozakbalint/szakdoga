package data

import (
	"context"
	"time"

	"github.com/kozakbalint/szakdoga/api/internal/repository"
)

type WatchlistTvShows struct {
	Entries []*WatchlistTVShowsEntry `json:"entries"`
}

type WatchlistTVShowsEntry struct {
	ID      int64     `json:"id"`
	UserID  int64     `json:"user_id"`
	TVID    int64     `json:"tv_id"`
	AddedAt time.Time `json:"added_at"`
}

type WatchlistTVShowsModel struct {
	Repository *repository.Queries
}

func (m WatchlistTVShowsModel) Insert(tvwe *WatchlistTVShowsEntry) (*WatchlistTVShowsEntry, error) {
	args := repository.InsertWatchlistTvShowsParams{
		UserID:   int32(tvwe.UserID),
		TvShowID: int32(tvwe.TVID),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	tvweRes, err := m.Repository.InsertWatchlistTvShows(ctx, args)
	if err != nil {
		return nil, WrapError(err)
	}

	tvwe = &WatchlistTVShowsEntry{
		ID:      tvweRes.ID,
		UserID:  int64(tvweRes.UserID),
		TVID:    int64(tvweRes.TvShowID),
		AddedAt: tvweRes.AddedAt,
	}

	return tvwe, nil
}

func (m WatchlistTVShowsModel) GetWatchlistEntry(userID, id int64) (*WatchlistTVShowsEntry, error) {
	args := repository.GetWatchlistTvShowsParams{
		UserID: int32(userID),
		ID:     id,
	}
	var tvwe WatchlistTVShowsEntry

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	tvweRes, err := m.Repository.GetWatchlistTvShows(ctx, args)
	if err != nil {
		return nil, WrapError(err)
	}

	tvwe = WatchlistTVShowsEntry{
		ID:      tvweRes.ID,
		UserID:  int64(tvweRes.UserID),
		TVID:    int64(tvweRes.TvShowID),
		AddedAt: tvweRes.AddedAt,
	}

	return &tvwe, nil
}

func (m WatchlistTVShowsModel) UpdateWatchlistEntry(tvwe *WatchlistTVShowsEntry) error {
	args := repository.UpdateWatchlistTvShowsParams{
		ID:       tvwe.ID,
		UserID:   int32(tvwe.UserID),
		TvShowID: int32(tvwe.TVID),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.UpdateWatchlistTvShows(ctx, args)
	if err != nil {
		return WrapError(err)
	}

	return nil
}

func (m WatchlistTVShowsModel) DeleteWatchlistEntry(id int64) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.DeleteWatchlistTvShows(ctx, id)
	if err != nil {
		return WrapError(err)
	}

	return nil
}

func (m WatchlistTVShowsModel) GetWatchlist(userID int64) (*WatchlistTvShows, error) {
	var tvw WatchlistTvShows

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.Repository.ListWatchlistTvShows(ctx, int32(userID))
	if err != nil {
		return nil, WrapError(err)
	}

	for _, tvweRes := range rows {
		tvwe := WatchlistTVShowsEntry{
			ID:      tvweRes.ID,
			UserID:  int64(tvweRes.UserID),
			TVID:    int64(tvweRes.TvShowID),
			AddedAt: tvweRes.AddedAt,
		}
		tvw.Entries = append(tvw.Entries, &tvwe)
	}

	return &tvw, nil
}

func (m WatchlistTVShowsModel) GetWatchlistEntryByUserAndMovie(userID, tvID int64) (*WatchlistTVShowsEntry, error) {
	args := repository.GetWatchlistTvShowsByTVIdParams{
		UserID:   int32(userID),
		TvShowID: int32(tvID),
	}
	var tvwe WatchlistTVShowsEntry

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	tvweRes, err := m.Repository.GetWatchlistTvShowsByTVId(ctx, args)
	if err != nil {
		return nil, WrapError(err)
	}

	tvwe = WatchlistTVShowsEntry{
		ID:      tvweRes.ID,
		UserID:  int64(tvweRes.UserID),
		TVID:    int64(tvweRes.TvShowID),
		AddedAt: tvweRes.AddedAt,
	}

	return &tvwe, nil
}
