import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useGetWatchlist } from '../api/get-watchlist';
import { Star } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const TvWatchlist = () => {
  const watchlistQuery = useGetWatchlist({});
  if (watchlistQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const tv = watchlistQuery.data?.watchlist.tv;
  if (!tv) {
    return 'No TV shows in watchlist';
  }
  return (
    <div className="flex flex-row flex-wrap gap-2 justify-center lg:justify-start w-full">
      {tv.map((tv) => (
        <Link
          to={`/app/tv/${tv.id}`}
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
