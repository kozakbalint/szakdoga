import { useState } from 'react';
import { WatchedToggle } from './watchedtoggle';
import { useAddMovieToWatched } from '@/features/watched/api/add-movie-to-watched';
import { useRemoveMovieFromWatched } from '@/features/watched/api/remove-movie-from-watched';
import { useIsMovieOnWatched } from '@/features/watched/api/is-movie-on-watched';

export const MovieWatchedToggle = ({ id }: { id: string }) => {
  const [disabled, setDisabled] = useState(false);
  const isMovieOnWatchedQuery = useIsMovieOnWatched({ id });
  const addMovieToWatchedMutation = useAddMovieToWatched({
    id,
    mutationConfig: {
      onSuccess: () => setDisabled(false),
      onError: () => setDisabled(false),
    },
  });
  const removeMovieFromWatchedMutation = useRemoveMovieFromWatched({
    id,
    mutationConfig: {
      onSuccess: () => setDisabled(false),
      onError: () => setDisabled(false),
    },
  });

  if (isMovieOnWatchedQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const isOnWatched = isMovieOnWatchedQuery.data?.in_watched;

  if (isOnWatched === undefined) {
    return '';
  }

  const addOnClicked = () => {
    setDisabled(true);
    addMovieToWatchedMutation.mutate(id);
  };

  const removeOnClicked = () => {
    setDisabled(true);
    removeMovieFromWatchedMutation.mutate(id);
  };

  return (
    <WatchedToggle
      type="Movie"
      isOnWatched={isOnWatched}
      disabled={disabled}
      addOnClicked={addOnClicked}
      removeOnClicked={removeOnClicked}
    />
  );
};
