import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { WatchedTvSeasonResponse } from '@/types/types.gen';

export const isTvSeasonOnWatched = (
  id: string,
  seasonNumber: string,
): Promise<WatchedTvSeasonResponse> => {
  if (!id || !seasonNumber) {
    return Promise.reject(new Error('Tv id and season number are required'));
  }
  const url = `/watched/tv/${id}/season/${seasonNumber}`;
  return apiClient.get(url, true) as Promise<WatchedTvSeasonResponse>;
};

export const isTvSeasonOnWatchedQueryOptions = ({
  id,
  seasonNumber,
}: {
  id: string;
  seasonNumber: string;
}) => {
  return queryOptions({
    queryKey: id ? ['on-watched', { id }, { seasonNumber }] : ['on-watched'],
    queryFn: () => isTvSeasonOnWatched(id, seasonNumber),
  });
};

type UseIsTvSeasonOnWatchedOptions = {
  id: string;
  seasonNumber: string;
  queryConfig?: QueryConfig<typeof isTvSeasonOnWatchedQueryOptions>;
};

export const useIsTvSeasonOnWatched = ({
  id,
  seasonNumber,
  queryConfig,
}: UseIsTvSeasonOnWatchedOptions) => {
  return useQuery({
    ...isTvSeasonOnWatchedQueryOptions({ id, seasonNumber }),
    ...queryConfig,
  });
};
