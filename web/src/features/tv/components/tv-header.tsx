import { Badge } from '@/components/ui/badge';
import { WatchedToggle } from '@/components/ui/watchedtoggle';
import { WatchlistToggle } from '@/components/ui/watchlisttoggle';
import { WatchProvider } from '@/components/ui/watchprovider';
import { useAddTvToWatched } from '@/features/watched/api/add-tv-to-watched';
import { useIsTvOnWatched } from '@/features/watched/api/is-tv-on-watched';
import { useRemoveTvFromWatched } from '@/features/watched/api/remove-tv-from-watched';
import { useAddTvToWatchlist } from '@/features/watchlist/api/add-tv-to-watchlist';
import { useIsTvOnWatchlist } from '@/features/watchlist/api/is-tv-on-watchlist';
import { useRemoveTvFromWatchlist } from '@/features/watchlist/api/remove-tv-from-watchlist';
import { useGetTvWatchProviders } from '@/features/watchproviders/api/get-tv-watch-providers';
import { WatchedTvStatus } from '@/types/types.gen';
import { Star } from 'lucide-react';
import { useGetTvDetails } from '../api/get-tv-details';

export const TvHeader = ({ tvId }: { tvId: string }) => {
  const tvQuery = useGetTvDetails({ id: tvId });
  const isOnWatchlistQuery = useIsTvOnWatchlist({ id: tvId });
  const watchedQuery = useIsTvOnWatched({ id: tvId });
  const watchproviderQuery = useGetTvWatchProviders({ id: tvId });
  const addTvToWatchlistMutation = useAddTvToWatchlist({ id: tvId });
  const removeTvFromWatchlistMutation = useRemoveTvFromWatchlist({ id: tvId });
  const addTvToWatchedMutation = useAddTvToWatched({ id: tvId });
  const removeTvFromWatchedMutation = useRemoveTvFromWatched({ id: tvId });

  if (
    tvQuery.isLoading ||
    isOnWatchlistQuery.isLoading ||
    watchedQuery.isLoading ||
    watchproviderQuery.isLoading
  ) {
    return <div>Loading...</div>;
  }

  const tv = tvQuery.data?.tv;
  const isOnWatchlist = isOnWatchlistQuery.data?.in_watchlist;
  const watchedData = watchedQuery.data?.watched_tv;
  const watchProviderData = watchproviderQuery.data?.watch_providers;
  let isOnWatched = false;
  if (!watchedData || watchedData.status === WatchedTvStatus.not_watched) {
    isOnWatched = false;
  } else {
    isOnWatched = true;
  }

  if (
    !tv ||
    !watchProviderData ||
    isOnWatched === undefined ||
    isOnWatchlist === undefined
  ) {
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
            <WatchlistToggle
              id={tvId}
              type="TV"
              isOnWatchlist={isOnWatchlist}
              addMutatuion={addTvToWatchlistMutation}
              removeMutation={removeTvFromWatchlistMutation}
            />
          </div>
          <div>
            <WatchedToggle
              id={tvId}
              type="TV"
              isOnWatched={isOnWatched}
              addMutation={addTvToWatchedMutation}
              removeMutation={removeTvFromWatchedMutation}
            />
          </div>
        </div>
        <div>
          <WatchProvider watchproviders={watchProviderData} />
        </div>
      </div>
    </div>
  );
};
