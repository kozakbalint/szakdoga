import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { GetMovieWatchedResponse } from '@/types/api';

export const getMoviesWatched = (): Promise<GetMovieWatchedResponse> => {
  const url = `/watched/movies`;
  return apiClient.get(url, true) as Promise<GetMovieWatchedResponse>;
};

export const getMoviesWatchedQueryOptions = () => {
  return queryOptions({
    queryKey: ['movies-watched'],
    queryFn: () => getMoviesWatched(),
  });
};

type UseGetMoviesWatchedOptions = {
  queryConfig?: QueryConfig<typeof getMoviesWatchedQueryOptions>;
};

export const useGetMoviesWatched = ({
  queryConfig,
}: UseGetMoviesWatchedOptions) => {
  return useQuery({ ...getMoviesWatchedQueryOptions(), ...queryConfig });
};
