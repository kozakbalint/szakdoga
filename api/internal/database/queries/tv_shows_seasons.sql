-- name: InsertTvShowSeason :one
INSERT INTO tv_shows_seasons
(tv_show_id, season_number, episode_count, air_date)
VALUES($1, $2, $3, $4)
RETURNING *;

-- name: GetTvShowSeason :one
SELECT * FROM tv_shows_seasons WHERE id = $1;

-- name: GetTvShowSeasonByTvShowIdAndSeasonNumber :one
SELECT * FROM tv_shows_seasons WHERE tv_show_id = $1 AND season_number = $2;

-- name: ListTvShowSeasons :many
SELECT * FROM tv_shows_seasons WHERE tv_show_id = $1 ORDER BY season_number;

-- name: ListTvShowSeasonsByTvShowTmdbId :many
SELECT s.*
FROM tv_shows_seasons s
JOIN tv_shows t ON s.tv_show_id = t.id
WHERE t.tmdb_id = $1
ORDER BY s.season_number;

-- name: UpdateTvShowSeason :one
UPDATE tv_shows_seasons
SET season_number = $2, episode_count = $3, air_date = $4
WHERE id = $1
RETURNING *;

-- name: DeleteTvShowSeason :one
DELETE FROM tv_shows_seasons
WHERE id = $1
RETURNING *;

-- name: DeleteTvShowSeasonByTvShowIdAndSeasonNumber :one
DELETE FROM tv_shows_seasons
WHERE tv_show_id = $1 AND season_number = $2
RETURNING *;
