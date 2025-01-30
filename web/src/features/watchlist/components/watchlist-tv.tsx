import { useGetWatchlist } from '../api/get-watchlist';
import { watchlistTvColumns } from './watchlist-data-table/tv-columns';
import { WatchlistDataTable } from './watchlist-data-table/data-table';

export const TvWatchlist = () => {
  const watchlistQuery = useGetWatchlist({});
  if (watchlistQuery.isLoading) {
    return <div>Loading...</div>;
  }

  let tv = watchlistQuery.data?.watchlist.tv;
  if (!tv) {
    tv = [];
  }
  return (
    <WatchlistDataTable columns={watchlistTvColumns} data={tv} isTv={true} />
  );
};
