import { Head } from '@/components/seo/head';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/auth';
import { createLazyFileRoute, Link } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: LandingRoute,
});

function LandingRoute() {
  const user = useUser();
  return (
    <>
      <Head title="Welcome to ScreenLog" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
        <h1 className="text-3xl font-bold text-primary">
          Welcome to ScreenLog
        </h1>
        <p className="mt-4 text-lg sm:text-sm text-center text-primary">
          A simple way to log your watched movies and TV shows.
        </p>
        <div className="flex mt-8 space-x-4">
          <Link
            to={user.data ? '/app/dashboard' : '/auth/login'}
            resetScroll={true}
          >
            <Button variant={'default'} icon={<Home />}>
              Go to Dashboard
            </Button>
          </Link>
          <Link
            to={user.data ? '/app/dashboard' : '/auth/register'}
            resetScroll={true}
          >
            <Button variant={'secondary'} icon={<Home />}>
              Register
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
