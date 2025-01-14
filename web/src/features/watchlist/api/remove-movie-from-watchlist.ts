import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { isMovieOnWatchlistQueryOptions } from './is-movie-on-watchlist';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getWatchlistQueryOptions } from './get-watchlist';

export const removeMovieFromWatchlist = (id: string) => {
  if (!id) {
    return Promise.reject(new Error('Movie id is required'));
  }
  const url = `/watchlist/movies/${id}`;
  return apiClient.delete(url, true);
};

type UseRemoveMovieFromWatchlistOptions = {
  id: string;
  mutationConfig?: MutationConfig<typeof removeMovieFromWatchlist>;
};

export const useRemoveMovieFromWatchlist = ({
  id,
  mutationConfig,
}: UseRemoveMovieFromWatchlistOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: removeMovieFromWatchlist,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: isMovieOnWatchlistQueryOptions({ id }).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getWatchlistQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
  });
};
