import { Button } from '@/components/ui/button';
import { Heart, Star } from 'lucide-react';
import { useGetTvDetails } from '../api/get-tv-details';
import { Badge } from '@/components/ui/badge';
import { TvWatchProvider } from '@/features/watchproviders/components/tv-watch-provider';
import { useAddTvToWatchlist } from '@/features/watchlist/api/add-tv-to-watchlist';
import { useIsTvOnWatchlist } from '@/features/watchlist/api/is-tv-on-watchlist';
import { useRemoveTvFromWatchlist } from '@/features/watchlist/api/remove-tv-from-watchlist';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TvWatched } from './tv-watched';
import { useGetTvShowWatchedDates } from '@/features/watched/tv/api/get-tv-show-watched-dates';

export const TvHeader = ({ tvId }: { tvId: string }) => {
  const tvQuery = useGetTvDetails({ id: tvId });
  const isOnWatchlistQuery = useIsTvOnWatchlist({ id: tvId });
  const addTvToWatchlistMutation = useAddTvToWatchlist({ id: tvId });
  const removeTvFromWatchlistMutation = useRemoveTvFromWatchlist({ id: tvId });
  const watchedDatesQuery = useGetTvShowWatchedDates({ id: tvId });

  if (
    tvQuery.isLoading ||
    isOnWatchlistQuery.isLoading ||
    watchedDatesQuery.isLoading
  ) {
    return <div>Loading...</div>;
  }

  const tv = tvQuery.data?.tv;
  const isOnWatchlist = isOnWatchlistQuery.data?.in_watchlist;
  const watchdates = watchedDatesQuery.data?.watched_dates || [];

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
              <Badge key={genre} className="cursor-pointer">
                {genre}
              </Badge>
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
            {isOnWatchlist ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      removeTvFromWatchlistMutation.mutate(tvId);
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
                      addTvToWatchlistMutation.mutate(tvId);
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
          <TvWatchProvider tvId={tvId} />
        </div>
      </div>
    </div>
  );
};
