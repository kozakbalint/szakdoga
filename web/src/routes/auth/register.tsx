import { AuthLayout } from '@/components/layouts/auth-layout';
import { RegisterForm } from '@/features/auth/components/register-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

const registerSearchParamsSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute('/auth/register')({
  component: RegisterRoute,
  validateSearch: registerSearchParamsSchema,
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
