import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Message } from '@/types/types.gen';
import { isMovieOnWatchedQueryOptions } from './is-movie-on-watched';
import { getWatchedQueryOptions } from './get-watched';
import { getUserStatsQueryOptions } from '@/features/users/api/get-user-stats';

export const addTvSeasonToWatched = (
  id: string,
  seasonNumber: string,
): Promise<Message> => {
  if (!id || !seasonNumber) {
    return Promise.reject(
      new Error('TV season id and season number are required'),
    );
  }
  const url = `/watched/tv/${id}/season/${seasonNumber}`;
  return apiClient.post(url, null, true) as Promise<Message>;
};

type UseAddTvSeasonToWatchedOptions = {
  id: string;
  seasonNumber: string;
  mutationConfig?: MutationConfig<typeof addTvSeasonToWatched>;
};

export const useAddTvSeasonToWatched = ({
  id,
  seasonNumber,
  mutationConfig,
}: UseAddTvSeasonToWatchedOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: () => addTvSeasonToWatched(id, seasonNumber),
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
