import { ContentLayout } from '@/components/layouts';
import { DashboardStats } from '@/features/dashboard/components/stats';
import { useGetUserStats } from '@/features/users/api/get-user-stats';
import { createFileRoute, redirect } from '@tanstack/react-router';

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
        <div className="flex flex-col gap-4">
          <DashboardStats data={userStats} />
        </div>
      </ContentLayout>
    </div>
  );
}
