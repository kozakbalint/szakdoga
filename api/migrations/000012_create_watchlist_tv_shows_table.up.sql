CREATE TABLE IF NOT EXISTS watchlist_tv_shows (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    tv_show_id INTEGER NOT NULL,
    added_at TIMESTAMP(0)
    WITH
        TIME ZONE NOT NULL DEFAULT NOW (),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (tv_show_id) REFERENCES tv_shows (id),
        UNIQUE (user_id, tv_show_id)
);
