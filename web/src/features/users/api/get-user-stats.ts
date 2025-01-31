import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { UserStatsResponse } from '@/types/types.gen';

export const getUserStats = (): Promise<UserStatsResponse> => {
  const url = `/users/stats`;
  return apiClient.get(url, true) as Promise<UserStatsResponse>;
};

export const getUserStatsQueryOptions = () => {
  return queryOptions({
    queryKey: ['user-stats'],
    queryFn: () => getUserStats(),
  });
};

type UseGetUserStatsOptions = {
  queryConfig?: QueryConfig<typeof getUserStatsQueryOptions>;
};

export const useGetUserStats = ({ queryConfig }: UseGetUserStatsOptions) => {
  return useSuspenseQuery({
    ...getUserStatsQueryOptions(),
    ...queryConfig,
  });
};
