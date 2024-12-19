import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { MessageResponse } from '@/types/api';
import { getTvShowWatchedQueryOptions } from './get-tv-show-watched';

export const addTvShowToWatchedInputSchema = z.object({
  tv_id: z.number().min(1),
});

export type AddTvShowToWatchedInput = z.infer<
  typeof addTvShowToWatchedInputSchema
>;

export const addTvShowToWatched = (
  input: AddTvShowToWatchedInput,
): Promise<MessageResponse> => {
  const url = `/watched/tv`;
  return apiClient.post(url, input, true) as Promise<MessageResponse>;
};

type UseAddTvShowToWatchedOptions = {
  mutationConfig?: MutationConfig<typeof addTvShowToWatched>;
};

export const useAddTvShowToWatched = ({
  mutationConfig,
}: UseAddTvShowToWatchedOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: addTvShowToWatched,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: getTvShowWatchedQueryOptions().queryKey,
      });

      onSuccess?.(data, variables, context);
    },
  });
};
