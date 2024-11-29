import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { GetTvResponse } from '@/types/api';

export const getTvById = (id: string): Promise<GetTvResponse> => {
  if (!id) {
    return Promise.resolve({ tv: null });
  }
  const url = `/tv/${id}`;
  return apiClient.get(url, true) as Promise<GetTvResponse>;
};

export const getTvByIdQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: id ? ['tv', { id }] : ['tv'],
    queryFn: () => getTvById(id),
  });
};

type UseGetTvByIdOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getTvByIdQueryOptions>;
};

export const useGetTvById = ({ id, queryConfig }: UseGetTvByIdOptions) => {
  return useQuery({ ...getTvByIdQueryOptions({ id }), ...queryConfig });
};
