import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { WatchedResponse } from '@/types/types.gen';

export const getWatched = (): Promise<WatchedResponse> => {
  const url = `/watched`;
  return apiClient.get(url, true) as Promise<WatchedResponse>;
};

export const getWatchedQueryOptions = () => {
  return queryOptions({
    queryKey: ['watched'],
    queryFn: () => getWatched(),
  });
};

type UseGetWatchedOptions = {
  queryConfig?: QueryConfig<typeof getWatchedQueryOptions>;
};

export const useGetWatched = ({ queryConfig }: UseGetWatchedOptions) => {
  return useSuspenseQuery({ ...getWatchedQueryOptions(), ...queryConfig });
};
