-- name: InsertWatchedMovie :one
INSERT INTO watched_movies
(user_id, movie_id)
VALUES($1, $2)
RETURNING *;

-- name: GetWatchedMovie :one
SELECT * FROM watched_movies
WHERE user_id = $1 AND id = $2;

-- name: UpdateWatchedMovie :one
UPDATE watched_movies
SET user_id = $1, movie_id = $2, watched_at = $3
WHERE id = $4
RETURNING *;

-- name: DeleteWatchedMovie :one
DELETE FROM watched_movies
WHERE id = $1
RETURNING *;

-- name: ListWatchedMovies :many
SELECT * FROM watched_movies
WHERE user_id = $1;

-- name: GetWatchedMovieByMovieId :one
SELECT * FROM watched_movies
WHERE user_id = $1 AND movie_id = $2;
