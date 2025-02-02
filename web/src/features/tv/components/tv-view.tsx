import { SuspenseTvHeader, TvHeader, TvHeaderData } from './tv-header';
import { SuspenseTvSeasons, TvSeasons } from './tv-seasons';
import { NextEpisode } from './tv-next-episode';
import { getTvDetailsQueryOptions } from '../api/get-tv-details';
import { useSuspenseQueries } from '@tanstack/react-query';
import { isTvOnWatchlistQueryOptions } from '@/features/watchlist/api/is-tv-on-watchlist';
import { getTvWatchProvidersQueryOptions } from '@/features/watchproviders/api/get-tv-watch-providers';
import { getTvCastQueryOptions } from '@/features/cast/api/get-tv-cast';
import { SuspenseTopCast, TopCast } from '@/features/cast/components/top-cast';
import { isTvOnWatchedQueryOptions } from '@/features/watched/api/is-tv-on-watched';
import { getTvSeasonDetailsQueryOptions } from '../api/get-tv-season-details';
import { Head } from '@/components/seo';

export const TvView = ({ tvId }: { tvId: string }) => {
  const queries = useSuspenseQueries({
    queries: [
      getTvDetailsQueryOptions({ id: tvId }),
      isTvOnWatchlistQueryOptions({ id: tvId }),
      getTvWatchProvidersQueryOptions({ id: tvId }),
      getTvCastQueryOptions({ id: tvId }),
      isTvOnWatchedQueryOptions({ id: tvId }),
      getTvSeasonDetailsQueryOptions({ id: tvId, seasonId: '1' }),
    ],
  });

  const headerData: TvHeaderData = {
    tvDetails: queries[0].data.tv,
    onWatchlist: queries[1].data.in_watchlist,
    watchproviders: queries[2].data.watch_providers,
  };

  return (
    <div className="flex flex-col gap-8">
      <Head title={queries[0].data.tv.name} />
      <TvHeader tvId={tvId} data={headerData} />
      <NextEpisode tvId={tvId} data={queries[4].data.watched_tv} />
      <TopCast id={tvId} isTv={true} data={queries[3].data.cast} />
      <TvSeasons tvId={tvId} data={queries[0].data.tv} />
    </div>
  );
};

export const SuspenseTvView = () => {
  return (
    <div className="flex flex-col gap-8">
      <SuspenseTvHeader />
      <SuspenseTopCast />
      <SuspenseTvSeasons />
    </div>
  );
};
