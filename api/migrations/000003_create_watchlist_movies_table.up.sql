CREATE TABLE IF NOT EXISTS watchlist_movies (
    id bigserial PRIMARY KEY,
    tmdb_id integer NOT NULL,
    user_id integer NOT NULL,
    added_at timestamp(0)
    with
        time zone NOT NULL DEFAULT NOW (),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE (tmdb_id, user_id)
);
