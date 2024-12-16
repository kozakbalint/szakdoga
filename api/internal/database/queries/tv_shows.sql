-- name: GetTvShowById :one
SELECT * FROM tv_shows WHERE id = $1;

-- name: GetTvShowByTmdbId :one
SELECT * FROM tv_shows WHERE tmdb_id = $1;

-- name: GetTvShowSeasons :many
SELECT * FROM tv_shows_seasons WHERE tv_show_id = $1;

-- name: GetTvShowEpisodes :many
SELECT * FROM tv_shows_episodes WHERE tv_show_id = $1;

-- name: GetTvShowSeasonEpisodes :many
SELECT * FROM tv_shows_episodes WHERE season_id = $1;

-- name: GetTvShowSeason :one
SELECT * FROM tv_shows_seasons WHERE tv_show_id = $1 AND season_number = $2;

-- name: GetTvShowEpisode :one
SELECT * FROM tv_shows_episodes WHERE tv_show_id = $1 AND season_id = $2 AND episode_number = $3;

-- name: GetTvShowSeasonEpisode :one
SELECT * FROM tv_shows_episodes WHERE season_id = $1 AND episode_number = $2;

-- name: InsertTvShow :one
INSERT INTO tv_shows
(tmdb_id, created_at, last_fetched_at, title, release_date, poster_url, overview, genres, vote_average, version)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;

-- name: InsertTvShowSeason :one
INSERT INTO tv_shows_seasons
(tv_show_id, season_number, episode_count, air_date, created_at, last_fetched_at)
VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;

-- name: InsertTvShowEpisode :one
INSERT INTO tv_shows_episodes
(tv_show_id, season_id, episode_number, title, overview, air_date, created_at, last_fetched_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;

-- name: UpdateTvShow :one
UPDATE tv_shows
SET tmdb_id = $2, created_at = $3, last_fetched_at = $4, title = $5, release_date = $6, poster_url = $7, overview = $8, genres = $9, vote_average = $10, version = $11
WHERE id = $1 RETURNING *;

-- name: UpdateTvShowSeason :one
UPDATE tv_shows_seasons
SET tv_show_id = $2, season_number = $3, episode_count = $4, air_date = $5, created_at = $6, last_fetched_at = $7
WHERE id = $1 RETURNING *;

-- name: UpdateTvShowEpisode :one
UPDATE tv_shows_episodes
SET tv_show_id = $2, season_id = $3, episode_number = $4, title = $5, overview = $6, air_date = $7, created_at = $8, last_fetched_at = $9
WHERE id = $1 RETURNING *;

-- name: DeleteTvShow :one
DELETE FROM tv_shows WHERE id = $1
RETURNING *;

-- name: DeleteTvShowSeason :one
DELETE FROM tv_shows_seasons WHERE id = $1
RETURNING *;

-- name: DeleteTvShowEpisode :one
DELETE FROM tv_shows_episodes WHERE id = $1
RETURNING *;
