import { useGetTvCast } from '../api/get-tv-cast';
import { ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Cast } from './cast';
import { Spinner } from '@/components/ui/spinner';

export const TvCast = ({ tvId }: { tvId: string }) => {
  const tvCastQuery = useGetTvCast({ id: tvId });

  if (tvCastQuery.isLoading) {
    return (
      <div className="flex flex-col gap-4 max-h-[370px] overflow-scroll">
        <Link to={'/app/cast/tv/' + tvId} resetScroll={true}>
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

  const cast = tvCastQuery.data?.cast;

  if (!cast) {
    return (
      <div className="flex flex-col gap-4 max-h-[370px] overflow-scroll">
        <Link to={'/app/cast/tv/' + tvId} resetScroll={true}>
          <div className="flex flex-row gap-1 place-items-center text-2xl font-semibold">
            <p>Cast</p>
            <ChevronRight size={32} className="align-baseline" />
          </div>
        </Link>
        <div className="flex flex-row flex-wrap max-w-full gap-4 justify-center lg:justify-start overflow-hidden">
          <div>Cast not found.</div>
        </div>
      </div>
    );
  }

  const topCast = cast.slice(0, 10);

  return (
    <div className="flex flex-col gap-4 max-h-[370px] overflow-scroll">
      <Link
        to={'/app/cast/tv/' + tvId}
        className="hover:underline"
        resetScroll={true}
      >
        <div className="flex flex-row gap-1 place-items-center text-2xl font-semibold">
          <p>
            Cast <span className="font-thin text-xl">({cast.length})</span>
          </p>
          <ChevronRight size={32} className="align-baseline" />
        </div>
      </Link>
      <div className="flex flex-row flex-wrap max-w-full gap-4 justify-center lg:justify-start overflow-hidden">
        {topCast.map((actor) => (
          <Link
            key={actor.id}
            to={`/app/people/` + actor.id}
            resetScroll={true}
          >
            <Cast key={actor.id} actor={actor} />
          </Link>
        ))}
      </div>
    </div>
  );
};
