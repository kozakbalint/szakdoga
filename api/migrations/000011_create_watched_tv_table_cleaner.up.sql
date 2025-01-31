create or replace function clean_watched_tv_show_table() returns trigger
	language plpgsql
as $$
BEGIN
    DELETE FROM watched_tv_shows
    WHERE status = 'not started';
    RETURN new;
END;
$$;

create trigger trigger_clean_watched_tv_show_table_on_episode after delete on watched_tv_episodes execute procedure clean_watched_tv_show_table ();

create trigger trigger_clean_watched_tv_show_table_on_season after delete on watched_tv_seasons execute procedure recalculate_tv_show_progress ();
