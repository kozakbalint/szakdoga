package main

import (
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
	"github.com/kozakbalint/szakdoga/api/internal/data"
)

type MovieWatchlistResponse struct {
	ID       int64      `json:"id"`
	Movie    data.Movie `json:"movie"`
	AddedAt  string     `json:"added_at"`
	UpdateAt string     `json:"updated_at"`
	Watched  bool       `json:"watched"`
}

func (app *application) getMoviesWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)
	if user == nil {
		app.authenticationRequiredResponse(w, r)
		return
	}

	moviesWatchlist, err := app.models.MoviesWatchlist.GetWatchlist(user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	var watchlistResponse []MovieWatchlistResponse
	for _, entry := range moviesWatchlist.Entries {
		movie, err := app.models.Movies.Get(entry.MovieID)
		if err != nil || movie == nil {
			app.serverErrorResponse(w, r, err)
			return
		}
		watchlistResponse = append(watchlistResponse, MovieWatchlistResponse{
			ID:       entry.ID,
			Movie:    *movie,
			AddedAt:  entry.AddedAt,
			UpdateAt: entry.UpdateAt,
			Watched:  entry.Watched,
		})
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"watchlist": watchlistResponse}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) addMovieToWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)
	if user == nil {
		app.authenticationRequiredResponse(w, r)
		return
	}

	var input struct {
		TmdbID int64 `json:"tmdb_id"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	tmdb_movie, err := app.tmdb.GetMovieDetails(int(input.TmdbID), nil)
	if err != nil || tmdb_movie == nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	genres := []string{}
	for _, genre := range tmdb_movie.Genres {
		genres = append(genres, genre.Name)
	}

	movie := &data.Movie{
		TmdbID:      int(input.TmdbID),
		Title:       tmdb_movie.Title,
		ReleaseDate: tmdb_movie.ReleaseDate,
		PosterURL:   tmdb.GetImageURL(tmdb_movie.PosterPath, "w500"),
		Overview:    tmdb_movie.Overview,
		Genres:      genres,
		VoteAverage: tmdb_movie.VoteAverage,
		Runtime:     tmdb_movie.Runtime,
	}

	movie, err = app.models.Movies.Insert(movie)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	moviesWatchlistEntry := &data.MoviesWatchlistEntry{
		UserID:  user.ID,
		MovieID: movie.ID,
		Watched: false,
	}

	moviesWatchlistEntry, err = app.models.MoviesWatchlist.Insert(moviesWatchlistEntry)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"message": "movie added to watchlist"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) removeMovieFromWatchlistHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)
	if user == nil {
		app.authenticationRequiredResponse(w, r)
		return
	}

	id, err := app.readIDParam(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	_, err = app.models.MoviesWatchlist.GetWatchlistEntry(id, user.ID)
	if err != nil {
		switch err {
		case data.ErrRecordNotFound:
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.models.MoviesWatchlist.DeleteWatchlistEntry(id)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "movie removed from watchlist"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
