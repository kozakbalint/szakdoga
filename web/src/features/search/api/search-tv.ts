import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { SearchTvsResponse } from '@/types/api';

export const searchTV = (q: string): Promise<SearchTvsResponse> => {
  if (!q) {
    return Promise.resolve({ tv: [] });
  }
  q = q.trim();
  const url = apiClient.appendQueryParams('/search/tv', { q });
  return apiClient.get(url) as Promise<SearchTvsResponse>;
};

export const searchTVQueryOptions = ({ q }: { q: string }) => {
  return queryOptions({
    queryKey: q ? ['searchedTv', { q }] : ['searchedTv'],
    queryFn: () => searchTV(q),
  });
};

type UseSearchTVOptions = {
  q: string;
  queryConfig?: QueryConfig<typeof searchTVQueryOptions>;
};

export const useSearchTV = ({ q, queryConfig }: UseSearchTVOptions) => {
  return useQuery({ ...searchTVQueryOptions({ q }), ...queryConfig });
};
