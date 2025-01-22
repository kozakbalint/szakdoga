import { WatchlistToggle } from './watchlisttoggle';
import { useAddMovieToWatchlist } from '@/features/watchlist/api/add-movie-to-watchlist';
import { useRemoveMovieFromWatchlist } from '@/features/watchlist/api/remove-movie-from-watchlist';

export const MovieWatchlistToggle = ({
  id,
  type,
  isOnWatchlist,
}: {
  id: string;
  type: string;
  isOnWatchlist: boolean;
}) => {
  const addMutatuion = useAddMovieToWatchlist({ id });
  const removeMutation = useRemoveMovieFromWatchlist({ id });

  return (
    <WatchlistToggle
      id={id}
      type={type}
      isOnWatchlist={isOnWatchlist}
      addMutatuion={addMutatuion}
      removeMutation={removeMutation}
    />
  );
};
