CREATE TABLE IF NOT EXISTS tv_shows_seasons (
    id bigserial PRIMARY KEY,
    tv_show_id bigint NOT NULL,
    season_number integer NOT NULL,
    episode_count integer NOT NULL,
    air_date date NOT NULL,
    created_at timestamp(0)
    with
        time zone NOT NULL DEFAULT NOW (),
        last_fetched_at timestamp(0)
    with
        time zone NOT NULL DEFAULT NOW (),
        FOREIGN KEY (tv_show_id) REFERENCES tv_shows (id) ON DELETE CASCADE
);
