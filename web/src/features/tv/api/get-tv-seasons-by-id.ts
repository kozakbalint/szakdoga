import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { GetTvSeasonsResponse } from '@/types/api';

export const getTvSeasonsById = (id: string): Promise<GetTvSeasonsResponse> => {
  if (!id) {
    return Promise.resolve({ seasons: null });
  }
  const url = `/tv/${id}/seasons`;
  return apiClient.get(url) as Promise<GetTvSeasonsResponse>;
};

export const getTvSeasonsByIdQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: id ? ['tv-seasons', { id }] : ['tv-seasons'],
    queryFn: () => getTvSeasonsById(id),
  });
};

type UseGetTvSeasonsByIdOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getTvSeasonsByIdQueryOptions>;
};

export const useGetTvSeasonsById = ({
  id,
  queryConfig,
}: UseGetTvSeasonsByIdOptions) => {
  return useQuery({ ...getTvSeasonsByIdQueryOptions({ id }), ...queryConfig });
};
