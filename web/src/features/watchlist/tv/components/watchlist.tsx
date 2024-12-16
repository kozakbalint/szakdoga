import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useGetTVWatchlist } from '../api/get-tv-watchlist';
import { Star } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const TVWatchlist = () => {
  const watchlistQuery = useGetTVWatchlist({});
  if (watchlistQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const watchlist = watchlistQuery.data?.watchlist;
  if (!watchlist) {
    return 'No TV shows in watchlist';
  }
  return (
    <div className="flex flex-row flex-wrap gap-2 justify-center lg:justify-start w-full">
      {watchlist.map((tv) => (
        <Link
          to={`/app/tv/${tv.tv_show.tmdb_id}`}
          key={tv.tv_show.id}
          className="hover:underline w-2/5 md:w-1/3 lg:w-1/6"
        >
          <Card key={tv.tv_show.id}>
            <CardHeader className="p-0">
              <img
                src={tv.tv_show.poster_url}
                alt={tv.tv_show.title}
                className="w-full rounded-xl"
              />
            </CardHeader>
            <CardContent className="flex flex-col py-4 px-2">
              <div className="text-base font-bold line-clamp-1">
                {tv.tv_show.title}
              </div>
              <div className="text-sm">
                {tv.tv_show.release_date.slice(0, 4)}
              </div>
              <div className="text-md flex flex-row">
                <Star fill="gold" stroke="black" />
                {Math.fround(tv.tv_show.vote_average).toFixed(1)}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
