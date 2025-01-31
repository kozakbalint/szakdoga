drop trigger if exists trigger_clean_watched_tv_show_table_on_episode on watched_tv_episodes;

drop trigger if exists trigger_clean_watched_tv_show_table_on_season on watched_tv_seasons;

drop function if exists clean_watched_tv_show_table ();
