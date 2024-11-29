CREATE TABLE IF NOT EXISTS movies (
    id bigserial PRIMARY KEY,
    tmdb_id integer NOT NULL UNIQUE,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    last_fetched_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    title text NOT NULL,
    release_date date NOT NULL,
    poster_url text NOT NULL,
    overview text NOT NULL,
    genres text[] NOT NULL,
    vote_average numeric(3, 1) NOT NULL,
    runtime integer NOT NULL,
    version integer NOT NULL DEFAULT 1
);
