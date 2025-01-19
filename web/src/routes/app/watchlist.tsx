import { WatchlistLayout } from '@/components/layouts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoviesWatchlist } from '@/features/watchlist/components/watchlist-movies';
import { TvWatchlist } from '@/features/watchlist/components/watchlist-tv';
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
    <WatchlistLayout title="Watchlist:" head="Watchlist">
      <Tabs defaultValue="movies">
        <TabsList>
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="tv">TV Shows</TabsTrigger>
        </TabsList>
        <TabsContent value="movies">
          <MoviesWatchlist />
        </TabsContent>
        <TabsContent value="tv">
          <TvWatchlist />
        </TabsContent>
      </Tabs>
    </WatchlistLayout>
  );
}
