import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Message } from '@/types/types.gen';
import { isMovieOnWatchedQueryOptions } from './is-movie-on-watched';
import { getWatchedQueryOptions } from './get-watched';

export const addTvToWatched = (id: string): Promise<Message> => {
  if (!id) {
    return Promise.reject(new Error('TV id is required'));
  }
  const url = `/watched/tv/${id}`;
  return apiClient.post(url, null, true) as Promise<Message>;
};

type UseAddTvToWatchedOptions = {
  id: string;
  mutationConfig?: MutationConfig<typeof addTvToWatched>;
};

export const useAddTvToWatched = ({
  id,
  mutationConfig,
}: UseAddTvToWatchedOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: () => addTvToWatched(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: isMovieOnWatchedQueryOptions({ id }).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getWatchedQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
  });
};
