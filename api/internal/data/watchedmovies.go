package data

import (
	"context"
	"time"

	"github.com/kozakbalint/szakdoga/api/internal/repository"
)

type WatchedMovie struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	MovieID   int64     `json:"movie_id"`
	WatchedAt time.Time `json:"watched_at"`
}

type WatchedMoviesModel struct {
	Repository *repository.Queries
}

func (m *WatchedMoviesModel) AddWatchedMovie(userID, movieID int64) (*WatchedMovie, error) {
	args := repository.InsertWatchedMovieParams{
		UserID:  int32(userID),
		MovieID: int32(movieID),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	watchedMovie, err := m.Repository.InsertWatchedMovie(ctx, args)
	if err != nil {
		return nil, err
	}

	return &WatchedMovie{
		ID:        int64(watchedMovie.ID),
		UserID:    int64(watchedMovie.UserID),
		MovieID:   int64(watchedMovie.MovieID),
		WatchedAt: watchedMovie.WatchedAt,
	}, nil
}

func (m *WatchedMoviesModel) GetWatchedMovies(userID int64) ([]WatchedMovie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	watchedMovies, err := m.Repository.ListWatchedMovies(ctx, int32(userID))
	if err != nil {
		return nil, err
	}

	var watchedMoviesResponse []WatchedMovie
	for _, watchedMovie := range watchedMovies {
		watchedMoviesResponse = append(watchedMoviesResponse, WatchedMovie{
			ID:        int64(watchedMovie.ID),
			UserID:    int64(watchedMovie.UserID),
			MovieID:   int64(watchedMovie.MovieID),
			WatchedAt: watchedMovie.WatchedAt,
		})
	}

	return watchedMoviesResponse, nil
}

func (m *WatchedMoviesModel) UpdateWatchedMovie(ID, userID, movieID int64, watchedAt time.Time) (*WatchedMovie, error) {
	args := repository.UpdateWatchedMovieParams{
		UserID:    int32(userID),
		MovieID:   int32(movieID),
		WatchedAt: watchedAt,
		ID:        int32(ID),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	watchedMovie, err := m.Repository.UpdateWatchedMovie(ctx, args)
	if err != nil {
		return nil, err
	}

	return &WatchedMovie{
		ID:        int64(watchedMovie.ID),
		UserID:    int64(watchedMovie.UserID),
		MovieID:   int64(watchedMovie.MovieID),
		WatchedAt: watchedMovie.WatchedAt,
	}, nil
}

func (m *WatchedMoviesModel) DeleteWatchedMovie(ID, userID int64) error {
	args := repository.DeleteWatchedMovieParams{
		ID:     int32(ID),
		UserID: int32(userID),
	}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.DeleteWatchedMovie(ctx, args)

	return err
}

func (m *WatchedMoviesModel) GetWatchedMovie(userID, movieID int64) (*[]WatchedMovie, error) {
	args := repository.GetWatchedMovieByMovieIdParams{
		UserID:  int32(userID),
		MovieID: int32(movieID),
	}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	watchedMovies, err := m.Repository.GetWatchedMovieByMovieId(ctx, args)
	if err != nil {
		return nil, err
	}

	var watchedMoviesResponse []WatchedMovie
	for _, watchedMovie := range watchedMovies {
		watchedMoviesResponse = append(watchedMoviesResponse, WatchedMovie{
			ID:        int64(watchedMovie.ID),
			UserID:    int64(watchedMovie.UserID),
			MovieID:   int64(watchedMovie.MovieID),
			WatchedAt: watchedMovie.WatchedAt,
		})
	}

	return &watchedMoviesResponse, nil
}
