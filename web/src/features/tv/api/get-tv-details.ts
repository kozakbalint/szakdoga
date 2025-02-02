import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { TvDetailsResponse } from '@/types/types.gen';

export const getTvDetails = (id: string): Promise<TvDetailsResponse> => {
  if (!id) {
    return Promise.reject(new Error('Tv id is required'));
  }
  const url = `/tv/${id}`;
  return apiClient.get(url, true) as Promise<TvDetailsResponse>;
};

export const getTvDetailsQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: id ? ['tv', { id }] : ['tv'],
    queryFn: () => getTvDetails(id),
  });
};

type UseGetTvDetailsOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getTvDetailsQueryOptions>;
};

export const useGetTvDetails = ({
  id,
  queryConfig,
}: UseGetTvDetailsOptions) => {
  return useSuspenseQuery({
    ...getTvDetailsQueryOptions({ id }),
    ...queryConfig,
  });
};
