import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { GetTvEpisodeResponse } from '@/types/api';

export const getTvEpisodeById = (
  id: string,
  seasonId: string,
  episodeId: string,
): Promise<GetTvEpisodeResponse> => {
  if (!id || !seasonId || !episodeId) {
    return Promise.resolve({ episode: null });
  }
  const url = `/tv/${id}/seasons/${seasonId}/episodes/${episodeId}`;
  return apiClient.getWithToken(url) as Promise<GetTvEpisodeResponse>;
};

export const getTvEpisodeByIdQueryOptions = ({
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
    queryFn: () => getTvEpisodeById(id, seasonId, episodeId),
  });
};

type UseGetTvEpisodeByIdOptions = {
  id: string;
  seasonId: string;
  episodeId: string;
  queryConfig?: QueryConfig<typeof getTvEpisodeByIdQueryOptions>;
};

export const useGetTvEpisodeById = ({
  id,
  seasonId,
  episodeId,
  queryConfig,
}: UseGetTvEpisodeByIdOptions) => {
  return useQuery({
    ...getTvEpisodeByIdQueryOptions({ id, seasonId, episodeId }),
    ...queryConfig,
  });
};
