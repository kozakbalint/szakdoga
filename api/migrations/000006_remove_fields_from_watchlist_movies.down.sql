ALTER TABLE watchlist_movies
ADD COLUMN IF NOT EXISTS updated_at timestamp(0)
with
    time zone NOT NULL DEFAULT now (),
ADD COLUMN IF NOT EXISTS watched boolean NOT NULL DEFAULT false;
