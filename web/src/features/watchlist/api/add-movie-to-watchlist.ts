import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Message } from '@/types/types.gen';
import { isMovieOnWatchlistQueryOptions } from './is-movie-on-watchlist';
import { getWatchlistQueryOptions } from './get-watchlist';
import { getUserStatsQueryOptions } from '@/features/users/api/get-user-stats';

export const addMovieToWatchlist = (id: string): Promise<Message> => {
  const url = `/watchlist/movies/${id}`;
  return apiClient.post(url, null, true) as Promise<Message>;
};

type UseAddMovieToWatchlistOptions = {
  id: string;
  mutationConfig?: MutationConfig<typeof addMovieToWatchlist>;
};

export const useAddMovieToWatchlist = ({
  id,
  mutationConfig,
}: UseAddMovieToWatchlistOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: () => addMovieToWatchlist(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: isMovieOnWatchlistQueryOptions({ id }).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getWatchlistQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getUserStatsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
  });
};
