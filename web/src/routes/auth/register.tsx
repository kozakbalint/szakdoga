import { AuthLayout } from '@/components/layouts/auth-layout';
import { RegisterForm } from '@/features/auth/components/register-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/register')({
  component: RegisterRoute,
});

function RegisterRoute() {
  const navigate = useNavigate();

  return (
    <AuthLayout title="Register">
      <RegisterForm
        onSuccess={() =>
          navigate({
            to: '/app/dashboard',
          })
        }
      />
    </AuthLayout>
  );
}
