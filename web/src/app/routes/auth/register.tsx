import { useNavigate } from 'react-router-dom';

import { AuthLayout } from '@/components/layouts/auth-layout';
import { RegisterForm } from '@/features/auth/components/register-form';

export const RegisterRoute = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout title="Register">
      <RegisterForm
        onSuccess={() =>
          navigate('/auth/login', {
            replace: true,
          })
        }
      />
    </AuthLayout>
  );
};
