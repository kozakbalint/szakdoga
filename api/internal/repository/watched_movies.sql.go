// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: watched_movies.sql

package repository

import (
	"context"
	"time"
)

const deleteWatchedMovie = `-- name: DeleteWatchedMovie :one
DELETE FROM watched_movies
WHERE id = $1
RETURNING id, user_id, movie_id, watched_at
`

func (q *Queries) DeleteWatchedMovie(ctx context.Context, id int32) (WatchedMovie, error) {
	row := q.db.QueryRow(ctx, deleteWatchedMovie, id)
	var i WatchedMovie
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.MovieID,
		&i.WatchedAt,
	)
	return i, err
}

const getWatchedMovie = `-- name: GetWatchedMovie :one
SELECT id, user_id, movie_id, watched_at FROM watched_movies
WHERE user_id = $1 AND id = $2
`

type GetWatchedMovieParams struct {
	UserID int32 `json:"user_id"`
	ID     int32 `json:"id"`
}

func (q *Queries) GetWatchedMovie(ctx context.Context, arg GetWatchedMovieParams) (WatchedMovie, error) {
	row := q.db.QueryRow(ctx, getWatchedMovie, arg.UserID, arg.ID)
	var i WatchedMovie
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.MovieID,
		&i.WatchedAt,
	)
	return i, err
}

const getWatchedMovieByMovieId = `-- name: GetWatchedMovieByMovieId :one
SELECT id, user_id, movie_id, watched_at FROM watched_movies
WHERE user_id = $1 AND movie_id = $2
`

type GetWatchedMovieByMovieIdParams struct {
	UserID  int32 `json:"user_id"`
	MovieID int32 `json:"movie_id"`
}

func (q *Queries) GetWatchedMovieByMovieId(ctx context.Context, arg GetWatchedMovieByMovieIdParams) (WatchedMovie, error) {
	row := q.db.QueryRow(ctx, getWatchedMovieByMovieId, arg.UserID, arg.MovieID)
	var i WatchedMovie
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.MovieID,
		&i.WatchedAt,
	)
	return i, err
}

const insertWatchedMovie = `-- name: InsertWatchedMovie :one
INSERT INTO watched_movies
(user_id, movie_id)
VALUES($1, $2)
RETURNING id, user_id, movie_id, watched_at
`

type InsertWatchedMovieParams struct {
	UserID  int32 `json:"user_id"`
	MovieID int32 `json:"movie_id"`
}

func (q *Queries) InsertWatchedMovie(ctx context.Context, arg InsertWatchedMovieParams) (WatchedMovie, error) {
	row := q.db.QueryRow(ctx, insertWatchedMovie, arg.UserID, arg.MovieID)
	var i WatchedMovie
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.MovieID,
		&i.WatchedAt,
	)
	return i, err
}

const listWatchedMovies = `-- name: ListWatchedMovies :many
SELECT id, user_id, movie_id, watched_at FROM watched_movies
WHERE user_id = $1
`

func (q *Queries) ListWatchedMovies(ctx context.Context, userID int32) ([]WatchedMovie, error) {
	rows, err := q.db.Query(ctx, listWatchedMovies, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []WatchedMovie
	for rows.Next() {
		var i WatchedMovie
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.MovieID,
			&i.WatchedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateWatchedMovie = `-- name: UpdateWatchedMovie :one
UPDATE watched_movies
SET user_id = $1, movie_id = $2, watched_at = $3
WHERE id = $4
RETURNING id, user_id, movie_id, watched_at
`

type UpdateWatchedMovieParams struct {
	UserID    int32     `json:"user_id"`
	MovieID   int32     `json:"movie_id"`
	WatchedAt time.Time `json:"watched_at"`
	ID        int32     `json:"id"`
}

func (q *Queries) UpdateWatchedMovie(ctx context.Context, arg UpdateWatchedMovieParams) (WatchedMovie, error) {
	row := q.db.QueryRow(ctx, updateWatchedMovie,
		arg.UserID,
		arg.MovieID,
		arg.WatchedAt,
		arg.ID,
	)
	var i WatchedMovie
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.MovieID,
		&i.WatchedAt,
	)
	return i, err
}
