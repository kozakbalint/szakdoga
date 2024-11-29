import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { GetTvSeasonResponse } from '@/types/api';

export const getTvSeasonById = (
  id: string,
  seasonId: string,
): Promise<GetTvSeasonResponse> => {
  if (!id || !seasonId) {
    return Promise.resolve({ season: null });
  }
  const url = `/tv/${id}/seasons/${seasonId}/episodes `;
  return apiClient.get(url, true) as Promise<GetTvSeasonResponse>;
};

export const getTvSeasonByIdQueryOptions = ({
  id,
  seasonId,
}: {
  id: string;
  seasonId: string;
}) => {
  return queryOptions({
    queryKey: id && seasonId ? ['tv-season', { id, seasonId }] : ['tv-season'],
    queryFn: () => getTvSeasonById(id, seasonId),
  });
};

type UseGetTvSeasonByIdOptions = {
  id: string;
  seasonId: string;
  queryConfig?: QueryConfig<typeof getTvSeasonByIdQueryOptions>;
};

export const useGetTvSeasonById = ({
  id,
  seasonId,
  queryConfig,
}: UseGetTvSeasonByIdOptions) => {
  return useQuery({
    ...getTvSeasonByIdQueryOptions({ id, seasonId }),
    ...queryConfig,
  });
};
