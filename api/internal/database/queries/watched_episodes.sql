-- name: InsertWatchedEpisode :one
INSERT INTO watched_episodes (user_id, episode_id, watched_at) VALUES ($1, $2, $3) RETURNING *;

-- name: GetWatchedEpisode :one
SELECT * FROM watched_episodes WHERE user_id = $1 AND episode_id = $2;

-- name: GetWatchedEpisodesByShow :many
SELECT * FROM watched_episodes
WHERE user_id = $1 AND episode_id IN (SELECT id FROM tv_shows_episodes WHERE tv_show_id = $2);

-- name: GetWatchedEpisodeBySeason :many
SELECT * FROM watched_episodes
WHERE user_id = $1 AND episode_id IN (SELECT id FROM tv_shows_episodes WHERE tv_show_id = $2 AND season_id = $3);

-- name: UpdateWatchedEpisode :one
UPDATE watched_episodes SET watched_at = $3 WHERE user_id = $1 AND episode_id = $2 RETURNING *;

-- name: DeleteWatchedEpisode :one
DELETE FROM watched_episodes WHERE user_id = $1 AND episode_id = $2 RETURNING *;

-- name: GetWatchedProgress :one
WITH total_episodes AS (
    SELECT
        ts.id AS tv_show_id,
        SUM(s.episode_count) AS total_count
    FROM
        tv_shows ts
    JOIN
        tv_shows_seasons s ON ts.id = s.tv_show_id
    WHERE
        ts.id = $1
    GROUP BY
        ts.id
),
watched_episodes AS (
    SELECT
        ts.id AS tv_show_id,
        COUNT(we.id) AS watched_count
    FROM
        tv_shows ts
    JOIN
        tv_shows_seasons s ON ts.id = s.tv_show_id
    JOIN
        tv_shows_episodes e ON s.id = e.season_id
    JOIN
        watched_episodes we ON e.id = we.episode_id
    WHERE
        ts.id = $1
        AND we.user_id = $2
    GROUP BY
        ts.id
)
SELECT
    te.tv_show_id,
    COALESCE(watched_count, 0) AS watched_count,
    te.total_count AS total_count,
    ROUND(
        COALESCE(watched_count::numeric, 0) / te.total_count * 100,
        2
    ) AS watched_percentage
FROM
    total_episodes te
LEFT JOIN
    watched_episodes we ON te.tv_show_id = we.tv_show_id;
