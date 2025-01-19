-- name: GetWatchlistMovie :one
SELECT * FROM watchlist_movies WHERE tmdb_id = $1 AND user_id = $2;

-- name: ListWatchlistMovies :many
SELECT * FROM watchlist_movies WHERE user_id = $1;

-- name: InsertWatchlistMovie :one
INSERT INTO watchlist_movies
(tmdb_id, user_id)
VALUES($1, $2)
RETURNING *;

-- name: DeleteWatchlistMovie :one
DELETE FROM watchlist_movies WHERE tmdb_id = $1 AND user_id = $2
RETURNING *;
