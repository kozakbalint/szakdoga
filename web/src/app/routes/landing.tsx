import { useNavigate } from 'react-router-dom';

import { Head } from '@/components/seo/head';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/auth';

export const LandingRoute = () => {
  const user = useUser();
  const navigate = useNavigate();

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
          <Button
            variant={'default'}
            onClick={() =>
              user ? navigate('./app') : navigate('./auth/login')
            }
            icon={<Home />}
          >
            Go to Dashboard
          </Button>
          <Button
            variant={'secondary'}
            onClick={() =>
              user ? navigate('./app') : navigate('./auth/register')
            }
          >
            Register
          </Button>
        </div>
      </div>
    </>
  );
};
