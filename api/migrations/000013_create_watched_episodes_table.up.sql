CREATE TABLE IF NOT EXISTS watched_episodes (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    episode_id INTEGER NOT NULL,
    watched_at TIMESTAMP(0)
    WITH
        TIME ZONE NOT NULL DEFAULT NOW (),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (episode_id) REFERENCES tv_shows_episodes (id) ON DELETE CASCADE
);
