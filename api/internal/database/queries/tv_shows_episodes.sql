-- name: InsertTvShowEpisode :one
INSERT INTO tv_shows_episodes
(tv_show_id, season_id, episode_number, title, overview, air_date)
VALUES($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetTvShowEpisode :one
SELECT * FROM tv_shows_episodes WHERE id = $1;

-- name: GetTvShowEpisodeByTvShowIdAndSeasonNumberAndEpisodeNumber :one
SELECT * FROM tv_shows_episodes WHERE tv_show_id = $1 AND season_id = $2 AND episode_number = $3;

-- name: ListTvShowEpisodes :many
SELECT * FROM tv_shows_episodes WHERE tv_show_id = $1 AND season_id = $2 ORDER BY episode_number;

-- name: ListTvShowEpisodesByTvShowTmdbIdAndSeasonNumber :many
SELECT e.*
FROM tv_shows_episodes e
JOIN tv_shows_seasons s ON e.season_id = s.id
JOIN tv_shows t ON s.tv_show_id = t.id
WHERE t.tmdb_id = $1 AND s.season_number = $2
ORDER BY e.episode_number;

-- name: UpdateTvShowEpisode :one
UPDATE tv_shows_episodes
SET episode_number = $2, title = $3, overview = $4, air_date = $5
WHERE id = $1
RETURNING *;

-- name: DeleteTvShowEpisode :one
DELETE FROM tv_shows_episodes
WHERE id = $1
RETURNING *;

-- name: DeleteTvShowEpisodeByTvShowIdAndSeasonNumberAndEpisodeNumber :one
DELETE FROM tv_shows_episodes
WHERE tv_show_id = $1 AND season_id = $2 AND episode_number = $3
RETURNING *;

-- name: DeleteTvShowEpisodesByTvShowId :many
DELETE FROM tv_shows_episodes
WHERE tv_show_id = $1
RETURNING *;

-- name: DeleteTvShowEpisodesByTvShowTmdbId :many
DELETE FROM tv_shows_episodes
WHERE tv_show_id IN (SELECT id FROM tv_shows WHERE tmdb_id = $1)
RETURNING *;
