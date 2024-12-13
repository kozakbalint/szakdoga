package data

import (
	"context"
	"errors"
	"time"

	"github.com/kozakbalint/szakdoga/api/internal/repository"
	"github.com/lib/pq"
)

var ErrDuplicateRecord = errors.New("duplicate record")

type MoviesWatchlist struct {
	Entries []*MoviesWatchlistEntry `json:"entries"`
}

type MoviesWatchlistEntry struct {
	ID      int64     `json:"id"`
	UserID  int64     `json:"user_id"`
	MovieID int64     `json:"movie_id"`
	AddedAt time.Time `json:"added_at"`
}

type MoviesWatchlistModel struct {
	Repository *repository.Queries
}

func (m MoviesWatchlistModel) Insert(mwe *MoviesWatchlistEntry) (*MoviesWatchlistEntry, error) {
	args := repository.InsertWatchlistMovieParams{
		UserID:  int32(mwe.UserID),
		MovieID: int32(mwe.MovieID),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	mweRes, err := m.Repository.InsertWatchlistMovie(ctx, args)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
			return nil, ErrDuplicateRecord
		}
		return nil, err
	}

	mwe = &MoviesWatchlistEntry{
		ID:      mweRes.ID,
		UserID:  int64(mweRes.UserID),
		MovieID: int64(mweRes.MovieID),
		AddedAt: mweRes.AddedAt,
	}

	return mwe, nil
}

func (m MoviesWatchlistModel) GetWatchlistEntry(userID, id int64) (*MoviesWatchlistEntry, error) {
	args := repository.GetWatchlistMovieParams{
		UserID: int32(userID),
		ID:     id,
	}
	var mwe MoviesWatchlistEntry

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	mweRes, err := m.Repository.GetWatchlistMovie(ctx, args)
	if err != nil {
		return nil, err
	}

	mwe = MoviesWatchlistEntry{
		ID:      mweRes.ID,
		UserID:  int64(mweRes.UserID),
		MovieID: int64(mweRes.MovieID),
		AddedAt: mweRes.AddedAt,
	}

	return &mwe, nil
}

func (m MoviesWatchlistModel) UpdateWatchlistEntry(mwe *MoviesWatchlistEntry) error {
	args := repository.UpdateWatchlistMovieParams{
		ID:      mwe.ID,
		UserID:  int32(mwe.UserID),
		MovieID: int32(mwe.MovieID),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.UpdateWatchlistMovie(ctx, args)
	if err != nil {
		return err
	}

	return nil
}

func (m MoviesWatchlistModel) DeleteWatchlistEntry(id int64) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.DeleteWatchlistMovie(ctx, id)
	if err != nil {
		return err
	}

	return nil
}

func (m MoviesWatchlistModel) GetWatchlist(userID int64) (*MoviesWatchlist, error) {
	var mw MoviesWatchlist

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.Repository.ListWatchlistMovies(ctx, int32(userID))
	if err != nil {
		return nil, err
	}

	for _, mweRes := range rows {
		mwe := MoviesWatchlistEntry{
			ID:      mweRes.ID,
			UserID:  int64(mweRes.UserID),
			MovieID: int64(mweRes.MovieID),
			AddedAt: mweRes.AddedAt,
		}
		mw.Entries = append(mw.Entries, &mwe)
	}

	return &mw, nil
}

func (m MoviesWatchlistModel) GetWatchlistEntryByUserAndMovie(userID, movieID int64) (*MoviesWatchlistEntry, error) {
	args := repository.GetWatchlistMovieByMovieIdParams{
		UserID:  int32(userID),
		MovieID: int32(movieID),
	}
	var mwe MoviesWatchlistEntry

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	mweRes, err := m.Repository.GetWatchlistMovieByMovieId(ctx, args)
	if err != nil {
		return nil, err
	}

	mwe = MoviesWatchlistEntry{
		ID:      mweRes.ID,
		UserID:  int64(mweRes.UserID),
		MovieID: int64(mweRes.MovieID),
		AddedAt: mweRes.AddedAt,
	}

	return &mwe, nil
}
