import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { MessageResponse } from '@/types/api';
import { getTvShowWatchedQueryOptions } from './get-tv-show-watched';

export const addTvShowSeasonToWatchedInputSchema = z.object({
  tv_id: z.number().min(1),
  season: z.number().min(1),
});

export type AddTvShowSeasonToWatchedInput = z.infer<
  typeof addTvShowSeasonToWatchedInputSchema
>;

export const addTvShowSeasonToWatched = (
  input: AddTvShowSeasonToWatchedInput,
): Promise<MessageResponse> => {
  const url = `/watched/tv/season`;
  return apiClient.post(url, input, true) as Promise<MessageResponse>;
};

type UseAddTvShowSeasonToWatchedOptions = {
  mutationConfig?: MutationConfig<typeof addTvShowSeasonToWatched>;
};

export const useAddTvShowSeasonToWatched = ({
  mutationConfig,
}: UseAddTvShowSeasonToWatchedOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: addTvShowSeasonToWatched,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: getTvShowWatchedQueryOptions().queryKey,
      });

      onSuccess?.(data, variables, context);
    },
  });
};
