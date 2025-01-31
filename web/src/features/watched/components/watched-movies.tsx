import { useGetWatched } from '../api/get-watched';
import { watchedMovieColumns } from './watched-data-table/movies-columns';
import { WatchedDataTable } from './watched-data-table/data-table';

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
    <WatchedDataTable
      columns={watchedMovieColumns}
      data={watchedMovies}
      isTv={false}
    />
  );
};
