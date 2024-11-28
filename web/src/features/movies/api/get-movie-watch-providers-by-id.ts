import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { GetWatchProvidersResponse } from '@/types/api';

export const getMovieWatchProvidersById = (
  id: string,
): Promise<GetWatchProvidersResponse> => {
  if (!id) {
    return Promise.resolve({ providers: null });
  }
  const url = `/watch/movies/${id}`;
  return apiClient.getWithToken(url) as Promise<GetWatchProvidersResponse>;
};

export const getMovieWatchProvidersByIdQueryOptions = ({
  id,
}: {
  id: string;
}) => {
  return queryOptions({
    queryKey: id ? ['watch-providers-movies', { id }] : ['watch-providers'],
    queryFn: () => getMovieWatchProvidersById(id),
  });
};

type UseGetMovieWatchProvidersByIdOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getMovieWatchProvidersByIdQueryOptions>;
};

export const useGetMovieWatchProvidersById = ({
  id,
  queryConfig,
}: UseGetMovieWatchProvidersByIdOptions) => {
  return useQuery({
    ...getMovieWatchProvidersByIdQueryOptions({ id }),
    ...queryConfig,
  });
};
