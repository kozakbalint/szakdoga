-- name: InsertWatchlistTvShows :one
INSERT INTO watchlist_tv_shows
(user_id, tv_show_id, added_at)
VALUES($1, $2, $3)
RETURNING *;

-- name: GetWatchlistTvShows :one
SELECT * FROM watchlist_tv_shows WHERE user_id = $1 AND id = $2;

-- name: UpdateWatchlistTvShows :one
UPDATE watchlist_tv_shows
SET user_id = $1, tv_show_id = $2, added_at = $3
WHERE id = $4
RETURNING *;

-- name: DeleteWatchlistTvShows :one
DELETE FROM watchlist_tv_shows WHERE id = $1
RETURNING *;

-- name: ListWatchlistTvShows :many
SELECT * FROM watchlist_tv_shows WHERE user_id = $1;

-- name: GetWatchlistTvShowsByTVId :one
SELECT * FROM watchlist_tv_shows WHERE user_id = $1 AND tv_show_id = $2;
