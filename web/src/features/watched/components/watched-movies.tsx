import { useGetWatched } from '../api/get-watched';
import { WatchedMoviesDataTable } from './movies-data-table/data-table';
import { watchedMovieColumns } from './movies-data-table/columns';

export const MoviesWatched = () => {
  const watchedMoviesQuery = useGetWatched({});
  if (watchedMoviesQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const watchedMovies = watchedMoviesQuery.data?.watched.movies;
  if (!watchedMovies) {
    return 'No movies in watched list';
  }
  return (
    <WatchedMoviesDataTable
      columns={watchedMovieColumns}
      data={watchedMovies}
    />
  );
};
