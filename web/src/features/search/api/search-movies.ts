import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { SearchMoviesResponse } from '@/types/types.gen';

export const searchMovies = (q: string): Promise<SearchMoviesResponse> => {
  if (!q) {
    return Promise.resolve({ movies: [] });
  }
  q = q.trim();
  const url = apiClient.appendQueryParams('/search/movies', { q });
  return apiClient.get(url, true) as Promise<SearchMoviesResponse>;
};

export const searchMoviesQueryOptions = ({ q }: { q: string }) => {
  return queryOptions({
    queryKey: q ? ['search-movies', { q }] : ['search-movies'],
    queryFn: () => searchMovies(q),
  });
};

type UseSearchMoviesOptions = {
  q: string;
  queryConfig?: QueryConfig<typeof searchMoviesQueryOptions>;
};

export const useSearchMovies = ({ q, queryConfig }: UseSearchMoviesOptions) => {
  return useQuery({
    ...searchMoviesQueryOptions({ q }),
    ...queryConfig,
  });
};
