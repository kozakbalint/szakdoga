package data

import (
	"context"
	"time"

	"github.com/kozakbalint/szakdoga/api/internal/repository"
)

type WatchlistModel struct {
	Repository *repository.Queries
}

type Watchlist struct {
	Movies []*int32
	Tv     []*int32
}

func (m WatchlistModel) GetWatchlist(userID int32) (*Watchlist, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	movieEntries, err := m.Repository.ListWatchlistMovies(ctx, int32(userID))
	if err != nil {
		return nil, WrapError(err)
	}

	tvShowEntries, err := m.Repository.ListWatchlistTvShows(ctx, int32(userID))
	if err != nil {
		return nil, WrapError(err)
	}

	var watchlist Watchlist
	for _, entry := range movieEntries {
		watchlist.Movies = append(watchlist.Movies, &entry.TmdbID)
	}

	for _, entry := range tvShowEntries {
		watchlist.Tv = append(watchlist.Tv, &entry.TmdbID)
	}

	return &watchlist, nil
}

func (m WatchlistModel) IsMovieOnWatchlist(tmdbId, userId int32) (bool, error) {
	args := repository.GetWatchlistMovieParams{
		TmdbID: int32(tmdbId),
		UserID: userId,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.GetWatchlistMovie(ctx, args)
	if err != nil {
		return false, nil
	}

	return true, nil
}

func (m WatchlistModel) AddMovieToWatchlist(tmdbId, userId int32) error {
	args := repository.InsertWatchlistMovieParams{
		TmdbID: tmdbId,
		UserID: userId,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.InsertWatchlistMovie(ctx, args)
	if err != nil {
		return WrapError(err)
	}

	return nil
}

func (m WatchlistModel) RemoveMovieFromWatchlist(tmdbId, userId int32) error {
	args := repository.DeleteWatchlistMovieParams{
		TmdbID: tmdbId,
		UserID: userId,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.DeleteWatchlistMovie(ctx, args)
	if err != nil {
		return WrapError(err)
	}

	return nil
}

func (m WatchlistModel) IsTvShowOnWatchlist(tmdbId, userId int32) (bool, error) {
	args := repository.GetWatchlistTvShowParams{
		TmdbID: tmdbId,
		UserID: userId,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.GetWatchlistTvShow(ctx, args)
	if err != nil {
		return false, nil
	}

	return true, nil
}

func (m WatchlistModel) AddTvShowToWatchlist(tmdbId, userId int32) error {
	args := repository.InsertWatchlistTvShowParams{
		TmdbID: tmdbId,
		UserID: userId,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.InsertWatchlistTvShow(ctx, args)
	if err != nil {
		return WrapError(err)
	}

	return nil
}

func (m WatchlistModel) RemoveTvShowFromWatchlist(tmdbId, userId int32) error {
	args := repository.DeleteWatchlistTvShowParams{
		TmdbID: tmdbId,
		UserID: userId,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.DeleteWatchlistTvShow(ctx, args)
	if err != nil {
		return WrapError(err)
	}

	return nil
}
