package data

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/kozakbalint/szakdoga/api/internal/repository"
	"github.com/kozakbalint/szakdoga/api/internal/types"
)

type WatchedModel struct {
	Repository *repository.Queries
}

type Watched struct {
	Movies []*int32
	Tv     []*int32
}

func (m WatchedModel) GetWatched(userID int32) (*Watched, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	movieEntries, err := m.Repository.ListWatchedMovies(ctx, int32(userID))
	if err != nil {
		return nil, WrapError(err)
	}

	tvShowEntries, err := m.Repository.ListWatchedTv(ctx, int32(userID))
	if err != nil {
		return nil, WrapError(err)
	}

	var watched Watched
	for _, entry := range movieEntries {
		watched.Movies = append(watched.Movies, &entry.TmdbID)
	}

	for _, entry := range tvShowEntries {
		watched.Tv = append(watched.Tv, &entry.TmdbID)
	}

	return &watched, nil
}

func (m WatchedModel) IsMovieOnWatched(tmdbId, userId int32) (bool, error) {
	args := repository.GetWatchedMovieParams{
		TmdbID: int32(tmdbId),
		UserID: userId,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.GetWatchedMovie(ctx, args)
	if err != nil {
		return false, nil
	}

	return true, nil
}

func (m WatchedModel) AddMovieToWatched(tmdbId, userId int32) error {
	args := repository.InsertWatchedMovieParams{
		TmdbID: tmdbId,
		UserID: userId,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.InsertWatchedMovie(ctx, args)
	if err != nil {
		return WrapError(err)
	}

	return nil
}

func (m WatchedModel) RemoveMovieFromWatched(tmdbId, userId int32) error {
	args := repository.DeleteWatchedMovieParams{
		TmdbID: tmdbId,
		UserID: userId,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.DeleteWatchedMovie(ctx, args)
	if err != nil {
		return WrapError(err)
	}

	return nil
}

func (m WatchedModel) IsTvOnWatched(tmdbId, userId int32) (types.WatchedTv, error) {
	args := repository.GetWatchedTvParams{
		TmdbID: int32(tmdbId),
		UserID: userId,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	tv, err := m.Repository.GetWatchedTv(ctx, args)
	if err != nil {
		return types.WatchedTv{}, WrapError(err)
	}

	watchedTv := types.WatchedTv{
		Id:       int64(tv.TmdbID),
		Progress: tv.Progress,
		Status:   types.WatchedTvStatus(tv.Status),
	}

	var nextEpisode *types.NextEpisode
	nextEpisodeIndexes, err := m.Repository.GetNextEpisode(ctx, repository.GetNextEpisodeParams{
		UserID: userId,
		TmdbID: tmdbId,
	})
	if err != nil {
		watchedTv.NextEpisode = types.NextEpisode{}
		return watchedTv, nil
	}

	nextEpisode = &types.NextEpisode{
		SeasonNumber:  int(nextEpisodeIndexes.SeasonNumber),
		EpisodeNumber: int(nextEpisodeIndexes.EpisodeNumber),
	}

	watchedTv.NextEpisode = *nextEpisode

	return watchedTv, nil
}

func (m WatchedModel) AddTvToWatched(tmdbId, userId, totalSeasons, totalEpisodes int32) error {
	args := repository.InsertWatchedTvParams{
		TmdbID:        tmdbId,
		UserID:        userId,
		TotalSeasons:  totalSeasons,
		TotalEpisodes: totalEpisodes,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.InsertWatchedTv(ctx, args)
	if err != nil {
		return WrapError(err)
	}

	return nil
}

func (m WatchedModel) RemoveTvFromWatched(tmdbId, userId int32) error {
	args := repository.DeleteWatchedTvParams{
		TmdbID: tmdbId,
		UserID: userId,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.DeleteWatchedTv(ctx, args)
	if err != nil {
		return WrapError(err)
	}

	return nil
}

func (m WatchedModel) IsTvSeasonOnWatched(tmdbId, userId, seasonNumber int32) (types.WatchedTvSeason, error) {
	args := repository.GetWatchedTvSeasonParams{
		TmdbID:       tmdbId,
		UserID:       userId,
		SeasonNumber: seasonNumber,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	season, err := m.Repository.GetWatchedTvSeason(ctx, args)
	if err != nil {
		return types.WatchedTvSeason{}, WrapError(err)
	}
	episodes, err := m.Repository.ListWatchedTvEpisodes(ctx, repository.ListWatchedTvEpisodesParams{
		TmdbID:       tmdbId,
		UserID:       userId,
		SeasonNumber: seasonNumber,
	})
	if err != nil {
		return types.WatchedTvSeason{}, WrapError(err)
	}

	resp := types.WatchedTvSeason{
		SeasonNumber: int(seasonNumber),
		Status:       types.WatchedTvSeasonStatus(season.Status),
	}

	for _, episode := range episodes {
		resp.Episodes = append(resp.Episodes, int(episode.EpisodeNumber))
	}

	return resp, nil
}

func (m WatchedModel) AddTvSeasonToWatched(tmdbId, userId, seasonNumber, totalEpisodes int32) error {
	args := repository.InsertWatchedTvSeasonParams{
		TmdbID:        tmdbId,
		UserID:        userId,
		SeasonNumber:  seasonNumber,
		TotalEpisodes: totalEpisodes,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.InsertWatchedTvSeason(ctx, args)
	if err != nil {
		return WrapError(err)
	}

	return nil
}

func (m WatchedModel) RemoveTvSeasonFromWatched(tmdbId, userId, seasonNumber int32) error {
	args := repository.DeleteWatchedTvSeasonParams{
		TmdbID:       tmdbId,
		UserID:       userId,
		SeasonNumber: seasonNumber,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.DeleteWatchedTvSeason(ctx, args)
	if err != nil {
		return WrapError(err)
	}

	return nil
}

func (m WatchedModel) IsTvEpisodeOnWatched(tmdbId, userId, seasonNumber, episodeNumber int32) (bool, error) {
	args := repository.GetWatchedTvEpisodeParams{
		TmdbID:        tmdbId,
		UserID:        userId,
		SeasonNumber:  seasonNumber,
		EpisodeNumber: episodeNumber,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.GetWatchedTvEpisode(ctx, args)
	if err != nil {
		return false, nil
	}

	return true, nil
}

func (m WatchedModel) AddTvEpisodeToWatched(tmdbId, userId, seasonNumber, episodeNumber int32) error {
	args := repository.InsertWatchedTvEpisodeParams{
		TmdbID:        tmdbId,
		UserID:        userId,
		SeasonNumber:  seasonNumber,
		EpisodeNumber: episodeNumber,
		WatchedAt:     pgtype.Timestamptz{Time: time.Now(), Valid: true},
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.InsertWatchedTvEpisode(ctx, args)
	if err != nil {
		return WrapError(err)
	}

	return nil
}

func (m WatchedModel) RemoveTvEpisodeFromWatched(tmdbId, userId, seasonNumber, episodeNumber int32) error {
	args := repository.DeleteWatchedTvEpisodeParams{
		TmdbID:        tmdbId,
		UserID:        userId,
		SeasonNumber:  seasonNumber,
		EpisodeNumber: episodeNumber,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.Repository.DeleteWatchedTvEpisode(ctx, args)
	if err != nil {
		return WrapError(err)
	}

	return nil
}
