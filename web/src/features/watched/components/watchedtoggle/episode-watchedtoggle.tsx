import { useState } from 'react';
import { WatchedToggle } from './watchedtoggle';
import { useIsTvEpisodeOnWatched } from '@/features/watched/api/is-tv-episode-on-watched';
import { useRemoveTvEpisodeFromWatched } from '@/features/watched/api/remove-tv-episode-from-watched';
import { useAddTvEpisodeToWatched } from '@/features/watched/api/add-tv-episode-to-watched';

export const EpisodeWatchedToggle = ({
  id,
  seasonNumber,
  episodeNumber,
}: {
  id: string;
  seasonNumber: string;
  episodeNumber: string;
}) => {
  const [disabled, setDisabled] = useState(false);
  const isEpisodeOnWatchedQuery = useIsTvEpisodeOnWatched({
    id,
    seasonNumber,
    episodeNumber,
  });
  const addEpisodeToWatchedMutation = useAddTvEpisodeToWatched({
    id,
    seasonNumber,
    episodeNumber,
    mutationConfig: {
      onSuccess: () => setDisabled(false),
      onError: () => setDisabled(false),
    },
  });
  const removeEpisodeFromWatchedMutation = useRemoveTvEpisodeFromWatched({
    id,
    seasonNumber,
    episodeNumber,
    mutationConfig: {
      onSuccess: () => setDisabled(false),
      onError: () => setDisabled(false),
    },
  });

  if (isEpisodeOnWatchedQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const isOnWatched = isEpisodeOnWatchedQuery.data?.in_watched;

  if (isOnWatched === undefined) {
    return '';
  }

  const addOnClicked = () => {
    setDisabled(true);
    addEpisodeToWatchedMutation.mutate(id);
  };

  const removeOnClicked = () => {
    setDisabled(true);
    removeEpisodeFromWatchedMutation.mutate(id);
  };

  return (
    <WatchedToggle
      type="Episode"
      isOnWatched={isOnWatched}
      disabled={disabled}
      addOnClicked={addOnClicked}
      removeOnClicked={removeOnClicked}
    />
  );
};
