CREATE TABLE IF NOT EXISTS tv_shows (
    id bigserial PRIMARY KEY,
    tmdb_id integer NOT NULL UNIQUE,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    last_fetched_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    title text NOT NULL,
    release_date text NOT NULL,
    poster_url text NOT NULL,
    overview text NOT NULL,
    genres text[] NOT NULL,
    vote_average float NOT NULL,
    version integer NOT NULL DEFAULT 1
);
