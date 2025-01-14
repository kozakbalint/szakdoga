import { ContentLayout } from '@/components/layouts';
import { MoviesWatchlist } from '@/features/watchlist/components/movies-watchlist';
import { TvWatchlist } from '@/features/watchlist/components/tv-watchlist';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/app/watchlist')({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.data === null) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.pathname },
      });
    }
  },
  component: WatchlistRoute,
});

function WatchlistRoute() {
  return (
    <ContentLayout title="Watchlist" head="Watchlist">
      <div className="flex flex-col gap-2">
        <div className="text-xl">Movies:</div>
        <MoviesWatchlist />
        <div className="text-xl">TV Shows:</div>
        <TvWatchlist />
      </div>
    </ContentLayout>
  );
}
