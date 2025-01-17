create table if not exists watched_tv_seasons
(
	id bigserial
		primary key,
	user_id integer not null,
	tmdb_id integer not null,
	season_number integer not null,
	total_episodes integer not null,
	created_at timestamp(0) with time zone default now() not null,
	updated_at timestamp(0) with time zone default now() not null,
	status text default 'not started'::text not null,
	unique (user_id, tmdb_id, season_number),
	foreign key (user_id, tmdb_id) references watched_tv_shows (user_id, tmdb_id)
		on delete cascade
);
