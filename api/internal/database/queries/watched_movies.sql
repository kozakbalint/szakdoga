-- name: GetWatchedMovie :one
SELECT * FROM watched_movies WHERE tmdb_id = $1 AND user_id = $2;

-- name: ListWatchedMovies :many
SELECT * FROM watched_movies WHERE user_id = $1;

-- name: CountWatchedMovies :one
SELECT COUNT(*) FROM watched_movies WHERE user_id = $1;

-- name: InsertWatchedMovie :one
INSERT INTO watched_movies
(tmdb_id, user_id)
VALUES($1, $2)
RETURNING *;

-- name: DeleteWatchedMovie :one
DELETE FROM watched_movies WHERE tmdb_id = $1 AND user_id = $2
RETURNING *;
