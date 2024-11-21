import { ContentLayout } from '@/components/layouts';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/app/lists')({
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
      <ContentLayout title="Lists" head="Lists">
        <h1>Lists</h1>
      </ContentLayout>
    </div>
  );
}
