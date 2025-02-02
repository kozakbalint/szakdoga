import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { TvSeasonDetailsResponse } from '@/types/types.gen';

export const getTvSeasonDetails = (
  id: string,
  seasonId: string,
): Promise<TvSeasonDetailsResponse> => {
  if (!id || !seasonId) {
    return Promise.reject(new Error('Tv id and season id are required'));
  }
  const url = `/tv/${id}/seasons/${seasonId} `;
  return apiClient.get(url, true) as Promise<TvSeasonDetailsResponse>;
};

export const getTvSeasonDetailsQueryOptions = ({
  id,
  seasonId,
}: {
  id: string;
  seasonId: string;
}) => {
  return queryOptions({
    queryKey: id && seasonId ? ['tv-season', { id, seasonId }] : ['tv-season'],
    queryFn: () => getTvSeasonDetails(id, seasonId),
  });
};

type UseGetTvSeasonDetailsOptions = {
  id: string;
  seasonId: string;
  queryConfig?: QueryConfig<typeof getTvSeasonDetailsQueryOptions>;
};

export const useGetTvSeasonDetails = ({
  id,
  seasonId,
  queryConfig,
}: UseGetTvSeasonDetailsOptions) => {
  return useQuery({
    ...getTvSeasonDetailsQueryOptions({ id, seasonId }),
    ...queryConfig,
  });
};
