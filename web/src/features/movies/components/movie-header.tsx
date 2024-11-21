import { Button } from '@/components/ui/button';
import { Heart, List, Star } from 'lucide-react';
import { useGetMovieById } from '../api/get-movie-by-id';
import { Badge } from '@/components/ui/badge';
import { MovieWatchProvider } from './movie-watch-provider';
import { Link } from '@tanstack/react-router';

export const MovieHeader = ({ movieId }: { movieId: string }) => {
  const movieQuery = useGetMovieById({ id: movieId });

  if (movieQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const movie = movieQuery.data?.movie;

  if (!movie) {
    return '';
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-4">
      <div className="flex flex-col sm:flex-row w-full lg:w-4/5 gap-4">
        <div className="flex w-full sm:w-1/3 justify-center content-center">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="rounded-md shadow object-center w-3/5 sm:w-full"
          />
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-2/3 max-h-fit overflow-scroll">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-bold text-pretty">{movie.title}</div>
            <div className="flex flex-row items-start gap-4">
              <div className="text-xl font-thin">
                ({movie.release_date.slice(0, 4)})
              </div>
              <div className="flex text-xl lg:pr-4 font-thin self-start items-center flex-grow sm:justify-end gap-1">
                <Star fill="gold" stroke="black" />
                {Math.fround(movie.vote_average).toFixed(1)}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {movie.genres.map((genre) => (
              <Link key={genre.id} to={`/app/categories/${genre.id}`}>
                <Badge key={genre.id} className="cursor-pointer">
                  {genre.name}
                </Badge>
              </Link>
            ))}
          </div>
          <div className="text-justify lg:pr-4 overflow-scroll">
            {movie.overview}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full lg:w-1/5 lg:justify-between">
        <div>
          <Button size={'icon'} variant={'outline'}>
            <Heart />
          </Button>
          <Button size={'icon'} variant={'outline'}>
            <List />
          </Button>
          <Button size={'icon'} variant={'outline'}>
            <Star />
          </Button>
        </div>
        <div>
          <MovieWatchProvider movieId={movieId} type="streming" />
        </div>
      </div>
    </div>
  );
};
