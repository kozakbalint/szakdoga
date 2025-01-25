import { useState } from 'react';
import { WatchedToggle } from './watchedtoggle';
import { useIsTvOnWatched } from '@/features/watched/api/is-tv-on-watched';
import { useAddTvToWatched } from '@/features/watched/api/add-tv-to-watched';
import { useRemoveTvFromWatched } from '@/features/watched/api/remove-tv-from-watched';

export const TvWatchedToggle = ({ id }: { id: string }) => {
  const [disabled, setDisabled] = useState(false);
  const isTvOnWatchedQuery = useIsTvOnWatched({ id });
  const addTvToWatchedMutation = useAddTvToWatched({
    id,
    mutationConfig: {
      onSuccess: () => setDisabled(false),
      onError: () => setDisabled(false),
    },
  });
  const removeTvFromWatchedMutation = useRemoveTvFromWatched({
    id,
    mutationConfig: {
      onSuccess: () => setDisabled(false),
      onError: () => setDisabled(false),
    },
  });

  if (isTvOnWatchedQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const watchedData = isTvOnWatchedQuery.data?.watched_tv;
  let isOnWatched = false;

  if (watchedData && watchedData.progress > 0) {
    isOnWatched = true;
  }

  const addOnClicked = () => {
    setDisabled(true);
    addTvToWatchedMutation.mutate(id);
  };

  const removeOnClicked = () => {
    setDisabled(true);
    removeTvFromWatchedMutation.mutate(id);
  };

  return (
    <WatchedToggle
      type="TV"
      isOnWatched={isOnWatched}
      disabled={disabled}
      addOnClicked={addOnClicked}
      removeOnClicked={removeOnClicked}
    />
  );
};
