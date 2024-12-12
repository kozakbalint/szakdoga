-- name: InsertToken :one
INSERT INTO tokens (hash, user_id, expiry)
VALUES ($1, $2, $3)
RETURNING *;

-- name: DeleteAllTokens :one
DELETE FROM tokens
WHERE user_id = $1
RETURNING *;
