import { useGetTvCast } from '../api/get-tv-cast';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';

export const TvCast = ({ tvId }: { tvId: string }) => {
  const tvCastQuery = useGetTvCast({ id: tvId });

  if (tvCastQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const cast = tvCastQuery.data?.cast;

  if (!cast) {
    return <div>Cast not found</div>;
  }

  const topCast = cast.slice(0, 10);

  return (
    <div className="flex flex-col gap-4 max-h-[350px] overflow-scroll">
      <Link to={'/app/cast/tv/' + tvId}>
        <div className="flex flex-row gap-2 place-items-center text-2xl font-semibold">
          <p>Cast</p>
          <p className="text-xl font-thin">({cast.length})</p>
          <ChevronRight size={32} className="align-baseline" />
        </div>
      </Link>
      <div className="flex flex-row flex-wrap max-w-full gap-4 justify-center lg:justify-start overflow-scroll">
        {topCast.map((actor) => (
          <Link key={actor.id} to={`/app/people/${actor.id}`}>
            <Card
              key={actor.id}
              className="w-36 hover:underline h-full max-h-[300px]"
            >
              {actor.profile_url === '' ? (
                <div className="bg-secondary w-full h-3/5 shadow-md rounded-md" />
              ) : (
                <img
                  src={actor.profile_url}
                  alt={actor.name}
                  width={150}
                  height={192}
                  className="object-cover w-full h-3/5 rounded-md shadow-md"
                />
              )}
              <CardContent className="flex flex-col justify-between p-2 h-2/5">
                <div className="flex flex-col">
                  <p className="text-base font-bold max-h-12 line-clamp-2">
                    {actor.name}
                  </p>
                  <p className="text-sm max-h-2/3 line-clamp-2">
                    {actor.roles[0].character}
                  </p>
                </div>
                <p className="text-sm max-h-2/3 line-clamp-2 font-thin">
                  {actor.roles[0].episode_count} episodes
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
