import { ContentLayout } from '@/components/layouts';
import { useUser } from '@/lib/auth';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { format } from 'date-fns';

export const Route = createFileRoute('/app/profile')({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.data === null) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.pathname },
      });
    }
  },
  component: ProfileRoute,
});

function ProfileRoute() {
  const user = useUser();
  const formattedDate = user.data?.createdAt
    ? format(new Date(user.data.createdAt), 'yyyy-MM-dd HH:mm:ss')
    : 'N/A';
  return (
    <div>
      <ContentLayout title="Profile" head="Profile">
        <h2 className="text-xl font-medium">Email</h2>
        <p className="font-mono">{user.data?.email}</p>
        <h2 className="text-xl font-medium">Name</h2>
        <p className="font-mono">{user.data?.name}</p>
        <h2 className="text-xl font-medium">Id</h2>
        <p className="font-mono">{user.data?.id}</p>
        <h2 className="text-xl font-medium">Created At</h2>
        <p className="font-mono">{formattedDate}</p>
      </ContentLayout>
    </div>
  );
}
