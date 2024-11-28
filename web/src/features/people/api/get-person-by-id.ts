import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { GetPersonResponse } from '@/types/api';

export const getPersonById = (id: string): Promise<GetPersonResponse> => {
  if (!id) {
    return Promise.resolve({ person: null });
  }
  const url = `/people/${id}`;
  return apiClient.getWithToken(url) as Promise<GetPersonResponse>;
};

export const getPersonByIdQueryOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: id ? ['person', { id }] : ['person'],
    queryFn: () => getPersonById(id),
  });
};

type UseGetPersonByIdOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getPersonByIdQueryOptions>;
};

export const useGetPersonById = ({
  id,
  queryConfig,
}: UseGetPersonByIdOptions) => {
  return useQuery({ ...getPersonByIdQueryOptions({ id }), ...queryConfig });
};
