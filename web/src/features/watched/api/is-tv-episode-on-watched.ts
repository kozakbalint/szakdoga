import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { InWatched } from '@/types/types.gen';

export const isTvEpisodeOnWatched = (
  id: string,
  seasonNumber: string,
  episodeNumber: string,
): Promise<InWatched> => {
  if (!id || !seasonNumber || !episodeNumber) {
    return Promise.reject(
      new Error('Tv id, season number and episode number are required'),
    );
  }
  const url = `/watched/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}`;
  return apiClient.get(url, true) as Promise<InWatched>;
};

export const isTvEpisodeOnWatchedQueryOptions = ({
  id,
  seasonNumber,
  episodeNumber,
}: {
  id: string;
  seasonNumber: string;
  episodeNumber: string;
}) => {
  return queryOptions({
    queryKey: id
      ? ['on-watched', { id }, { seasonNumber }, { episodeNumber }]
      : ['on-watched'],
    queryFn: () => isTvEpisodeOnWatched(id, seasonNumber, episodeNumber),
  });
};

type UseIsTvEpisodeOnWatchedOptions = {
  id: string;
  seasonNumber: string;
  episodeNumber: string;
  queryConfig?: QueryConfig<typeof isTvEpisodeOnWatchedQueryOptions>;
};

export const useIsTvEpisodeOnWatched = ({
  id,
  seasonNumber,
  episodeNumber,
  queryConfig,
}: UseIsTvEpisodeOnWatchedOptions) => {
  return useQuery({
    ...isTvEpisodeOnWatchedQueryOptions({ id, seasonNumber, episodeNumber }),
    ...queryConfig,
  });
};
