import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { GetMovieWatchedDatesResponse } from '@/types/api';

export const getMovieWatchedDates = ({
  id,
}: {
  id: string;
}): Promise<GetMovieWatchedDatesResponse> => {
  const url = `/watched/movies/${id}`;
  return apiClient.get(url, true) as Promise<GetMovieWatchedDatesResponse>;
};

export const getMovieWatchedDatesQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: [`movie-watched`, { id }],
    queryFn: () => getMovieWatchedDates({ id }),
  });
};

type UseGetMovieWatchedDatesOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getMovieWatchedDatesQueryOptions>;
};

export const useGetMovieWatchedDates = ({
  id,
  queryConfig,
}: UseGetMovieWatchedDatesOptions) => {
  return useQuery({
    ...getMovieWatchedDatesQueryOptions({ id }),
    ...queryConfig,
  });
};
