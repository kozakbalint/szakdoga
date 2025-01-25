import { useState } from 'react';
import { WatchedToggle } from './watchedtoggle';
import { useIsTvSeasonOnWatched } from '@/features/watched/api/is-tv-season-on-watched';
import { useAddTvSeasonToWatched } from '@/features/watched/api/add-tv-season-to-watched';
import { useRemoveTvSeasonFromWatched } from '@/features/watched/api/remove-tv-season-from-watched';
import { WatchedTvStatus } from '@/types/types.gen';

export const SeasonWatchedToggle = ({
  id,
  seasonNumber,
}: {
  id: string;
  seasonNumber: string;
}) => {
  const [disabled, setDisabled] = useState(false);
  const isSeasonOnWatchedQuery = useIsTvSeasonOnWatched({ id, seasonNumber });
  const addSeasonToWatchedMutation = useAddTvSeasonToWatched({
    id,
    seasonNumber,
    mutationConfig: {
      onSuccess: () => setDisabled(false),
      onError: () => setDisabled(false),
    },
  });
  const removeSeasonFromWatchedMutation = useRemoveTvSeasonFromWatched({
    id,
    seasonNumber,
    mutationConfig: {
      onSuccess: () => setDisabled(false),
      onError: () => setDisabled(false),
    },
  });

  if (isSeasonOnWatchedQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const watchedData = isSeasonOnWatchedQuery.data?.watched_season;
  let isOnWatched = false;

  if (watchedData && watchedData.status !== WatchedTvStatus.not_watched) {
    isOnWatched = true;
  }

  const addOnClicked = () => {
    setDisabled(true);
    addSeasonToWatchedMutation.mutate(id);
  };

  const removeOnClicked = () => {
    setDisabled(true);
    removeSeasonFromWatchedMutation.mutate(id);
  };

  return (
    <WatchedToggle
      type="Season"
      isOnWatched={isOnWatched}
      disabled={disabled}
      addOnClicked={addOnClicked}
      removeOnClicked={removeOnClicked}
    />
  );
};
