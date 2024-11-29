import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { GetMovieWatchlistResponse } from '@/types/api';

export const getMoviesWatchlist = (): Promise<GetMovieWatchlistResponse> => {
  const url = `/watchlist/movies`;
  return apiClient.get(url, true) as Promise<GetMovieWatchlistResponse>;
};

export const getMoviesWatchlistQueryOptions = () => {
  return queryOptions({
    queryKey: ['movies-watchlist'],
    queryFn: () => getMoviesWatchlist(),
  });
};

type UseGetMoviesWatchlistOptions = {
  queryConfig?: QueryConfig<typeof getMoviesWatchlistQueryOptions>;
};

export const useGetMoviesWatchlist = ({
  queryConfig,
}: UseGetMoviesWatchlistOptions) => {
  return useQuery({ ...getMoviesWatchlistQueryOptions(), ...queryConfig });
};
