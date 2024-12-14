package data

import (
	"context"
	"time"

	"github.com/kozakbalint/szakdoga/api/internal/repository"
)

type WatchlistMovies struct {
	Entries []*WatchlistMoviesEntry `json:"entries"`
}

type WatchlistMoviesEntry struct {
	ID      int64     `json:"id"`
	UserID  int64     `json:"user_id"`
	MovieID int64     `json:"movie_id"`
	AddedAt time.Time `json:"added_at"`
}

type WatchlistMoviesModel struct {
	Repository *repository.Queries
}

func (m WatchlistMoviesModel) Insert(mwe *WatchlistMoviesEntry) (*WatchlistMoviesEntry, error) {
	args := repository.InsertWatchlistMovieParams{
		UserID:  int32(mwe.UserID),
		MovieID: int32(mwe.MovieID),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	mweRes, err := m.Repository.InsertWatchlistMovie(ctx, args)
	if err != nil {
		return nil, WrapError(err)
	}

	mwe = &WatchlistMoviesEntry{
		ID:      mweRes.ID,
		UserID:  int64(mweRes.UserID),
		MovieID: int64(mweRes.MovieID),
		AddedAt: mweRes.AddedAt,
	}

	return mwe, nil
}

func (m WatchlistMoviesModel) GetWatchlistEntry(userID, id int64) (*WatchlistMoviesEntry, error) {
	args := repository.GetWatchlistMovieParams{
		UserID: int32(userID),
		ID:     id,
	}
	var mwe WatchlistMoviesEntry

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	mweRes, err := m.Repository.GetWatchlistMovie(ctx, args)
	if err != nil {
		return nil, WrapError(err)
	}

	mwe = WatchlistMoviesEntry{
		ID:      mweRes.ID,
		UserID:  int64(mweRes.UserID),
		MovieID: int64(mweRes.MovieID),
		AddedAt: mweRes.AddedAt,
	}

	return &mwe, nil
}

func (m WatchlistMoviesModel) UpdateWatchlistEntry(mwe *WatchlistMoviesEntry) error {
	args := repository.UpdateWatchlistMovieParams{
		ID:      mwe.ID,
		UserID:  int32(mwe.UserID),
		MovieID: int32(mwe.MovieID),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.UpdateWatchlistMovie(ctx, args)
	if err != nil {
		return WrapError(err)
	}

	return nil
}

func (m WatchlistMoviesModel) DeleteWatchlistEntry(id int64) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.DeleteWatchlistMovie(ctx, id)
	if err != nil {
		return WrapError(err)
	}

	return nil
}

func (m WatchlistMoviesModel) GetWatchlist(userID int64) (*WatchlistMovies, error) {
	var mw WatchlistMovies

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.Repository.ListWatchlistMovies(ctx, int32(userID))
	if err != nil {
		return nil, WrapError(err)
	}

	for _, mweRes := range rows {
		mwe := WatchlistMoviesEntry{
			ID:      mweRes.ID,
			UserID:  int64(mweRes.UserID),
			MovieID: int64(mweRes.MovieID),
			AddedAt: mweRes.AddedAt,
		}
		mw.Entries = append(mw.Entries, &mwe)
	}

	return &mw, nil
}

func (m WatchlistMoviesModel) GetWatchlistEntryByUserAndMovie(userID, movieID int64) (*WatchlistMoviesEntry, error) {
	args := repository.GetWatchlistMovieByMovieIdParams{
		UserID:  int32(userID),
		MovieID: int32(movieID),
	}
	var mwe WatchlistMoviesEntry

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	mweRes, err := m.Repository.GetWatchlistMovieByMovieId(ctx, args)
	if err != nil {
		return nil, WrapError(err)
	}

	mwe = WatchlistMoviesEntry{
		ID:      mweRes.ID,
		UserID:  int64(mweRes.UserID),
		MovieID: int64(mweRes.MovieID),
		AddedAt: mweRes.AddedAt,
	}

	return &mwe, nil
}
