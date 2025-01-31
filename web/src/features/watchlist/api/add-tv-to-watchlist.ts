import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Message } from '@/types/types.gen';
import { isTvOnWatchlistQueryOptions } from './is-tv-on-watchlist';
import { getWatchlistQueryOptions } from './get-watchlist';
import { getUserStatsQueryOptions } from '@/features/users/api/get-user-stats';

export const addTvToWatchlist = (id: string): Promise<Message> => {
  const url = `/watchlist/tv/${id}`;
  return apiClient.post(url, null, true) as Promise<Message>;
};

type UseAddTvToWatchlistOptions = {
  id: string;
  mutationConfig?: MutationConfig<typeof addTvToWatchlist>;
};

export const useAddTvToWatchlist = ({
  id,
  mutationConfig,
}: UseAddTvToWatchlistOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: addTvToWatchlist,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: isTvOnWatchlistQueryOptions({ id }).queryKey,
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
