import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { InWatchlist } from '@/types/types.gen';

export const isMovieOnWatchlist = (id: string): Promise<InWatchlist> => {
  if (!id) {
    return Promise.reject(new Error('Movie id is required'));
  }
  const url = `/watchlist/movies/${id}`;
  return apiClient.get(url, true) as Promise<InWatchlist>;
};

export const isMovieOnWatchlistQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: id ? ['on-watchlist', { id }] : ['on-watchlist'],
    queryFn: () => isMovieOnWatchlist(id),
  });
};

type UseIsMovieOnWatchlistOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof isMovieOnWatchlistQueryOptions>;
};

export const useIsMovieOnWatchlist = ({
  id,
  queryConfig,
}: UseIsMovieOnWatchlistOptions) => {
  return useSuspenseQuery({
    ...isMovieOnWatchlistQueryOptions({ id }),
    ...queryConfig,
  });
};
