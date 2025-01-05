import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { getTvShowWatchedQueryOptions } from './get-tv-show-watched';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const removeTvShowFromWatched = ({ id }: { id: number }) => {
  const url = `/watched/tv/show/${id}`;
  return apiClient.delete(url, true);
};

type UseRemoveTvShowFromWatchedOptions = {
  mutationConfig?: MutationConfig<typeof removeTvShowFromWatched>;
};

export const useRemoveTvShowFromWatched = ({
  mutationConfig,
}: UseRemoveTvShowFromWatchedOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: removeTvShowFromWatched,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: getTvShowWatchedQueryOptions().queryKey,
      });
      onSuccess?.(data, variables, context);
    },
  });
};
