package data

import (
	"context"
	"crypto/sha256"
	"errors"
	"time"

	"github.com/kozakbalint/szakdoga/api/internal/repository"
	"github.com/kozakbalint/szakdoga/api/internal/types"
	"github.com/kozakbalint/szakdoga/api/internal/validator"
	"golang.org/x/crypto/bcrypt"
)

var ErrDuplicateEmail = errors.New("duplicate email")
var AnonymousUser = &User{}

type User struct {
	ID        int64     `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Password  password  `json:"-"`
	Version   int       `json:"-"`
}

type password struct {
	plaintext *string
	hash      []byte
}

func (u *User) IsAnonymous() bool {
	return u == AnonymousUser
}

func (p *password) Set(plaintextPassword string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(plaintextPassword), 12)
	if err != nil {
		return err
	}

	p.plaintext = &plaintextPassword
	p.hash = hash

	return nil
}

func (p *password) Matches(plaintextPassword string) (bool, error) {
	err := bcrypt.CompareHashAndPassword(p.hash, []byte(plaintextPassword))
	if err != nil {
		switch {
		case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
			return false, nil
		default:
			return false, err
		}
	}

	return true, nil
}

func ValidateEmail(v *validator.Validator, email string) {
	v.Check(email != "", "email", "must be provided")
	v.Check(validator.Matches(email, validator.EmailRX), "email", "must be a valid email address")
}

func ValidatePasswordPlaintext(v *validator.Validator, password string) {
	v.Check(password != "", "password", "must be provided")
	v.Check(len(password) >= 8, "password", "must be at least 8 bytes long")
	v.Check(len(password) <= 72, "password", "must not be more than 72 bytes long")
}

func ValidateUser(v *validator.Validator, user *User) {
	v.Check(user.Name != "", "name", "must be provided")
	v.Check(len(user.Name) <= 500, "name", "must not be more than 500 bytes long")

	ValidateEmail(v, user.Email)

	if user.Password.plaintext != nil {
		ValidatePasswordPlaintext(v, *user.Password.plaintext)
	}

	if user.Password.hash == nil {
		panic("missing password hash for user")
	}
}

type UserModel struct {
	Repository *repository.Queries
}

func (m UserModel) Insert(user *User) (*User, error) {
	args := repository.InsertUserParams{
		Name:         user.Name,
		Email:        user.Email,
		PasswordHash: user.Password.hash,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	userRes, err := m.Repository.InsertUser(ctx, args)
	if err != nil {
		return nil, WrapError(err)
	}

	user = &User{
		ID:        userRes.ID,
		CreatedAt: userRes.CreatedAt,
		Name:      userRes.Name,
		Email:     userRes.Email,
		Password:  password{hash: userRes.PasswordHash},
		Version:   int(userRes.Version),
	}

	return user, nil
}

func (m UserModel) Get(id int64) (*User, error) {
	var user User

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	userRes, err := m.Repository.GetUser(ctx, id)
	if err != nil {
		return nil, WrapError(err)
	}

	user = User{
		ID:        userRes.ID,
		CreatedAt: userRes.CreatedAt,
		Name:      userRes.Name,
		Email:     userRes.Email,
		Password:  password{hash: userRes.PasswordHash},
		Version:   int(userRes.Version),
	}

	return &user, nil
}

func (m UserModel) GetByEmail(email string) (*User, error) {
	var user User

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	userRes, err := m.Repository.GetUserByEmail(ctx, email)
	if err != nil {
		return nil, WrapError(err)
	}

	user = User{
		ID:        userRes.ID,
		CreatedAt: userRes.CreatedAt,
		Name:      userRes.Name,
		Email:     userRes.Email,
		Password:  password{hash: userRes.PasswordHash},
		Version:   int(userRes.Version),
	}

	return &user, nil
}

func (m UserModel) Update(user *User) error {
	args := repository.UpdateUserParams{
		Name:         user.Name,
		Email:        user.Email,
		PasswordHash: user.Password.hash,
		ID:           user.ID,
		Version:      int32(user.Version),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.UpdateUser(ctx, args)
	if err != nil {
		return WrapError(err)
	}

	return nil
}

func (m UserModel) GetForToken(tokenPlaintext string) (*User, error) {
	tokenHash := sha256.Sum256([]byte(tokenPlaintext))

	args := repository.GetUserByTokenParams{
		Hash:   tokenHash[:],
		Expiry: time.Now(),
	}

	var user User

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	userRes, err := m.Repository.GetUserByToken(ctx, args)

	if err != nil {
		return nil, WrapError(err)
	}

	user = User{
		ID:        userRes.ID,
		CreatedAt: userRes.CreatedAt,
		Name:      userRes.Name,
		Email:     userRes.Email,
		Password:  password{hash: userRes.PasswordHash},
		Version:   int(userRes.Version),
	}

	return &user, nil
}

func (m UserModel) GatherUserStats(user *User) (*types.UserStats, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	watchedEps, err := m.Repository.CountWatchedTvEpisodes(ctx, int32(user.ID))
	if err != nil {
		return nil, WrapError(err)
	}

	watchedMovies, err := m.Repository.CountWatchedMovies(ctx, int32(user.ID))
	if err != nil {
		return nil, WrapError(err)
	}

	watchlistMovies, err := m.Repository.CountWatchlistMovies(ctx, int32(user.ID))
	if err != nil {
		return nil, WrapError(err)
	}

	watchlistTv, err := m.Repository.CountWatchlistTvShows(ctx, int32(user.ID))
	if err != nil {
		return nil, WrapError(err)
	}

	stats := types.UserStats{
		WatchedEpisodes: int(watchedEps),
		WatchedMovies:   int(watchedMovies),
		WatchlistCount:  int(watchlistTv) + int(watchlistMovies),
	}

	return &stats, nil
}
