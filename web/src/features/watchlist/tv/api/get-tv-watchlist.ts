import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { GetTVWatchlistResponse } from '@/types/api';

export const getTVWatchlist = (): Promise<GetTVWatchlistResponse> => {
  const url = `/watchlist/tv`;
  return apiClient.get(url, true) as Promise<GetTVWatchlistResponse>;
};

export const getTVWatchlistQueryOptions = () => {
  return queryOptions({
    queryKey: ['TV-watchlist'],
    queryFn: () => getTVWatchlist(),
  });
};

type UseGetTVWatchlistOptions = {
  queryConfig?: QueryConfig<typeof getTVWatchlistQueryOptions>;
};

export const useGetTVWatchlist = ({
  queryConfig,
}: UseGetTVWatchlistOptions) => {
  return useQuery({ ...getTVWatchlistQueryOptions(), ...queryConfig });
};
