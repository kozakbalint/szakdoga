import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { GetTvShowWatchedDatesResponse } from '@/types/api';

export const getTvShowWatchedDates = ({
  id,
}: {
  id: string;
}): Promise<GetTvShowWatchedDatesResponse> => {
  const url = `/watched/tv/show/${id}`;
  return apiClient.get(url, true) as Promise<GetTvShowWatchedDatesResponse>;
};

export const getTvShowWatchedDatesQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: [`tv-watched`, { id }],
    queryFn: () => getTvShowWatchedDates({ id }),
  });
};

type UseGetTvShowWatchedDatesOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getTvShowWatchedDatesQueryOptions>;
};

export const useGetTvShowWatchedDates = ({
  id,
  queryConfig,
}: UseGetTvShowWatchedDatesOptions) => {
  return useQuery({
    ...getTvShowWatchedDatesQueryOptions({ id }),
    ...queryConfig,
  });
};
