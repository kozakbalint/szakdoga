package data

import (
	"context"
	"database/sql"
	"time"

	"github.com/lib/pq"
)

type Movie struct {
	ID          int64    `json:"id"`
	TmdbID      int      `json:"tmdb_id"`
	CreatedAt   string   `json:"created_at"`
	LastFetched string   `json:"last_fetched_at"`
	Title       string   `json:"title"`
	ReleaseDate string   `json:"release_date"`
	PosterURL   string   `json:"poster_url"`
	Overview    string   `json:"overview"`
	Genres      []string `json:"genres"`
	VoteAverage float32  `json:"vote_average"`
	Runtime     int      `json:"runtime"`
	Version     int      `json:"version"`
}

type MovieModel struct {
	DB *sql.DB
}

func (m MovieModel) Insert(movie *Movie) (*Movie, error) {
	stmt := `INSERT INTO movies
	(tmdb_id, title, release_date, poster_url, overview, genres, vote_average, runtime)
	VALUES($1, $2, $3, $4, $5, $6, $7, $8)
	RETURNING id, created_at, last_fetched_at, version`
	args := []interface{}{
		movie.TmdbID,
		movie.Title,
		movie.ReleaseDate,
		movie.PosterURL,
		movie.Overview,
		pq.Array(movie.Genres),
		movie.VoteAverage,
		movie.Runtime,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, stmt, args...).Scan(&movie.ID, &movie.CreatedAt, &movie.LastFetched, &movie.Version)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
			return nil, ErrDuplicateRecord
		}
		return nil, err
	}
	return movie, nil
}

func (m MovieModel) Get(id int64) (*Movie, error) {
	stmt := `SELECT * FROM movies WHERE id = $1`

	var movie Movie

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, stmt, id).Scan(
		&movie.ID,
		&movie.TmdbID,
		&movie.CreatedAt,
		&movie.LastFetched,
		&movie.Title,
		&movie.ReleaseDate,
		&movie.PosterURL,
		&movie.Overview,
		pq.Array(&movie.Genres),
		&movie.VoteAverage,
		&movie.Runtime,
		&movie.Version,
	)

	if err != nil {
		return nil, err
	}

	return &movie, nil
}

func (m MovieModel) GetByTmdbID(tmdbID int) (*Movie, error) {
	stmt := `SELECT * FROM movies WHERE tmdb_id = $1`

	var movie Movie

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, stmt, tmdbID).Scan(
		&movie.ID,
		&movie.TmdbID,
		&movie.CreatedAt,
		&movie.LastFetched,
		&movie.Title,
		&movie.ReleaseDate,
		&movie.PosterURL,
		&movie.Overview,
		pq.Array(&movie.Genres),
		&movie.VoteAverage,
		&movie.Runtime,
		&movie.Version,
	)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &movie, nil
}

func (m MovieModel) Update(movie *Movie) error {
	stmt := `UPDATE movies SET
	tmdb_id = $1,
	last_fetched_at = $2,
	title = $3,
	release_date = $4,
	poster_url = $5,
	overview = $6,
	genres = $7,
	vote_average = $8,
	runtime = $9,
	version = version + 1
	WHERE id = $10 AND version = $11
	RETURNING version`

	args := []interface{}{
		movie.TmdbID,
		movie.LastFetched,
		movie.Title,
		movie.ReleaseDate,
		movie.PosterURL,
		movie.Overview,
		movie.Genres,
		movie.VoteAverage,
		movie.Runtime,
		movie.ID,
		movie.Version,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, stmt, args...).Scan(&movie.Version)
	if err != nil {
		switch {
		case err == sql.ErrNoRows:
			return ErrEditConflict
		default:
			return err
		}
	}

	return nil
}

func (m MovieModel) Delete(id int64) error {
	stmt := `DELETE FROM movies WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.DB.ExecContext(ctx, stmt, id)
	if err != nil {
		return err
	}

	return nil
}
