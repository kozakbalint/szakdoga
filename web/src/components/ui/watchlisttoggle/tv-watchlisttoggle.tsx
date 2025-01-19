import { WatchlistToggle } from './watchlisttoggle';
import { useAddTvToWatchlist } from '@/features/watchlist/api/add-tv-to-watchlist';
import { useRemoveTvFromWatchlist } from '@/features/watchlist/api/remove-tv-from-watchlist';

export const TvWatchlistToggle = ({
  id,
  type,
  isOnWatchlist,
}: {
  id: string;
  type: string;
  isOnWatchlist: boolean;
}) => {
  const addMutatuion = useAddTvToWatchlist({ id });
  const removeMutation = useRemoveTvFromWatchlist({ id });

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
