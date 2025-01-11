package data

import (
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/kozakbalint/szakdoga/api/internal/repository"
)

var (
	ErrNotFound     = errors.New("record not found")
	ErrConflict     = errors.New("conflict")
	ErrInvalidInput = errors.New("invalid input")
	ErrInternal     = errors.New("internal error")
)

type Models struct {
	Tokens    TokenModel
	Users     UserModel
	Watchlist WatchlistModel
}

func NewModels(repo *repository.Queries) Models {
	return Models{
		Tokens: TokenModel{
			Repository: repo,
		},
		Users: UserModel{
			Repository: repo,
		},
		Watchlist: WatchlistModel{
			Repository: repo,
		},
	}
}

func WrapError(err error) error {
	if err == nil {
		return nil
	}

	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		switch pgErr.Code {
		case "23505":
			return ErrConflict
		case "22001":
			return ErrInvalidInput
		case "42P01":
			return ErrInternal
		}
	}

	if errors.Is(err, pgx.ErrNoRows) {
		return ErrNotFound
	}

	return ErrInternal
}
