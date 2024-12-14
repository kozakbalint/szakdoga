import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { getMoviesWatchedQueryOptions } from './get-movies-watched';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getMovieWatchedDatesQueryOptions } from './get-movie-watch-dates';

export const removeMovieFromWatched = ({ id }: { id: number }) => {
  const url = `/watched/movies/${id}`;
  return apiClient.delete(url, true);
};

type UseRemoveMovieFromWatchedOptions = {
  mutationConfig?: MutationConfig<typeof removeMovieFromWatched>;
};

export const useRemoveMovieFromWatched = ({
  mutationConfig,
}: UseRemoveMovieFromWatchedOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: removeMovieFromWatched,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: getMoviesWatchedQueryOptions().queryKey,
      });

      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: getMovieWatchedDatesQueryOptions({
            id: variables.id.toString(),
          }).queryKey,
        });
      }

      onSuccess?.(data, variables, context);
    },
  });
};
