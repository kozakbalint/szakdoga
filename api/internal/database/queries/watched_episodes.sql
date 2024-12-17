-- name: InsertWatchedEpisode :one
INSERT INTO watched_episodes
(user_id, episode_id)
VALUES($1, $2)
RETURNING *;

-- name: InsertWatchedSeason :one
INSERT INTO watched_episodes
(user_id, episode_id)
SELECT $1, id
FROM tv_shows_episodes
WHERE season_id = $2
ON CONFLICT DO NOTHING
RETURNING *;

-- name: InsertWatchedShow :one
INSERT INTO watched_episodes
(user_id, episode_id)
SELECT $1, id
FROM tv_shows_episodes
WHERE tv_show_id = $2
ON CONFLICT DO NOTHING
RETURNING *;

-- name: GetWatchedShows :many
SELECT DISTINCT t.*
FROM watched_episodes w
JOIN tv_shows_episodes e ON w.episode_id = e.id
JOIN tv_shows t ON e.tv_show_id = t.id
WHERE w.user_id = $1
GROUP BY t.id
ORDER BY t.title;

-- name: GetWatchedSeasons :many
SELECT s.*
FROM tv_shows_seasons s
JOIN tv_shows t ON s.tv_show_id = t.id
WHERE NOT EXISTS (
    SELECT 1
    FROM tv_shows_episodes e
    LEFT JOIN (
        SELECT DISTINCT episode_id
        FROM watched_episodes
        WHERE user_id = $1
    ) w ON e.id = w.episode_id
    WHERE e.season_id = s.id AND w.episode_id IS NULL
)
ORDER BY s.season_number;
