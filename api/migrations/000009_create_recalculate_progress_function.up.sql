create or replace function recalculate_tv_show_progress() returns trigger
	language plpgsql
as $$
    declare
        total_eps integer;
        watched_eps integer;
        show_status text;
        season_status text;
    begin
        if tg_op = 'INSERT' then
            select total_episodes
            into total_eps
            from watched_tv_shows
            where watched_tv_shows.tmdb_id = new.tmdb_id;

            select coalesce(count(*), 0)
            into watched_eps
            from watched_tv_episodes
            where watched_tv_episodes.tmdb_id = new.tmdb_id and watched_at is not null;

            update watched_tv_shows
            set progress = case when total_eps = 0 then 0 else (watched_eps::float / total_eps::float) * 100 end
            where tmdb_id = new.tmdb_id;

            if watched_eps = total_eps then
                show_status = 'watched';
            elseif watched_eps = 0 then
                show_status = 'not started';
            else
                show_status = 'in progress';
            end if;

            update watched_tv_shows
            set status = show_status
            where tmdb_id = new.tmdb_id;

            select coalesce(count(*), 0) into watched_eps
            from watched_tv_episodes
            where watched_tv_episodes.tmdb_id = new.tmdb_id and season_number = new.season_number and watched_at is not null;

            if watched_eps = 0 then
                season_status = 'not started';
            elseif watched_eps = (select watched_tv_seasons.total_episodes from watched_tv_seasons where tmdb_id = new.tmdb_id and season_number = new.season_number) then
                season_status = 'watched';
            else
                season_status = 'in progress';
            end if;

            update watched_tv_seasons
            set status = season_status
            where tmdb_id = new.tmdb_id and season_number = new.season_number;
        elseif tg_op = 'DELETE' then
            select total_episodes
            into total_eps
            from watched_tv_shows
            where watched_tv_shows.tmdb_id = old.tmdb_id;

            select coalesce(count(*), 0)
            into watched_eps
            from watched_tv_episodes
            where watched_tv_episodes.tmdb_id = old.tmdb_id and watched_at is not null;

            update watched_tv_shows
            set progress = case when total_eps = 0 then 0 else (watched_eps::float / total_eps::float) * 100 end
            where tmdb_id = old.tmdb_id;

            if watched_eps = total_eps then
                show_status = 'watched';
            elseif watched_eps = 0 then
                show_status = 'not started';
            else
                show_status = 'in progress';
            end if;

            update watched_tv_shows
            set status = show_status
            where tmdb_id = old.tmdb_id;

            select coalesce(count(*), 0) into watched_eps
            from watched_tv_episodes
            where watched_tv_episodes.tmdb_id = old.tmdb_id and season_number = old.season_number and watched_at is not null;

            if watched_eps = 0 then
                season_status = 'not started';
            elseif watched_eps = (select watched_tv_seasons.total_episodes from watched_tv_seasons where tmdb_id = old.tmdb_id and season_number = old.season_number) then
                season_status = 'watched';
            else
                season_status = 'in progress';
            end if;

            update watched_tv_seasons
            set status = season_status
            where tmdb_id = old.tmdb_id and season_number = old.season_number;
        end if;
        return new;
    end;
$$;
