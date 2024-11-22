import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { GetMovieCastResponse } from '@/types/api';

export const getMovieCastById = (id: string): Promise<GetMovieCastResponse> => {
  if (!id) {
    return Promise.resolve({ cast: null });
  }
  const url = `/cast/movies/${id}`;
  return apiClient.getWithToken(url) as Promise<GetMovieCastResponse>;
};

export const getMovieCastByIdQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: id ? ['cast-movies', { id }] : ['cast-movies'],
    queryFn: () => getMovieCastById(id),
  });
};

type UseGetMovieCastByIdOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getMovieCastByIdQueryOptions>;
};

export const useGetMovieCastById = ({
  id,
  queryConfig,
}: UseGetMovieCastByIdOptions) => {
  return useQuery({ ...getMovieCastByIdQueryOptions({ id }), ...queryConfig });
};
