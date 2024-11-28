package data

import (
	"context"
	"database/sql"
	"time"
)

type MoviesWatchlist struct {
	Entries []*MoviesWatchlistEntry `json:"entries"`
}

type MoviesWatchlistEntry struct {
	ID       int64  `json:"id"`
	UserID   int64  `json:"user_id"`
	MovieID  int64  `json:"movie_id"`
	AddedAt  string `json:"added_at"`
	UpdateAt string `json:"updated_at"`
	Watched  bool   `json:"watched"`
}

type MoviesWatchlistModel struct {
	DB *sql.DB
}

func (m MoviesWatchlistModel) Insert(mwe *MoviesWatchlistEntry) (*MoviesWatchlistEntry, error) {
	stmt := `INSERT INTO movies_watchlist
	(user_id, movie_id, watched)
	VALUES($1, $2, $3)
	RETURNING id, added_at, updated_at`
	args := []interface{}{
		mwe.UserID,
		mwe.MovieID,
		mwe.Watched,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, stmt, args...).Scan(&mwe.ID, &mwe.AddedAt, &mwe.UpdateAt)
	if err != nil {
		return nil, err
	}

	return mwe, nil
}

func (m MoviesWatchlistModel) GetWatchlistEntry(userID, id int64) (*MoviesWatchlistEntry, error) {
	stmt := `SELECT * FROM movies_watchlist WHERE user_id = $1 AND id = $2`

	var mwe MoviesWatchlistEntry

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, stmt, id).Scan(
		&mwe.ID,
		&mwe.UserID,
		&mwe.MovieID,
		&mwe.AddedAt,
		&mwe.UpdateAt,
		&mwe.Watched,
	)

	if err != nil {
		return nil, err
	}

	return &mwe, nil
}

func (m MoviesWatchlistModel) UpdateWatchlistEntry(mwe *MoviesWatchlistEntry) error {
	stmt := `UPDATE movies_watchlist
	SET user_id = $1, movie_id = $2, added_at = $3, updated_at = $4, watched = $5
	WHERE id = $6`
	args := []interface{}{
		mwe.UserID,
		mwe.MovieID,
		mwe.AddedAt,
		mwe.UpdateAt,
		mwe.Watched,
		mwe.ID,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.DB.ExecContext(ctx, stmt, args...)
	if err != nil {
		return err
	}

	return nil
}

func (m MoviesWatchlistModel) DeleteWatchlistEntry(id int64) error {
	stmt := `DELETE FROM movies_watchlist WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.DB.ExecContext(ctx, stmt, id)
	if err != nil {
		return err
	}

	return nil
}

func (m MoviesWatchlistModel) GetWatchlist(userID int64) (*MoviesWatchlist, error) {
	stmt := `SELECT * FROM movies_watchlist WHERE user_id = $1`

	var mw MoviesWatchlist

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, stmt, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var mwe MoviesWatchlistEntry
		err := rows.Scan(
			&mwe.ID,
			&mwe.UserID,
			&mwe.MovieID,
			&mwe.AddedAt,
			&mwe.UpdateAt,
			&mwe.Watched,
		)
		if err != nil {
			return nil, err
		}
		mw.Entries = append(mw.Entries, &mwe)
	}

	return &mw, nil
}

func (m MoviesWatchlistModel) GetByWatchStatus(userID int64, status bool) (*MoviesWatchlist, error) {
	stmt := `SELECT * FROM movies_watchlist WHERE user_id = $1 AND watched = $2`

	var mw MoviesWatchlist

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, stmt, userID, status)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var mwe MoviesWatchlistEntry
		err := rows.Scan(
			&mwe.ID,
			&mwe.UserID,
			&mwe.MovieID,
			&mwe.AddedAt,
			&mwe.UpdateAt,
			&mwe.Watched,
		)
		if err != nil {
			return nil, err
		}
		mw.Entries = append(mw.Entries, &mwe)
	}

	return &mw, nil
}

func (m MoviesWatchlistModel) GetWatchlistEntryByUserAndMovie(userID, movieID int64) (*MoviesWatchlistEntry, error) {
	stmt := `SELECT * FROM movies_watchlist WHERE user_id = $1 AND movie_id = $2`

	var mwe MoviesWatchlistEntry

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, stmt, userID, movieID).Scan(
		&mwe.ID,
		&mwe.UserID,
		&mwe.MovieID,
		&mwe.AddedAt,
		&mwe.UpdateAt,
		&mwe.Watched,
	)

	if err != nil {
		return nil, err
	}

	return &mwe, nil
}
