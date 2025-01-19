create table if not exists watched_tv_shows
(
	id bigserial
		primary key,
	user_id integer not null,
	tmdb_id integer not null,
	status text default 'not started'::text not null,
	total_seasons integer not null,
	total_episodes integer not null,
	created_at timestamp(0) with time zone default now() not null,
	updated_at timestamp(0) with time zone default now() not null,
	progress float not null default 0,
	unique (user_id, tmdb_id)
);
