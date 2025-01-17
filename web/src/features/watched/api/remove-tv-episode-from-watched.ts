import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { isMovieOnWatchedQueryOptions } from './is-movie-on-watched';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getWatchedQueryOptions } from './get-watched';

export const removeTvEpisodeFromWatched = (
  id: string,
  seasonNumber: string,
  episodeNumber: string,
) => {
  if (!id || !seasonNumber || !episodeNumber) {
    return Promise.reject(
      new Error('TV episode id, season number and episode number are required'),
    );
  }
  const url = `/watched/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}`;
  return apiClient.delete(url, true);
};

type UseRemoveTvSeasonFromWatchedOptions = {
  id: string;
  seasonNumber: string;
  episodeNumber: string;
  mutationConfig?: MutationConfig<typeof removeTvEpisodeFromWatched>;
};

export const useRemoveTvSeasonFromWatched = ({
  id,
  seasonNumber,
  episodeNumber,
  mutationConfig,
}: UseRemoveTvSeasonFromWatchedOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: () =>
      removeTvEpisodeFromWatched(id, seasonNumber, episodeNumber),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: isMovieOnWatchedQueryOptions({ id }).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getWatchedQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
  });
};
