import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { TvEpisodeDetailsResponse } from '@/types/types.gen';

export const getTvEpisodeDetails = (
  id: string,
  seasonId: string,
  episodeId: string,
): Promise<TvEpisodeDetailsResponse> => {
  if (!id || !seasonId || !episodeId) {
    return Promise.reject(
      new Error('Tv id, season id and episode id are required'),
    );
  }
  const url = `/tv/${id}/seasons/${seasonId}/episodes/${episodeId}`;
  return apiClient.get(url, true) as Promise<TvEpisodeDetailsResponse>;
};

export const getTvEpisodeDetailsQueryOptions = ({
  id,
  seasonId,
  episodeId,
}: {
  id: string;
  seasonId: string;
  episodeId: string;
}) => {
  return queryOptions({
    queryKey:
      id && seasonId
        ? ['tv-episode', { id, seasonId, episodeId }]
        : ['tv-episode'],
    queryFn: () => getTvEpisodeDetails(id, seasonId, episodeId),
  });
};

type UseGetTvEpisodeDetailsOptions = {
  id: string;
  seasonId: string;
  episodeId: string;
  queryConfig?: QueryConfig<typeof getTvEpisodeDetailsQueryOptions>;
};

export const useGetTvEpisodeDetails = ({
  id,
  seasonId,
  episodeId,
  queryConfig,
}: UseGetTvEpisodeDetailsOptions) => {
  return useQuery({
    ...getTvEpisodeDetailsQueryOptions({ id, seasonId, episodeId }),
    ...queryConfig,
  });
};
