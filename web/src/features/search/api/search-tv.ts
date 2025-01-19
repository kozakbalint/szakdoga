import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { SearchTvResponse } from '@/types/types.gen';

export const searchTV = (q: string): Promise<SearchTvResponse> => {
  if (!q) {
    return Promise.resolve({ tv: [] });
  }
  q = q.trim();
  const url = apiClient.appendQueryParams('/search/tv', { q });
  return apiClient.get(url, true) as Promise<SearchTvResponse>;
};

export const searchTVQueryOptions = ({ q }: { q: string }) => {
  return queryOptions({
    queryKey: q ? ['search-tv', { q }] : ['search-tv'],
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
