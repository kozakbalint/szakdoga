import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { WatchlistResponse } from '@/types/types.gen';

export const getWatchlist = (): Promise<WatchlistResponse> => {
  const url = `/watchlist`;
  return apiClient.get(url, true) as Promise<WatchlistResponse>;
};

export const getWatchlistQueryOptions = () => {
  return queryOptions({
    queryKey: ['watchlist'],
    queryFn: () => getWatchlist(),
  });
};

type UseGetWatchlistOptions = {
  queryConfig?: QueryConfig<typeof getWatchlistQueryOptions>;
};

export const useGetWatchlist = ({ queryConfig }: UseGetWatchlistOptions) => {
  return useQuery({ ...getWatchlistQueryOptions(), ...queryConfig });
};
