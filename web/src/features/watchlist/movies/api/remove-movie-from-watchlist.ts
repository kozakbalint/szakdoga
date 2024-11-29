import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { getMoviesWatchlistQueryOptions } from './get-movies-watchlist';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const removeMovieFromWatchlist = ({ id }: { id: number }) => {
  const url = `/watchlist/movies/${id}`;
  return apiClient.delete(url, true);
};

type UseRemoveMovieFromWatchlistOptions = {
  mutationConfig?: MutationConfig<typeof removeMovieFromWatchlist>;
};

export const useRemoveMovieFromWatchlist = ({
  mutationConfig,
}: UseRemoveMovieFromWatchlistOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: removeMovieFromWatchlist,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getMoviesWatchlistQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
  });
};
