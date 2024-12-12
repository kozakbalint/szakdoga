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
}

func NewModels(repository *repository.Queries) Models {
	return Models{
		Tokens: TokenModel{
			Repository: repository,
		},
		Users: UserModel{
			Repository: repository,
		},
		Movies: MovieModel{
			Repository: repository,
		},
		MoviesWatchlist: MoviesWatchlistModel{
			Repository: repository,
		},
	}
}
