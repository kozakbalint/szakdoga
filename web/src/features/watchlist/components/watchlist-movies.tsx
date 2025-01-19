import { useGetWatchlist } from '../api/get-watchlist';
import { watchlistMovieColumns } from './movies-data-table/columns';
import { WatchlistMoviesDataTable } from './movies-data-table/data-table';

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
    <WatchlistMoviesDataTable columns={watchlistMovieColumns} data={movies} />
  );
};
