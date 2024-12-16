-- name: InsertWatchedEpisode :one
INSERT INTO watched_episodes
(user_id, episode_id)
VALUES($1, $2)
RETURNING *;

-- name: GetWatchedEpisode :one
SELECT * FROM watched_episodes
WHERE user_id = $1 AND id = $2;

-- name: UpdateWatchedEpisode :one
UPDATE watched_episodes
SET user_id = $1, episode_id = $2, watched_at = $3
WHERE id = $4
RETURNING *;

-- name: DeleteWatchedEpisode :one
DELETE FROM watched_episodes
WHERE id = $1 AND user_id = $2
RETURNING *;

-- name: DeleteWatchedEpisodeByEpisodeId :one
DELETE FROM watched_episodes
WHERE user_id = $1 AND episode_id = $2
RETURNING *;

-- name: ListWatchedEpisodes :many
SELECT * FROM watched_episodes
WHERE user_id = $1;

-- name: GetWatchedEpisodeByEpisodeId :many
SELECT * FROM watched_episodes
WHERE user_id = $1 AND episode_id = $2;

-- name: InsertWatchedSeason :one
INSERT INTO watched_episodes (user_id, episode_id)
SELECT $1, e.id FROM tv_shows_episodes e
WHERE e.season_id = $2
RETURNING *;

-- name: GetWatchedSeason :one
SELECT * FROM watched_episodes
WHERE user_id = $1 AND episode_id IN (
    SELECT e.id FROM tv_shows_episodes e
    WHERE e.season_id = $2
);

-- name: DeleteWatchedSeason :one
DELETE FROM watched_episodes
WHERE user_id = $1 AND episode_id IN (
    SELECT e.id FROM tv_shows_episodes e
    WHERE e.season_id = $2
)
RETURNING *;

-- name: ListWatchedSeasons :many
SELECT * FROM watched_episodes
WHERE user_id = $1 AND episode_id IN (
    SELECT e.id FROM tv_shows_episodes e
    WHERE e.season_id = $2
);

-- name: InsertWatchedShow :one
INSERT INTO watched_episodes (user_id, episode_id)
SELECT $1, e.id FROM tv_shows_episodes e
WHERE e.tv_show_id = $2
RETURNING *;

-- name: GetWatchedShow :one
SELECT * FROM watched_episodes
WHERE user_id = $1 AND episode_id IN (
    SELECT e.id FROM tv_shows_episodes e
    WHERE e.tv_show_id = $2
);

-- name: DeleteWatchedShow :one
DELETE FROM watched_episodes
WHERE user_id = $1 AND episode_id IN (
    SELECT e.id FROM tv_shows_episodes e
    WHERE e.tv_show_id = $2
)
RETURNING *;

-- name: ListWatchedShows :many
SELECT * FROM watched_episodes
WHERE user_id = $1 AND episode_id IN (
    SELECT e.id FROM tv_shows_episodes e
    WHERE e.tv_show_id = $2
);

-- name: GetNextEpisode :one
WITH next_episode AS (
    SELECT e.*
    FROM tv_shows_episodes e
    JOIN tv_shows_seasons s ON e.season_id = s.id
    WHERE s.tv_show_id = $1
      AND e.id NOT IN (
          SELECT episode_id
          FROM watched_episodes
          WHERE user_id = $2
      )
    ORDER BY s.season_number, e.episode_number
    LIMIT 1
)
SELECT * FROM next_episode;
