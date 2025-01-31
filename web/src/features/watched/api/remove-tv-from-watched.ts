import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { isMovieOnWatchedQueryOptions } from './is-movie-on-watched';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getWatchedQueryOptions } from './get-watched';
import { Message } from '@/types/types.gen';
import { getUserStatsQueryOptions } from '@/features/users/api/get-user-stats';

export const removeTvFromWatched = (id: string): Promise<Message> => {
  if (!id) {
    return Promise.reject(new Error('Tv id is required'));
  }
  const url = `/watched/tv/${id}`;
  return apiClient.delete(url, true) as Promise<Message>;
};

type UseRemoveTvFromWatchedOptions = {
  id: string;
  mutationConfig?: MutationConfig<typeof removeTvFromWatched>;
};

export const useRemoveTvFromWatched = ({
  id,
  mutationConfig,
}: UseRemoveTvFromWatchedOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: removeTvFromWatched,
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
