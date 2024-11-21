import { AuthLayout } from '@/components/layouts/auth-layout';
import { LoginForm } from '@/features/auth/components/login-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

const loginSearchParamsSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute('/auth/login')({
  component: LoginRoute,
  validateSearch: loginSearchParamsSchema,
});

export function LoginRoute() {
  const navigate = useNavigate({ from: '/auth/login' });

  return (
    <AuthLayout title="Log in">
      <LoginForm
        onSuccess={() =>
          navigate({
            to: '/app/dashboard',
          })
        }
      />
    </AuthLayout>
  );
}
