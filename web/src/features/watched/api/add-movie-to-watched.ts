import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Message } from '@/types/types.gen';
import { isMovieOnWatchedQueryOptions } from './is-movie-on-watched';
import { getWatchedQueryOptions } from './get-watched';

export const addMovieToWatched = (id: string): Promise<Message> => {
  if (!id) {
    return Promise.reject(new Error('Movie id is required'));
  }
  const url = `/watched/movies/${id}`;
  return apiClient.post(url, null, true) as Promise<Message>;
};

type UseAddMovieToWatchedOptions = {
  id: string;
  mutationConfig?: MutationConfig<typeof addMovieToWatched>;
};

export const useAddMovieToWatched = ({
  id,
  mutationConfig,
}: UseAddMovieToWatchedOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: () => addMovieToWatched(id),
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
