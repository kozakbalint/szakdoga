-- name: GetWatchlistTvShow :one
SELECT * FROM watchlist_tv WHERE tmdb_id = $1 AND user_id = $2;

-- name: ListWatchlistTvShows :many
SELECT * FROM watchlist_tv WHERE user_id = $1;

-- name: InsertWatchlistTvShow :one
INSERT INTO watchlist_tv
(tmdb_id, user_id)
VALUES($1, $2)
RETURNING *;

-- name: DeleteWatchlistTvShow :one
DELETE FROM watchlist_tv WHERE tmdb_id = $1 AND user_id = $2
RETURNING *;
