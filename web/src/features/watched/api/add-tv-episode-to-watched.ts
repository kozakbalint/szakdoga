import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Message } from '@/types/types.gen';
import { isMovieOnWatchedQueryOptions } from './is-movie-on-watched';
import { getWatchedQueryOptions } from './get-watched';

export const addTvEpisodeToWatched = (
  id: string,
  seasonNumber: string,
  episodeNumber: string,
): Promise<Message> => {
  if (!id || !seasonNumber || !episodeNumber) {
    return Promise.reject(
      new Error('TV episode id, season number and episode number are required'),
    );
  }
  const url = `/watched/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}`;
  return apiClient.post(url, null, true) as Promise<Message>;
};

type UseAddTvEpisodeToWatchedOptions = {
  id: string;
  seasonNumber: string;
  episodeNumber: string;
  mutationConfig?: MutationConfig<typeof addTvEpisodeToWatched>;
};

export const useAddTvEpisodeToWatched = ({
  id,
  seasonNumber,
  episodeNumber,
  mutationConfig,
}: UseAddTvEpisodeToWatchedOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: () => addTvEpisodeToWatched(id, seasonNumber, episodeNumber),
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
