import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { GetTvShowWatchedResponse } from '@/types/api';

export const getTvShowWatched = (): Promise<GetTvShowWatchedResponse> => {
  const url = `/watched/tv`;
  return apiClient.get(url, true) as Promise<GetTvShowWatchedResponse>;
};

export const getTvShowWatchedQueryOptions = () => {
  return queryOptions({
    queryKey: ['tv-watched'],
    queryFn: () => getTvShowWatched(),
  });
};

type UseGetTvShowWatchedOptions = {
  queryConfig?: QueryConfig<typeof getTvShowWatchedQueryOptions>;
};

export const useGetTvShowWatched = ({
  queryConfig,
}: UseGetTvShowWatchedOptions) => {
  return useQuery({ ...getTvShowWatchedQueryOptions(), ...queryConfig });
};
