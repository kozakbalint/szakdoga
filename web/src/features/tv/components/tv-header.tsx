import { Badge } from '@/components/ui/badge';
import {
  SuspenseWatchedToggle,
  TvWatchedToggle,
} from '@/features/watched/components/watchedtoggle';
import {
  SuspenseWatchlistToggle,
  WatchlistToggle,
} from '@/features/watchlist/components/watchlisttoggle';
import {
  SuspenseWatchProvider,
  WatchProvider,
} from '@/features/watchproviders/components/watchprovider';
import { useAddTvToWatchlist } from '@/features/watchlist/api/add-tv-to-watchlist';
import { useRemoveTvFromWatchlist } from '@/features/watchlist/api/remove-tv-from-watchlist';
import { TvDetails, WatchProviders } from '@/types/types.gen';
import { Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export type TvHeaderData = {
  tvDetails: TvDetails;
  onWatchlist: boolean;
  watchproviders: WatchProviders;
};

export const TvHeader = ({
  tvId,
  data,
}: {
  tvId: string;
  data: TvHeaderData;
}) => {
  const addTvToWatchlistMutation = useAddTvToWatchlist({ id: tvId });
  const removeTvFromWatchlistMutation = useRemoveTvFromWatchlist({ id: tvId });

  const tv = data.tvDetails;
  const isOnWatchlist = data.onWatchlist;
  const watchProviderData = data.watchproviders;

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-4">
      <div className="flex flex-col sm:flex-row w-full lg:w-4/5 gap-4">
        <div className="flex w-full sm:w-1/3 justify-center content-center">
          {tv.poster_url === '' ? (
            <Skeleton className="rounded-md object-center w-3/5 min-h-100 h-full sm:w-full grow" />
          ) : (
            <img
              src={tv.poster_url}
              alt={tv.name}
              className="rounded-md shadow-sm object-center w-3/5 sm:w-full"
            />
          )}
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-2/3 max-h-fit overflow-scroll">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-bold text-pretty">{tv.name}</div>
            <div className="flex flex-row items-start gap-4">
              <div className="text-xl font-thin">
                ({tv.first_air_date.slice(0, 4)})
              </div>
              <div className="flex text-xl lg:pr-4 font-thin self-start items-center grow sm:justify-end gap-1">
                <Star fill="gold" stroke="black" />
                {Math.fround(tv.vote_average).toFixed(1)}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {tv.genres.map((genre) => (
              <Badge
                key={genre}
                variant="default"
                className="pointer-events-none"
              >
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
            <WatchlistToggle
              id={tvId}
              type="TV"
              isOnWatchlist={isOnWatchlist}
              addMutatuion={addTvToWatchlistMutation}
              removeMutation={removeTvFromWatchlistMutation}
            />
          </div>
          <div>
            <TvWatchedToggle id={tvId} />
          </div>
        </div>
        <div>
          <WatchProvider watchproviders={watchProviderData} />
        </div>
      </div>
    </div>
  );
};

export const SuspenseTvHeader = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-4">
      <div className="flex flex-col sm:flex-row w-full lg:w-4/5 gap-4">
        <div className="flex w-full sm:w-1/3 justify-center content-center">
          <Skeleton className="rounded-md object-center w-3/5 min-h-100 h-full sm:w-full grow" />
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-2/3 max-h-fit overflow-scroll">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-bold text-pretty">
              <Skeleton className="w-60 h-6" />
            </div>
            <div className="flex flex-row items-start gap-4">
              <div className="text-xl font-thin">
                <Skeleton className="w-20 h-5" />
              </div>
              <div className="flex text-xl lg:pr-4 font-thin self-start items-center grow sm:justify-end gap-1">
                <Star fill="gold" stroke="black" />
                <Skeleton className="w-10 h-5" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, index) => (
              <Badge
                key={index}
                variant="default"
                className="pointer-events-none"
              >
                <Skeleton key={index} className="w-20 h-3" />
              </Badge>
            ))}
          </div>
          <div className="text-justify lg:pr-4 overflow-scroll flex flex-col gap-2">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="w-full h-4" />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full lg:w-1/5 lg:justify-between">
        <div className="flex gap-2">
          <div>
            <SuspenseWatchlistToggle />
          </div>
          <div>
            <SuspenseWatchedToggle />
          </div>
        </div>
        <div>
          <SuspenseWatchProvider />
        </div>
      </div>
    </div>
  );
};
