import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { SearchPeopleResponse } from '@/types/api';

export const searchPeople = (q: string): Promise<SearchPeopleResponse> => {
  if (!q) {
    return Promise.resolve({ people: [] });
  }
  q = q.trim();
  const url = apiClient.appendQueryParams('/search/people', { q });
  return apiClient.get(url, true) as Promise<SearchPeopleResponse>;
};

export const searchPeopleQueryOptions = ({ q }: { q: string }) => {
  return queryOptions({
    queryKey: q ? ['searchedPeople', { q }] : ['searchedPeople'],
    queryFn: () => searchPeople(q),
  });
};

type UseSearchPeopleOptions = {
  q: string;
  queryConfig?: QueryConfig<typeof searchPeopleQueryOptions>;
};

export const useSearchPeople = ({ q, queryConfig }: UseSearchPeopleOptions) => {
  return useQuery({ ...searchPeopleQueryOptions({ q }), ...queryConfig });
};
