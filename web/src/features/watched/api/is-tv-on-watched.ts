import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { WatchedTvResponse } from '@/types/types.gen';

export const isTvOnWatched = (id: string): Promise<WatchedTvResponse> => {
  if (!id) {
    return Promise.reject(new Error('Tv id is required'));
  }
  const url = `/watched/tv/${id}`;
  return apiClient.get(url, true) as Promise<WatchedTvResponse>;
};

export const isTvOnWatchedQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: id ? ['on-watched', { id }] : ['on-watched'],
    queryFn: () => isTvOnWatched(id),
  });
};

type UseIsTvOnWatchedOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof isTvOnWatchedQueryOptions>;
};

export const useIsTvOnWatched = ({
  id,
  queryConfig,
}: UseIsTvOnWatchedOptions) => {
  return useSuspenseQuery({
    ...isTvOnWatchedQueryOptions({ id }),
    ...queryConfig,
  });
};
