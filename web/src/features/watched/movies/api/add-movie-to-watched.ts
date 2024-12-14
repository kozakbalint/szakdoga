import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { MessageResponse } from '@/types/api';
import { getMoviesWatchedQueryOptions } from './get-movies-watched';
import { getMovieWatchedDatesQueryOptions } from './get-movie-watch-dates';

export const addMovieToWatchedInputSchema = z.object({
  movie_id: z.number().min(1),
});

export type AddMovieToWatchedInput = z.infer<
  typeof addMovieToWatchedInputSchema
>;

export const addMovieToWatched = (
  input: AddMovieToWatchedInput,
): Promise<MessageResponse> => {
  const url = `/watched/movies`;
  return apiClient.post(url, input, true) as Promise<MessageResponse>;
};

type UseAddMovieToWatchedOptions = {
  mutationConfig?: MutationConfig<typeof addMovieToWatched>;
};

export const useAddMovieToWatched = ({
  mutationConfig,
}: UseAddMovieToWatchedOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: addMovieToWatched,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: getMoviesWatchedQueryOptions().queryKey,
      });

      if (variables?.movie_id) {
        queryClient.invalidateQueries({
          queryKey: getMovieWatchedDatesQueryOptions({
            id: variables.movie_id.toString(),
          }).queryKey,
        });
      }

      onSuccess?.(data, variables, context);
    },
  });
};
