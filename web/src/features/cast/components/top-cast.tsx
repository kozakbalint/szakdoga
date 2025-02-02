import { ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Cast, SuspenseCast } from './cast';
import { CastMovies, CastTv } from '@/types/types.gen';

export const TopCast = ({
  id,
  isTv,
  data,
}: {
  id: string;
  isTv: boolean;
  data: CastMovies[] | CastTv[];
}) => {
  const topCast = data.slice(0, 10);
  const link = isTv ? '/app/cast/tv/' : '/app/cast/movie/';

  return (
    <div className="flex flex-col gap-4 max-h-[370px] overflow-hidden">
      <Link to={link + id} resetScroll={true} className="hover:underline">
        <div className="flex flex-row gap-1 place-items-center text-2xl font-semibold">
          <p>
            Cast <span className="text-xl font-thin">({data.length})</span>
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

export const SuspenseTopCast = () => {
  return (
    <div className="flex flex-col gap-4 max-h-[370px] overflow-hidden">
      <div className="flex flex-row gap-1 place-items-center text-2xl font-semibold">
        <p>Cast</p>
        <ChevronRight size={32} className="align-baseline" />
      </div>
      <div className="flex flex-row flex-wrap max-w-full gap-4 justify-center lg:justify-start overflow-hidden">
        {[...Array(10)].map((_, index) => (
          <SuspenseCast key={index} id={index} />
        ))}
      </div>
    </div>
  );
};
