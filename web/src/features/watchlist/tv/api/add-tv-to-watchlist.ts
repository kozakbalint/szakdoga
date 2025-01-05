import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { MessageResponse } from '@/types/api';
import { getTVWatchlistQueryOptions } from './get-tv-watchlist';

export const addTVToWatchlistInputSchema = z.object({
  tmdb_id: z.number().min(1),
});

export type AddTVToWatchlistInput = z.infer<typeof addTVToWatchlistInputSchema>;

export const addTVToWatchlist = (
  input: AddTVToWatchlistInput,
): Promise<MessageResponse> => {
  const url = `/watchlist/tv`;
  return apiClient.post(url, input, true) as Promise<MessageResponse>;
};

type UseAddTVToWatchlistOptions = {
  mutationConfig?: MutationConfig<typeof addTVToWatchlist>;
};

export const useAddTVToWatchlist = ({
  mutationConfig,
}: UseAddTVToWatchlistOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: addTVToWatchlist,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getTVWatchlistQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
  });
};
