import { ContentLayout } from '@/components/layouts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoviesWatched } from '@/features/watched/components/watched-movies';
import { TvWatched } from '@/features/watched/components/watched-tv';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/app/watched')({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.data === null) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.pathname },
      });
    }
  },
  component: WatchedRoute,
});

function WatchedRoute() {
  return (
    <ContentLayout title="Watched" head="Watched">
      <Tabs defaultValue="movies">
        <TabsList>
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="tv">TV Shows</TabsTrigger>
        </TabsList>
        <TabsContent value="movies">
          <MoviesWatched />
        </TabsContent>
        <TabsContent value="tv">
          <TvWatched />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}
