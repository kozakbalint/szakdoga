import { ContentLayout } from '@/components/layouts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetUserStats } from '@/features/users/api/get-user-stats';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Film, PlayCircle, Tv } from 'lucide-react';

export const Route = createFileRoute('/app/dashboard')({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.data === null) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.pathname },
      });
    }
  },
  component: DashboardRoute,
});

function DashboardRoute() {
  const userStatsQuery = useGetUserStats({});

  if (userStatsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const userStats = userStatsQuery.data.user_stats;

  return (
    <div>
      <ContentLayout title="Dashboard" head="Dashboard">
        <div className="flex gap-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Movies Watched
              </CardTitle>
              <Film className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userStats.watched_movies}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                TV Episodes Watched
              </CardTitle>
              <Tv className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userStats.watched_episodes}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Watchlist Items
              </CardTitle>
              <PlayCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userStats.watchlist_count}
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentLayout>
    </div>
  );
}
