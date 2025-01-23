-- name: GetWatchedTv :one
SELECT * FROM watched_tv_shows WHERE tmdb_id = $1 AND user_id = $2 AND status in ('watched', 'in progress');

-- name: GetWatchedTvSeason :one
SELECT * FROM watched_tv_seasons WHERE tmdb_id = $1 AND user_id = $2 AND season_number = $3 AND status in ('watched', 'in progress');

-- name: GetWatchedTvEpisode :one
SELECT * FROM watched_tv_episodes WHERE tmdb_id = $1 AND user_id = $2 AND season_number = $3 AND episode_number = $4 AND watched_at IS NOT NULL;

-- name: ListWatchedTv :many
SELECT * FROM watched_tv_shows WHERE user_id = $1 AND
status in ('watched', 'in progress');

-- name: ListWatchedTvSeasons :many
SELECT * FROM watched_tv_seasons WHERE tmdb_id = $1 AND user_id = $2 AND status in ('watched', 'in progress');

-- name: ListWatchedTvEpisodes :many
SELECT * FROM watched_tv_episodes WHERE tmdb_id = $1 AND user_id = $2 AND season_number = $3 AND watched_at IS NOT NULL;

-- name: InsertWatchedTv :one
INSERT INTO watched_tv_shows
(tmdb_id, user_id, total_seasons, total_episodes)
VALUES($1, $2, $3, $4) ON CONFLICT (tmdb_id, user_id) DO NOTHING
RETURNING *;

-- name: InsertWatchedTvSeason :one
INSERT INTO watched_tv_seasons
(tmdb_id, user_id, season_number, total_episodes)
VALUES($1, $2, $3, $4) ON CONFLICT (tmdb_id, user_id, season_number) DO NOTHING
RETURNING *;

-- name: InsertWatchedTvEpisode :one
INSERT INTO watched_tv_episodes
(tmdb_id, user_id, season_number, episode_number, watched_at)
VALUES($1, $2, $3, $4, $5) ON CONFLICT (tmdb_id, user_id, season_number, episode_number) DO NOTHING
RETURNING *;

-- name: DeleteWatchedTv :one
DELETE FROM watched_tv_shows WHERE tmdb_id = $1 AND user_id = $2
RETURNING *;

-- name: DeleteWatchedTvSeason :one
DELETE FROM watched_tv_seasons WHERE tmdb_id = $1 AND user_id = $2 AND season_number = $3
RETURNING *;

-- name: DeleteWatchedTvEpisode :one
DELETE FROM watched_tv_episodes WHERE tmdb_id = $1 AND user_id = $2 AND season_number = $3 AND episode_number = $4
RETURNING *;

-- name: DeleteAllWatchedTvSeasons :many
DELETE FROM watched_tv_seasons WHERE tmdb_id = $1 AND user_id = $2
RETURNING *;

-- name: DeleteAllWatchedTvEpisodes :many
DELETE FROM watched_tv_episodes WHERE tmdb_id = $1 AND user_id = $2
RETURNING *;

-- name: GetNextEpisode :one
with all_possible_episodes as (
  select
    wts.season_number,
    generate_series(1, wts.total_episodes) as episode_number
  from watched_tv_seasons wts
  where wts.user_id = $1 and wts.tmdb_id = $2
),
watched_episodes as (
  select
    wte.season_number,
    wte.episode_number
  from watched_tv_episodes wte
  where wte.user_id = $1 and wte.tmdb_id = $2
),
missing_episodes as (
  select
    ape.season_number,
    ape.episode_number
  from all_possible_episodes ape
  left join watched_episodes we on
    ape.season_number = we.season_number
    and ape.episode_number = we.episode_number
  where we.episode_number is null
),
next_season as (
  select
    ws.season_number,
    1 as episode_number
  from generate_series(1, (
    select total_seasons from watched_tv_shows wts
    where wts.user_id = $1 and wts.tmdb_id = $2
  )) as ws(season_number)
  where not exists (
    select 1
    from watched_tv_seasons wts
    where wts.user_id = $1 and wts.tmdb_id = $2
      and wts.season_number = ws.season_number
  )
),
next_episode as (
  select
    season_number,
    episode_number
  from missing_episodes
  union all
  select
    season_number,
    episode_number
  from next_season
)
select
  season_number,
  episode_number
from next_episode
order by season_number, episode_number
limit 1;
