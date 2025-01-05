import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getTVWatchlistQueryOptions } from './get-tv-watchlist';

export const removeTVFromWatchlist = ({ id }: { id: number }) => {
  const url = `/watchlist/TV/${id}`;
  return apiClient.delete(url, true);
};

type UseRemoveTVFromWatchlistOptions = {
  mutationConfig?: MutationConfig<typeof removeTVFromWatchlist>;
};

export const useRemoveTVFromWatchlist = ({
  mutationConfig,
}: UseRemoveTVFromWatchlistOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: removeTVFromWatchlist,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getTVWatchlistQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
  });
};
