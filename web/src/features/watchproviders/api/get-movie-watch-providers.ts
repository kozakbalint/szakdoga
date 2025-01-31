import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { WatchProvidersResponse } from '@/types/types.gen';

export const getMovieWatchProviders = (
  id: string,
): Promise<WatchProvidersResponse> => {
  if (!id) {
    return Promise.reject(new Error('Movie id is required'));
  }
  const url = `/watchproviders/movies/${id}`;
  return apiClient.get(url, true) as Promise<WatchProvidersResponse>;
};

export const getMovieWatchProvidersQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: id ? ['watch-providers-movies', { id }] : ['watch-providers'],
    queryFn: () => getMovieWatchProviders(id),
  });
};

type UseGetMovieWatchProvidersOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getMovieWatchProvidersQueryOptions>;
};

export const useGetMovieWatchProviders = ({
  id,
  queryConfig,
}: UseGetMovieWatchProvidersOptions) => {
  return useSuspenseQuery({
    ...getMovieWatchProvidersQueryOptions({ id }),
    ...queryConfig,
  });
};
