import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useGetTvShowWatched } from '../api/get-tv-show-watched';

export const TvWatched = () => {
  const watchedTvQuery = useGetTvShowWatched({});
  if (watchedTvQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const watchedTv = watchedTvQuery.data?.watched_tv_shows;
  if (!watchedTv) {
    return 'No tv shows in watched list';
  }

  return (
    <div className="flex flex-row flex-wrap gap-2 justify-center lg:justify-start w-full">
      {watchedTv.map((tv) => (
        <Link
          to={`/app/tv/${tv.tmdb_id}`}
          key={tv.id}
          className="hover:underline w-2/5 md:w-1/3 lg:w-1/6"
        >
          <Card key={tv.id}>
            <CardHeader className="p-0">
              <img
                src={tv.poster_url}
                alt={tv.title}
                className="w-full rounded-xl"
              />
            </CardHeader>
            <CardContent className="flex flex-col py-4 px-2">
              <div className="text-base font-bold line-clamp-1">{tv.title}</div>
              <div className="text-sm">{tv.release_date.slice(0, 4)}</div>
              <div className="text-md flex flex-row">
                <Star fill="gold" stroke="black" />
                {Math.fround(tv.vote_average).toFixed(1)}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
