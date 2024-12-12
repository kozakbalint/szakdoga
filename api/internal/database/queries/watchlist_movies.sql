-- name: InsertWatchlistMovie :one
INSERT INTO movies_watchlist
(user_id, movie_id, watched)
VALUES($1, $2, $3)
RETURNING *;

-- name: GetWatchlistMovie :one
SELECT * FROM movies_watchlist WHERE user_id = $1 AND id = $2;

-- name: UpdateWatchlistMovie :one
UPDATE movies_watchlist
SET user_id = $1, movie_id = $2, added_at = $3, updated_at = $4, watched = $5
WHERE id = $6
RETURNING *;

-- name: DeleteWatchlistMovie :one
DELETE FROM movies_watchlist WHERE id = $1
RETURNING *;

-- name: ListWatchlistMovies :many
SELECT * FROM movies_watchlist WHERE user_id = $1;

-- name: GetWatchlistMovieByMovieId :one
SELECT * FROM movies_watchlist WHERE user_id = $1 AND movie_id = $2;
