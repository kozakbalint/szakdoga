create table if not exists watched_tv_episodes (
    id bigserial primary key,
    user_id integer not null,
    tmdb_id integer not null,
    season_number integer not null,
    episode_number integer not null,
    watched_at timestamp(0)
    with
        time zone,
        created_at timestamp(0)
    with
        time zone default now () not null,
        updated_at timestamp(0)
    with
        time zone default now () not null,
        constraint watched_tv_episodes_user_id_tmdb_id_season_number_episode_n_key unique (user_id, tmdb_id, season_number, episode_number),
        foreign key (user_id, tmdb_id, season_number) references watched_tv_seasons (user_id, tmdb_id, season_number) on delete cascade
);
