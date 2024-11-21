import { ContentLayout } from '@/components/layouts';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/app/settings')({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.data === null) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.pathname },
      });
    }
  },
  component: SettingsRoute,
});

function SettingsRoute() {
  return (
    <ContentLayout title="Settings" head="Settings">
      Settings
    </ContentLayout>
  );
}
