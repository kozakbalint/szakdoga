import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { PersonDetailsResponse } from '@/types/types.gen';

export const getPersonDetails = (
  id: string,
): Promise<PersonDetailsResponse> => {
  if (!id) {
    return Promise.reject(new Error('Person id is required'));
  }
  const url = `/people/${id}`;
  return apiClient.get(url, true) as Promise<PersonDetailsResponse>;
};

export const getPersonDetailsQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: id ? ['person', { id }] : ['person'],
    queryFn: () => getPersonDetails(id),
  });
};

type UseGetPersonDetailsOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getPersonDetailsQueryOptions>;
};

export const useGetPersonDetails = ({
  id,
  queryConfig,
}: UseGetPersonDetailsOptions) => {
  return useQuery({ ...getPersonDetailsQueryOptions({ id }), ...queryConfig });
};
