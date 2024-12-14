CREATE TABLE IF NOT EXISTS watched_movies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    watched_at timestamp(0)
    with
        time zone NOT NULL DEFAULT now (),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE
);
