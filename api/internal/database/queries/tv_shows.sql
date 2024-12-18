-- name: InsertTvShow :one
INSERT INTO tv_shows
(tmdb_id, title, release_date, poster_url, overview, genres, vote_average)
VALUES($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: GetTvShow :one
SELECT * FROM tv_shows WHERE id = $1;

-- name: GetTvShowByTmdbId :one
SELECT * FROM tv_shows WHERE tmdb_id = $1;

-- name: ListTvShows :many
SELECT * FROM tv_shows ORDER BY id LIMIT $1;

-- name: ListWatchedTvShows :many
SELECT t.*
FROM tv_shows t
JOIN watched_episodes w ON t.id = w.episode_id
WHERE w.user_id = $1
GROUP BY t.id
ORDER BY t.id;

-- name: UpdateTvShow :one
UPDATE tv_shows
SET title = $2, release_date = $3, poster_url = $4, overview = $5, genres = $6, vote_average = $7, version = version + 1
WHERE id = $1 AND version = $8
RETURNING *;

-- name: DeleteTvShow :one
DELETE FROM tv_shows
WHERE id = $1
RETURNING *;

-- name: DeleteTvShowByTmdbId :one
DELETE FROM tv_shows
WHERE tmdb_id = $1
RETURNING *;
