import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { isMovieOnWatchedQueryOptions } from './is-movie-on-watched';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getWatchedQueryOptions } from './get-watched';
import { Message } from '@/types/types.gen';
import { getUserStatsQueryOptions } from '@/features/users/api/get-user-stats';

export const removeTvSeasonFromWatched = (
  id: string,
  seasonNumber: string,
): Promise<Message> => {
  if (!id || !seasonNumber) {
    return Promise.reject(new Error('Tv id and season number are required'));
  }
  const url = `/watched/tv/${id}/season/${seasonNumber}`;
  return apiClient.delete(url, true) as Promise<Message>;
};

type UseRemoveTvSeasonFromWatchedOptions = {
  id: string;
  seasonNumber: string;
  mutationConfig?: MutationConfig<typeof removeTvSeasonFromWatched>;
};

export const useRemoveTvSeasonFromWatched = ({
  id,
  seasonNumber,
  mutationConfig,
}: UseRemoveTvSeasonFromWatchedOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: () => removeTvSeasonFromWatched(id, seasonNumber),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: isMovieOnWatchedQueryOptions({ id }).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getWatchedQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getUserStatsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
  });
};
