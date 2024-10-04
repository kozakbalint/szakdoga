import { ContentLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/lib/auth';

export const DashboardRoute = () => {
  const onSuccess = () => {
    // Handle successful logout, e.g., redirect to login page
    console.log('Logout successful');
    window.location.href = '/auth/login';
  };

  const logout = useLogout({ onSuccess });

  return (
    <ContentLayout title="Dashboard">
      <h1>Dashboard</h1>
      <Button
        onClick={() => {
          logout.mutate(onSuccess);
        }}
        className="bg-slate-800 text-white"
      >
        Logout
      </Button>
    </ContentLayout>
  );
};
