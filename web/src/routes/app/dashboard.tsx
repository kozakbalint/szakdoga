import { ContentLayout } from '@/components/layouts';
import {
  DashboardStats,
  SuspenseDashboardStats,
} from '@/features/dashboard/components/stats';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Suspense } from 'react';

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
        <div className="flex flex-col gap-4">
          <Suspense fallback={<SuspenseDashboardStats />}>
            <DashboardStats />
          </Suspense>
        </div>
      </ContentLayout>
    </div>
  );
}
