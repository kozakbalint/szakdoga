import { useGetWatchlist } from '../api/get-watchlist';
import { watchlistMovieColumns } from './watchlist-data-table/movies-columns';
import { WatchlistDataTable } from './watchlist-data-table/data-table';

export const MoviesWatchlist = () => {
  const watchlistQuery = useGetWatchlist({});
  if (watchlistQuery.isLoading) {
    return <div>Loading...</div>;
  }

  let movies = watchlistQuery.data?.watchlist.movies;

  if (!movies) {
    movies = [];
  }

  return (
    <WatchlistDataTable
      columns={watchlistMovieColumns}
      data={movies}
      isTv={false}
    />
  );
};
