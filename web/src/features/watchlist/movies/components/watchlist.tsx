import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useGetMoviesWatchlist } from '../api/get-movies-watchlist';
import { Star } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const Watchlist = () => {
  const watchlistQuery = useGetMoviesWatchlist({});
  if (watchlistQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const watchlist = watchlistQuery.data?.watchlist;
  if (!watchlist) {
    return 'No movies in watchlist';
  }
  return (
    <div className="flex flex-row flex-wrap gap-2 justify-center lg:justify-start w-full">
      {watchlist.map((movie) => (
        <Link
          to={`/app/movies/${movie.movie.tmdb_id}`}
          key={movie.movie.id}
          className="hover:underline w-2/5 md:w-1/3 lg:w-1/6"
        >
          <Card key={movie.movie.id}>
            <CardHeader className="p-0">
              <img
                src={movie.movie.poster_url}
                alt={movie.movie.title}
                className="w-full rounded-xl"
              />
            </CardHeader>
            <CardContent className="flex flex-col py-4 px-2">
              <div className="text-base font-bold line-clamp-1">
                {movie.movie.title}
              </div>
              <div className="text-sm">
                {movie.movie.release_date.slice(0, 4)}
              </div>
              <div className="text-md flex flex-row">
                <Star fill="gold" stroke="black" />
                {movie.movie.vote_average}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
