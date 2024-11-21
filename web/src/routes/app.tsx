import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { DashboardLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
} from '@tanstack/react-router';

export const Route = createFileRoute('/app')({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.data === null) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.pathname },
      });
    }
  },
  component: AppRoot,
});

function AppRoot() {
  const location = useLocation();
  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="flex size-full items-center justify-center">
            <Spinner size="xl" />
          </div>
        }
      >
        <ErrorBoundary
          key={location.pathname}
          fallback={<div>Something went wrong!</div>}
        >
          <Outlet />
        </ErrorBoundary>
      </Suspense>
    </DashboardLayout>
  );
}
