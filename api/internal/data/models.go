package data

import (
	"errors"

	"github.com/kozakbalint/szakdoga/api/internal/repository"
)

var (
	ErrRecordNotFound = errors.New("record not found")
	ErrEditConflict   = errors.New("edit conflict")
)

type Models struct {
	Tokens          TokenModel
	Users           UserModel
	Movies          MovieModel
	MoviesWatchlist MoviesWatchlistModel
	WatchedMovies   WatchedMoviesModel
}

func NewModels(repo *repository.Queries) Models {
	return Models{
		Tokens: TokenModel{
			Repository: repo,
		},
		Users: UserModel{
			Repository: repo,
		},
		Movies: MovieModel{
			Repository: repo,
		},
		MoviesWatchlist: MoviesWatchlistModel{
			Repository: repo,
		},
		WatchedMovies: WatchedMoviesModel{
			Repository: repo,
		},
	}
}
