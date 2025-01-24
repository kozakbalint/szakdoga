import * as React from 'react';
import { useEffect } from 'react';

import { Head } from '@/components/seo';
import { useUser } from '@/lib/auth';
import { Link, useNavigate } from '@tanstack/react-router';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const AuthLayout = ({ children, title }: LayoutProps) => {
  const user = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (user.data) {
      navigate({ to: '/app/dashboard', replace: true });
    }
  }, [user.data, navigate]);

  return (
    <>
      <Head title={title} />
      <div className="flex min-h-screen flex-col justify-center bg-background sm:px-6 lg:px-8">
        <div className="pt-6">
          <Link to="/" className="text-primary text-3xl p-6">
            Screenlog
          </Link>
        </div>
        <div className="flex flex-col grow justify-center">{children}</div>
      </div>
    </>
  );
};
