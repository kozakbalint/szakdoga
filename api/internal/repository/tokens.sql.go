// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: tokens.sql

package repository

import (
	"context"
	"time"
)

const deleteAllTokens = `-- name: DeleteAllTokens :one
DELETE FROM tokens
WHERE user_id = $1
RETURNING hash, user_id, expiry
`

func (q *Queries) DeleteAllTokens(ctx context.Context, userID int64) (Token, error) {
	row := q.db.QueryRow(ctx, deleteAllTokens, userID)
	var i Token
	err := row.Scan(&i.Hash, &i.UserID, &i.Expiry)
	return i, err
}

const insertToken = `-- name: InsertToken :one
INSERT INTO tokens (hash, user_id, expiry)
VALUES ($1, $2, $3)
RETURNING hash, user_id, expiry
`

type InsertTokenParams struct {
	Hash   []byte    `json:"hash"`
	UserID int64     `json:"user_id"`
	Expiry time.Time `json:"expiry"`
}

func (q *Queries) InsertToken(ctx context.Context, arg InsertTokenParams) (Token, error) {
	row := q.db.QueryRow(ctx, insertToken, arg.Hash, arg.UserID, arg.Expiry)
	var i Token
	err := row.Scan(&i.Hash, &i.UserID, &i.Expiry)
	return i, err
}
