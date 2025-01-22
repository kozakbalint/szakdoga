import { useGetWatchlist } from '../api/get-watchlist';
import { WatchlistTvDataTable } from './tv-data-table/data-table';
import { watchlistTvColumns } from './tv-data-table/columns';

export const TvWatchlist = () => {
  const watchlistQuery = useGetWatchlist({});
  if (watchlistQuery.isLoading) {
    return <div>Loading...</div>;
  }

  let tv = watchlistQuery.data?.watchlist.tv;
  if (!tv) {
    tv = [];
  }
  return <WatchlistTvDataTable columns={watchlistTvColumns} data={tv} />;
};
