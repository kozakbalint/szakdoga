import { useNavigate } from 'react-router-dom';

import { Head } from '@/components/seo/head';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/auth';

export const LandingRoute = () => {
  const user = useUser();
  const navigate = useNavigate();

  return (
    <>
      <Head title="Welcome to ScreenLog" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to ScreenLog
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          A simple way to log your watched media
        </p>
        <Button
          className="mt-8 bg-slate-700 text-white"
          onClick={() => {
            if (user) {
              navigate('/app');
            } else {
              navigate('/auth/login');
            }
          }}
        >
          Get Started
        </Button>
      </div>
    </>
  );
};
