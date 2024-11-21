import { ContentLayout } from '@/components/layouts';
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
  return (
    <div>
      <ContentLayout title="Dashboard" head="Dashboard">
        <h1>Dashboard</h1>
      </ContentLayout>
    </div>
  );
}
