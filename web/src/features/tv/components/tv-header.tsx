import { Button } from '@/components/ui/button';
import { Heart, Star } from 'lucide-react';
import { useGetTvById } from '../api/get-tv-by-id';
import { Badge } from '@/components/ui/badge';
import { TvWatchProvider } from './tv-watch-provider';
import { Link } from '@tanstack/react-router';
import { useAddTVToWatchlist } from '@/features/watchlist/tv/api/add-tv-to-watchlist';
import { useGetTVWatchlist } from '@/features/watchlist/tv/api/get-tv-watchlist';
import { useRemoveTVFromWatchlist } from '@/features/watchlist/tv/api/remove-movie-from-watchlist';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TvWatched } from './tv-watched';
import { useGetTvShowWatchedDates } from '@/features/watched/tv/api/get-tv-show-watched-dates';

export const TvHeader = ({ tvId }: { tvId: string }) => {
  const tvQuery = useGetTvById({ id: tvId });
  const watchlistQuery = useGetTVWatchlist({});
  const addTvToWatchlistMutation = useAddTVToWatchlist();
  const removeTvFromWatchlistMutation = useRemoveTVFromWatchlist();
  const watchedDatesQuery = useGetTvShowWatchedDates({ id: tvId });

  if (
    tvQuery.isLoading ||
    watchlistQuery.isLoading ||
    watchedDatesQuery.isLoading
  ) {
    return <div>Loading...</div>;
  }

  const tv = tvQuery.data?.tv;
  const watchlist = watchlistQuery.data?.watchlist;
  const watchdates = watchedDatesQuery.data?.watched_dates || [];
  const onWatchlist = watchlist?.find((m) => m.tv_show.tmdb_id === tv?.id);

  if (!tv) {
    return '';
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-4">
      <div className="flex flex-col sm:flex-row w-full lg:w-4/5 gap-4">
        <div className="flex w-full sm:w-1/3 justify-center content-center">
          <img
            src={tv.poster_url}
            alt={tv.name}
            className="rounded-md shadow object-center w-3/5 sm:w-full"
          />
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-2/3 max-h-fit overflow-scroll">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-bold text-pretty">{tv.name}</div>
            <div className="flex flex-row items-start gap-4">
              <div className="text-xl font-thin">
                ({tv.first_air_date.slice(0, 4)})
              </div>
              <div className="flex text-xl lg:pr-4 font-thin self-start items-center flex-grow sm:justify-end gap-1">
                <Star fill="gold" stroke="black" />
                {Math.fround(tv.vote_average).toFixed(1)}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {tv.genres.map((genre) => (
              <Link key={genre.id} to={`/app/categories/${genre.id}`}>
                <Badge key={genre.id} className="cursor-pointer">
                  {genre.name}
                </Badge>
              </Link>
            ))}
          </div>
          <div className="text-justify lg:pr-4 overflow-scroll">
            {tv.overview}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full lg:w-1/5 lg:justify-between">
        <div className="flex gap-2">
          <div>
            {onWatchlist ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      removeTvFromWatchlistMutation.mutate({
                        id: onWatchlist?.id,
                      });
                    }}
                    disabled={removeTvFromWatchlistMutation.isPending}
                    className="flex items-center"
                    size={'icon'}
                    variant={'outline'}
                  >
                    <Heart fill="red" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Remove from watchlist
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      addTvToWatchlistMutation.mutate({ tmdb_id: tv.id });
                    }}
                    disabled={addTvToWatchlistMutation.isPending}
                    className="flex items-center"
                    size={'icon'}
                    variant={'outline'}
                  >
                    <Heart fill="none" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Add to watchlist</TooltipContent>
              </Tooltip>
            )}
          </div>
          <div>
            <TvWatched tvID={tvId} watchedDates={watchdates} />
          </div>
        </div>
        <div>
          <TvWatchProvider tvId={tvId} type="streming" />
        </div>
      </div>
    </div>
  );
};
