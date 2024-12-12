package data

import (
	"context"
	"database/sql"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/kozakbalint/szakdoga/api/internal/repository"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
	"github.com/lib/pq"
)

type Movie struct {
	ID          int64     `json:"id"`
	TmdbID      int       `json:"tmdb_id"`
	CreatedAt   time.Time `json:"created_at"`
	LastFetched time.Time `json:"last_fetched_at"`
	Title       string    `json:"title"`
	ReleaseDate string    `json:"release_date"`
	PosterURL   string    `json:"poster_url"`
	Overview    string    `json:"overview"`
	Genres      []string  `json:"genres"`
	VoteAverage float32   `json:"vote_average"`
	Runtime     int       `json:"runtime"`
	Version     int       `json:"version"`
}

type MovieModel struct {
	Repository *repository.Queries
}

func (m MovieModel) Insert(movie *Movie) (*Movie, error) {
	var voterAverage pgtype.Numeric
	if err := voterAverage.Scan(movie.VoteAverage); err != nil {
		return nil, err
	}

	args := repository.InsertMovieParams{
		TmdbID:      int32(movie.TmdbID),
		Title:       movie.Title,
		ReleaseDate: movie.ReleaseDate,
		PosterUrl:   movie.PosterURL,
		Overview:    movie.Overview,
		Genres:      pq.StringArray(movie.Genres),
		VoteAverage: voterAverage,
		Runtime:     int32(movie.Runtime),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	movieRes, err := m.Repository.InsertMovie(ctx, args)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
			return nil, ErrDuplicateRecord
		}
		return nil, err
	}

	movie = &Movie{
		ID:          movieRes.ID,
		TmdbID:      int(movieRes.TmdbID),
		CreatedAt:   movieRes.CreatedAt,
		LastFetched: movieRes.LastFetchedAt,
		Title:       movieRes.Title,
		ReleaseDate: movieRes.ReleaseDate,
		PosterURL:   movieRes.PosterUrl,
		Overview:    movieRes.Overview,
		Genres:      movieRes.Genres,
		VoteAverage: movie.VoteAverage,
		Runtime:     int(movieRes.Runtime),
		Version:     int(movieRes.Version),
	}

	return movie, nil
}

func (m MovieModel) Get(id int64) (*Movie, error) {
	var movie Movie

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	movieRes, err := m.Repository.GetMovie(ctx, id)
	if err != nil {
		return nil, err
	}

	voterAverage, err := utils.ConvertNumericToFloat32(movieRes.VoteAverage)

	movie = Movie{
		ID:          movieRes.ID,
		TmdbID:      int(movieRes.TmdbID),
		CreatedAt:   movieRes.CreatedAt,
		LastFetched: movieRes.LastFetchedAt,
		Title:       movieRes.Title,
		ReleaseDate: movieRes.ReleaseDate,
		PosterURL:   movieRes.PosterUrl,
		Overview:    movieRes.Overview,
		Genres:      movieRes.Genres,
		VoteAverage: voterAverage,
		Runtime:     int(movieRes.Runtime),
		Version:     int(movieRes.Version),
	}

	return &movie, nil
}

func (m MovieModel) GetByTmdbID(tmdbID int) (*Movie, error) {
	var movie Movie

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	movieRes, err := m.Repository.GetMovieByTmdbId(ctx, int32(tmdbID))
	if err != nil {
		switch err {
		case sql.ErrNoRows:
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	voterAverage, err := utils.ConvertNumericToFloat32(movieRes.VoteAverage)

	movie = Movie{
		ID:          movieRes.ID,
		TmdbID:      int(movieRes.TmdbID),
		CreatedAt:   movieRes.CreatedAt,
		LastFetched: movieRes.LastFetchedAt,
		Title:       movieRes.Title,
		ReleaseDate: movieRes.ReleaseDate,
		PosterURL:   movieRes.PosterUrl,
		Overview:    movieRes.Overview,
		Genres:      movieRes.Genres,
		VoteAverage: voterAverage,
		Runtime:     int(movieRes.Runtime),
		Version:     int(movieRes.Version),
	}

	return &movie, nil
}

func (m MovieModel) Update(movie *Movie) error {
	var voterAverage pgtype.Numeric
	if err := voterAverage.Scan(movie.VoteAverage); err != nil {
		return err
	}
	args := repository.UpdateMovieParams{
		ID:          movie.ID,
		Title:       movie.Title,
		ReleaseDate: movie.ReleaseDate,
		PosterUrl:   movie.PosterURL,
		Overview:    movie.Overview,
		Genres:      pq.StringArray(movie.Genres),
		VoteAverage: voterAverage,
		Runtime:     int32(movie.Runtime),
		Version:     int32(movie.Version),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.UpdateMovie(ctx, args)
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
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.DeleteMovie(ctx, id)
	if err != nil {
		return err
	}

	return nil
}
