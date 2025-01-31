import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { InWatched } from '@/types/types.gen';

export const isMovieOnWatched = (id: string): Promise<InWatched> => {
  if (!id) {
    return Promise.reject(new Error('Movie id is required'));
  }
  const url = `/watched/movies/${id}`;
  return apiClient.get(url, true) as Promise<InWatched>;
};

export const isMovieOnWatchedQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: id ? ['on-watched', { id }] : ['on-watched'],
    queryFn: () => isMovieOnWatched(id),
  });
};

type UseIsMovieOnWatchedOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof isMovieOnWatchedQueryOptions>;
};

export const useIsMovieOnWatched = ({
  id,
  queryConfig,
}: UseIsMovieOnWatchedOptions) => {
  return useSuspenseQuery({
    ...isMovieOnWatchedQueryOptions({ id }),
    ...queryConfig,
  });
};
