ALTER TABLE watchlist_movies
DROP COLUMN IF EXISTS updated_at,
DROP COLUMN IF EXISTS watched;
