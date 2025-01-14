import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isTvOnWatchlistQueryOptions } from './is-tv-on-watchlist';
import { getWatchlistQueryOptions } from './get-watchlist';

export const removeTvFromWatchlist = (id: string) => {
  if (!id) {
    return Promise.reject(new Error('TV id is required'));
  }
  const url = `/watchlist/tv/${id}`;
  return apiClient.delete(url, true);
};

type UseRemoveTvFromWatchlistOptions = {
  id: string;
  mutationConfig?: MutationConfig<typeof removeTvFromWatchlist>;
};

export const useRemoveTvFromWatchlist = ({
  id,
  mutationConfig,
}: UseRemoveTvFromWatchlistOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: removeTvFromWatchlist,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: isTvOnWatchlistQueryOptions({ id }).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getWatchlistQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
  });
};
