create trigger trigger_recalculate_tv_show_progress_on_episode after insert
or delete on watched_tv_episodes for each row execute procedure recalculate_tv_show_progress ();

create trigger trigger_recalculate_tv_show_progress_on_season after insert
or delete on watched_tv_seasons for each row execute procedure recalculate_tv_show_progress ();
