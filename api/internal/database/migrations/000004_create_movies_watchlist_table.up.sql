CREATE TABLE IF NOT EXISTS movies_watchlist (
    id bigserial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    movie_id integer NOT NULL REFERENCES movies (id) ON DELETE CASCADE,
    added_at timestamp(0) with time zone NOT NULL DEFAULT now(),
    updated_at timestamp(0) with time zone NOT NULL DEFAULT now(),
    watched boolean NOT NULL DEFAULT false,
    UNIQUE (user_id, movie_id)
);
