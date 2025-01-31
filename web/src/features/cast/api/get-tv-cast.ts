import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { CastTvResponse } from '@/types/types.gen';

export const getTvCast = (id: string): Promise<CastTvResponse> => {
  if (!id) {
    return Promise.reject(new Error('Tv id is required'));
  }
  const url = `/cast/tv/${id}`;
  return apiClient.get(url, true) as Promise<CastTvResponse>;
};

export const getTvCastQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: id ? ['cast-tv', { id }] : ['cast-tv'],
    queryFn: () => getTvCast(id),
  });
};

type UseGetTvCastOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getTvCastQueryOptions>;
};

export const useGetTvCast = ({ id, queryConfig }: UseGetTvCastOptions) => {
  return useSuspenseQuery({ ...getTvCastQueryOptions({ id }), ...queryConfig });
};
