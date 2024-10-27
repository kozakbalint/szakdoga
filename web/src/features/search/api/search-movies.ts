import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { SearchMoviesResponse } from '@/types/api';

export const searchMovies = (q: string): Promise<SearchMoviesResponse> => {
  if (!q) {
    return Promise.reject();
  }
  q = q.trim();
  const url = apiClient.appendQueryParams('/search/movies', { q });
  return apiClient.get(url) as Promise<SearchMoviesResponse>;
};

export const searchMoviesQueryOptions = ({ q }: { q: string }) => {
  return queryOptions({
    queryKey: q ? ['searchedMovies', { q }] : ['searchedMovies'],
    queryFn: () => searchMovies(q),
  });
};

type UseSearchMoviesOptions = {
  q: string;
  queryConfig?: QueryConfig<typeof searchMoviesQueryOptions>;
};

export const useSearchMovies = ({ q, queryConfig }: UseSearchMoviesOptions) => {
  return useQuery({ ...searchMoviesQueryOptions({ q }), ...queryConfig });
};
