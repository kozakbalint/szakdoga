import { AuthLayout } from '@/components/layouts/auth-layout';
import { LoginForm } from '@/features/users/components/login-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/login')({
  component: LoginRoute,
});

export function LoginRoute() {
  const navigate = useNavigate({ from: '/auth/login' });

  return (
    <AuthLayout title="Log in">
      <LoginForm
        onSuccess={() => {
          navigate({
            to: '/app/dashboard',
          });
        }}
      />
    </AuthLayout>
  );
}
