import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { MessageResponse } from '@/types/api';
import { getMoviesWatchlistQueryOptions } from './get-movies-watchlist';

export const addMovieToWatchlistInputSchema = z.object({
  tmdb_id: z.number().min(1),
});

export type AddMovieToWatchlistInput = z.infer<
  typeof addMovieToWatchlistInputSchema
>;

export const addMovieToWatchlist = (
  input: AddMovieToWatchlistInput,
): Promise<MessageResponse> => {
  const url = `/watchlist/movies`;
  return apiClient.post(url, input, true) as Promise<MessageResponse>;
};

type UseAddMovieToWatchlistOptions = {
  mutationConfig?: MutationConfig<typeof addMovieToWatchlist>;
};

export const useAddMovieToWatchlist = ({
  mutationConfig,
}: UseAddMovieToWatchlistOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: addMovieToWatchlist,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getMoviesWatchlistQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
  });
};
