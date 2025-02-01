import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { CastMoviesResponse } from '@/types/types.gen';

export const getMovieCast = (id: string): Promise<CastMoviesResponse> => {
  if (!id) {
    return Promise.reject(new Error('Movie id is required'));
  }
  const url = `/cast/movies/${id}`;
  return apiClient.get(url, true) as Promise<CastMoviesResponse>;
};

export const getMovieCastQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: id ? ['cast-movies', { id }] : ['cast-movies'],
    queryFn: () => getMovieCast(id),
  });
};

type UseGetMovieCastOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getMovieCastQueryOptions>;
};

export const useGetMovieCast = ({
  id,
  queryConfig,
}: UseGetMovieCastOptions) => {
  return useQuery({
    ...getMovieCastQueryOptions({ id }),
    ...queryConfig,
  });
};
