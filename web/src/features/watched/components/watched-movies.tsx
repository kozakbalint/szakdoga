import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useGetWatched } from '../api/get-watched';

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
    <div className="flex flex-row flex-wrap gap-2 justify-center lg:justify-start w-full">
      {watchedMovies.map((movie) => (
        <Link
          to={`/app/movies/${movie.id}`}
          key={movie.id}
          className="hover:underline w-2/5 md:w-1/3 lg:w-1/6"
        >
          <Card key={movie.id}>
            <CardHeader className="p-0">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full rounded-xl"
              />
            </CardHeader>
            <CardContent className="flex flex-col py-4 px-2">
              <div className="text-base font-bold line-clamp-1">
                {movie.title}
              </div>
              <div className="text-sm">{movie.release_date.slice(0, 4)}</div>
              <div className="text-md flex flex-row">
                <Star fill="gold" stroke="black" />
                {Math.fround(movie.vote_average).toFixed(1)}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
