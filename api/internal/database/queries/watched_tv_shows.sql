-- name: GetWatchedTv :one
SELECT * FROM watched_tv_shows WHERE tmdb_id = $1 AND user_id = $2 AND status in ('watched', 'in progress');

-- name: GetWatchedTvSeason :one
SELECT * FROM watched_tv_seasons WHERE tmdb_id = $1 AND user_id = $2 AND season_number = $3 AND status in ('watched', 'in progress');

-- name: GetWatchedTvEpisode :one
SELECT * FROM watched_tv_episodes WHERE tmdb_id = $1 AND user_id = $2 AND season_number = $3 AND episode_number = $4 AND watched_at IS NOT NULL;

-- name: ListWatchedTv :many
SELECT * FROM watched_tv_shows WHERE user_id = $1 AND
status in ('watched', 'in progress');

-- name: ListWatchedTvSeasons :many
SELECT * FROM watched_tv_seasons WHERE tmdb_id = $1 AND user_id = $2 AND status in ('watched', 'in progress');

-- name: ListWatchedTvEpisodes :many
SELECT * FROM watched_tv_episodes WHERE tmdb_id = $1 AND user_id = $2 AND season_number = $3 AND watched_at IS NOT NULL;

-- name: InsertWatchedTv :one
INSERT INTO watched_tv_shows
(tmdb_id, user_id, total_seasons)
VALUES($1, $2, $3) ON CONFLICT (tmdb_id, user_id) DO NOTHING
RETURNING *;

-- name: InsertWatchedTvSeason :one
INSERT INTO watched_tv_seasons
(tmdb_id, user_id, season_number, total_episodes)
VALUES($1, $2, $3, $4) ON CONFLICT (tmdb_id, user_id, season_number) DO NOTHING
RETURNING *;

-- name: InsertWatchedTvEpisode :one
INSERT INTO watched_tv_episodes
(tmdb_id, user_id, season_number, episode_number, watched_at)
VALUES($1, $2, $3, $4, $5) ON CONFLICT (tmdb_id, user_id, season_number, episode_number) DO NOTHING
RETURNING *;

-- name: DeleteWatchedTv :one
DELETE FROM watched_tv_shows WHERE tmdb_id = $1 AND user_id = $2
RETURNING *;

-- name: DeleteWatchedTvSeason :one
DELETE FROM watched_tv_seasons WHERE tmdb_id = $1 AND user_id = $2 AND season_number = $3
RETURNING *;

-- name: DeleteWatchedTvEpisode :one
DELETE FROM watched_tv_episodes WHERE tmdb_id = $1 AND user_id = $2 AND season_number = $3 AND episode_number = $4
RETURNING *;

-- name: DeleteAllWatchedTvSeasons :many
DELETE FROM watched_tv_seasons WHERE tmdb_id = $1 AND user_id = $2
RETURNING *;

-- name: DeleteAllWatchedTvEpisodes :many
DELETE FROM watched_tv_episodes WHERE tmdb_id = $1 AND user_id = $2
RETURNING *;
