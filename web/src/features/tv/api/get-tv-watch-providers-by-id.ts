import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { GetWatchProvidersResponse } from '@/types/api';

export const getTvWatchProvidersById = (
  id: string,
): Promise<GetWatchProvidersResponse> => {
  if (!id) {
    return Promise.resolve({ providers: null });
  }
  const url = `/watch/tv/${id}`;
  return apiClient.getWithToken(url) as Promise<GetWatchProvidersResponse>;
};

export const getTvWatchProvidersByIdQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: id ? ['watch-providers-tv', { id }] : ['watch-providers'],
    queryFn: () => getTvWatchProvidersById(id),
  });
};

type UseGetTvWatchProvidersByIdOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getTvWatchProvidersByIdQueryOptions>;
};

export const useGetTvWatchProvidersById = ({
  id,
  queryConfig,
}: UseGetTvWatchProvidersByIdOptions) => {
  return useQuery({
    ...getTvWatchProvidersByIdQueryOptions({ id }),
    ...queryConfig,
  });
};
