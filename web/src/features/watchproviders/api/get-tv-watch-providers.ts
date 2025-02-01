import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { WatchProvidersResponse } from '@/types/types.gen';

export const getTvWatchProviders = (
  id: string,
): Promise<WatchProvidersResponse> => {
  if (!id) {
    return Promise.reject(new Error('Tv id is required'));
  }
  const url = `/watchproviders/tv/${id}`;
  return apiClient.get(url, true) as Promise<WatchProvidersResponse>;
};

export const getTvWatchProvidersQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: id ? ['watch-providers-tv', { id }] : ['watch-providers'],
    queryFn: () => getTvWatchProviders(id),
  });
};

type UseGetTvWatchProvidersdOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getTvWatchProvidersQueryOptions>;
};

export const useGetTvWatchProviders = ({
  id,
  queryConfig,
}: UseGetTvWatchProvidersdOptions) => {
  return useQuery({
    ...getTvWatchProvidersQueryOptions({ id }),
    ...queryConfig,
  });
};
