import { ContentLayout } from '@/components/layouts';
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
      <div className="flex flex-col gap-2">
        <div className="text-xl">Movies:</div>
        <div className="text-xl">TV Shows:</div>
      </div>
    </ContentLayout>
  );
}
