-- name: InsertMovie :one
INSERT INTO movies
(tmdb_id, title, release_date, poster_url, overview, genres, vote_average, runtime)
VALUES($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;

-- name: GetMovie :one
SELECT * FROM movies WHERE id = $1;

-- name: GetMovieByTmdbId :one
SELECT * FROM movies WHERE tmdb_id = $1;

-- name: UpdateMovie :one
UPDATE movies
SET title = $2, release_date = $3, poster_url = $4, overview = $5, genres = $6, vote_average = $7, runtime = $8, version = version + 1
WHERE id = $1 AND version = $9
RETURNING *;

-- name: DeleteMovie :one
DELETE FROM movies
WHERE id = $1
RETURNING *;
