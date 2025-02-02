import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { MovieDetailsResponse } from '@/types/types.gen';

export const getMovieDetails = (id: string): Promise<MovieDetailsResponse> => {
  if (!id) {
    return Promise.reject(new Error('Movie id is required'));
  }
  const url = `/movies/${id}`;
  return apiClient.get(url, true) as Promise<MovieDetailsResponse>;
};

export const getMovieDetailsQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: id ? ['movie', { id }] : ['movie'],
    queryFn: () => getMovieDetails(id),
  });
};

type UseGetMovieDetailsOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getMovieDetailsQueryOptions>;
};

export const useGetMovieDetails = ({
  id,
  queryConfig,
}: UseGetMovieDetailsOptions) => {
  return useSuspenseQuery({
    ...getMovieDetailsQueryOptions({ id }),
    ...queryConfig,
  });
};
