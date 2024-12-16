import { ContentLayout } from '@/components/layouts';
import { MoviesWatchlist } from '@/features/watchlist/movies/components/watchlist';
import { TVWatchlist } from '@/features/watchlist/tv/components/watchlist';
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
  component: ListsRoute,
});

function ListsRoute() {
  return (
    <div>
      <ContentLayout title="Watchlist" head="Watchlist">
        <div className="flex flex-col gap-2">
          <div className="text-xl">Movies:</div>
          <MoviesWatchlist />
          <div className="text-xl">TV Shows:</div>
          <TVWatchlist />
        </div>
      </ContentLayout>
    </div>
  );
}
