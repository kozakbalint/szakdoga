import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { isMovieOnWatchedQueryOptions } from './is-movie-on-watched';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getWatchedQueryOptions } from './get-watched';
import { Message } from '@/types/types.gen';

export const removeMovieFromWatched = (id: string): Promise<Message> => {
  if (!id) {
    return Promise.reject(new Error('Movie id is required'));
  }
  const url = `/watched/movies/${id}`;
  return apiClient.delete(url, true) as Promise<Message>;
};

type UseRemoveMovieFromWatchedOptions = {
  id: string;
  mutationConfig?: MutationConfig<typeof removeMovieFromWatched>;
};

export const useRemoveMovieFromWatched = ({
  id,
  mutationConfig,
}: UseRemoveMovieFromWatchedOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: removeMovieFromWatched,
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
