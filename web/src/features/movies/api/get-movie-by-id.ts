import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { GetMovieResponse } from '@/types/api';

export const getMovieById = (id: string): Promise<GetMovieResponse> => {
  if (!id) {
    return Promise.resolve({ movie: null });
  }
  const url = `/movies/${id}`;
  return apiClient.getWithToken(url) as Promise<GetMovieResponse>;
};

export const getMovieByIdQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: id ? ['movie', { id }] : ['movie'],
    queryFn: () => getMovieById(id),
  });
};

type UseGetMovieByIdOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getMovieByIdQueryOptions>;
};

export const useGetMovieById = ({
  id,
  queryConfig,
}: UseGetMovieByIdOptions) => {
  return useQuery({ ...getMovieByIdQueryOptions({ id }), ...queryConfig });
};
