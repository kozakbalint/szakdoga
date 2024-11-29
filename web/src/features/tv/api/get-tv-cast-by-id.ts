import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { GetTvCastResponse } from '@/types/api';

export const getTvCastById = (id: string): Promise<GetTvCastResponse> => {
  if (!id) {
    return Promise.resolve({ cast: null });
  }
  const url = `/cast/tv/${id}`;
  return apiClient.get(url, true) as Promise<GetTvCastResponse>;
};

export const getTvCastByIdQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: id ? ['cast-tv', { id }] : ['cast-tv'],
    queryFn: () => getTvCastById(id),
  });
};

type UseGetTvCastByIdOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getTvCastByIdQueryOptions>;
};

export const useGetTvCastById = ({
  id,
  queryConfig,
}: UseGetTvCastByIdOptions) => {
  return useQuery({ ...getTvCastByIdQueryOptions({ id }), ...queryConfig });
};
