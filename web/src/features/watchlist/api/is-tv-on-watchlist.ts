import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { InWatchlist } from '@/types/types.gen';

export const isTvOnWatchlist = (id: string): Promise<InWatchlist> => {
  if (!id) {
    return Promise.reject(new Error('Tv id is required'));
  }
  const url = `/watchlist/tv/${id}`;
  return apiClient.get(url, true) as Promise<InWatchlist>;
};

export const isTvOnWatchlistQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: id ? ['on-watchlist', { id }] : ['on-watchlist'],
    queryFn: () => isTvOnWatchlist(id),
  });
};

type UseIsTvOnWatchlistOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof isTvOnWatchlistQueryOptions>;
};

export const useIsTvOnWatchlist = ({
  id,
  queryConfig,
}: UseIsTvOnWatchlistOptions) => {
  return useSuspenseQuery({
    ...isTvOnWatchlistQueryOptions({ id }),
    ...queryConfig,
  });
};
