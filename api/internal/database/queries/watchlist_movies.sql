-- name: InsertWatchlistMovie :one
INSERT INTO watchlist_movies
(user_id, movie_id)
VALUES($1, $2)
RETURNING *;

-- name: GetWatchlistMovie :one
SELECT * FROM watchlist_movies WHERE user_id = $1 AND id = $2;

-- name: UpdateWatchlistMovie :one
UPDATE watchlist_movies
SET user_id = $1, movie_id = $2, added_at = $3
WHERE id = $4
RETURNING *;

-- name: DeleteWatchlistMovie :one
DELETE FROM watchlist_movies WHERE id = $1
RETURNING *;

-- name: ListWatchlistMovies :many
SELECT * FROM watchlist_movies WHERE user_id = $1;

-- name: GetWatchlistMovieByMovieId :one
SELECT * FROM watchlist_movies WHERE user_id = $1 AND movie_id = $2;
