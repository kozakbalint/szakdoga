import { useGetMovieCast } from '../api/get-movie-cast';
import { ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Cast } from './cast';
import { Spinner } from '@/components/ui/spinner';

export const MovieCast = ({ movieId }: { movieId: string }) => {
  const movieCastQuery = useGetMovieCast({ id: movieId });

  if (movieCastQuery.isLoading) {
    return (
      <div className="flex flex-col gap-4 max-h-[370px] overflow-hidden">
        <Link to={'/app/cast/movie/' + movieId}>
          <div className="flex flex-row gap-1 place-items-center text-2xl font-semibold">
            <p>Cast</p>
            <ChevronRight size={32} className="align-baseline" />
          </div>
        </Link>
        <div className="flex flex-row flex-wrap max-w-full gap-4 justify-center lg:justify-start overflow-hidden">
          <Spinner className="text-muted" />
        </div>
      </div>
    );
  }

  const cast = movieCastQuery.data?.cast;

  if (!cast) {
    return <div>Cast not found</div>;
  }

  const topCast = cast.slice(0, 10);

  return (
    <div className="flex flex-col gap-4 max-h-[370px] overflow-hidden">
      <Link to={'/app/cast/movie/' + movieId} className="hover:underline">
        <div className="flex flex-row gap-1 place-items-center text-2xl font-semibold">
          <p>
            Cast <span className="text-xl font-thin">({cast.length})</span>
          </p>
          <ChevronRight size={32} className="align-baseline" />
        </div>
      </Link>
      <div className="flex flex-row flex-wrap max-w-full gap-4 justify-center lg:justify-start overflow-hidden">
        {topCast.map((actor) => (
          <Link key={actor.id} to={`/app/people/` + actor.id}>
            <Cast key={actor.id} actor={actor} />
          </Link>
        ))}
      </div>
    </div>
  );
};
