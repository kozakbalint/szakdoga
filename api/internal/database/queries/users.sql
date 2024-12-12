-- name: InsertUser :one
INSERT INTO users
(name, email, password_hash, created_at)
VALUES ($1, $2, $3, now())
RETURNING *;

-- name: GetUser :one
SELECT *
FROM users
WHERE id = $1;

-- name: GetUserByEmail :one
SELECT *
FROM users
WHERE email = $1;

-- name: GetUserByToken :one
SELECT users.*
FROM users
INNER JOIN tokens
ON users.id = tokens.user_id
WHERE tokens.hash = $1 AND tokens.expiry > $2;

-- name: UpdateUser :one
UPDATE users
SET name = $1, email = $2, password_hash = $3, version = version + 1
WHERE id = $4 AND version = $5
RETURNING *;
