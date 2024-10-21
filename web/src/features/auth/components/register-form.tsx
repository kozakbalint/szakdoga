import * as React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';
import { useRegister, registerInputSchema } from '@/lib/auth';
import { APIError } from '@/lib/api-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Error } from '@/components/ui/form/error';

type RegisterFormProps = {
  onSuccess: () => void;
};

export const description = 'Register for an account';

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [registerError, setRegisterError] = React.useState<
    string | undefined
  >();
  const registering = useRegister({
    onSuccess() {
      onSuccess();
      setRegisterError(undefined);
    },
    onError(error) {
      const err = error as APIError;
      const message =
        typeof err.response?.error === 'object'
          ? err.response?.error?.email
          : undefined;
      setRegisterError(message ?? 'Failed to register');
    },
  });
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <div>
      <Card className="mx-auto max-w-sm bg-primary-foreground">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            onSubmit={(values) => {
              registering.mutate(values);
            }}
            schema={registerInputSchema}
            options={{
              shouldUnregister: true,
            }}
          >
            {({ register, formState, setValue }) => (
              <>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Input
                      type="text"
                      label="Name"
                      error={formState.errors['name']}
                      registration={register('name')}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Input
                      type="email"
                      label="Email Address"
                      error={formState.errors['email']}
                      registration={register('email')}
                      onChange={(e) => {
                        setRegisterError(undefined);
                        setValue('email', e.target.value);
                      }}
                    />
                    <Error errorMessage={registerError} />
                  </div>
                  <div className="grid gap-2">
                    <Input
                      type="password"
                      label="Password"
                      error={formState.errors['password']}
                      registration={register('password')}
                    />
                  </div>
                  <div>
                    <Button
                      isLoading={registering.isPending}
                      type="submit"
                      className="w-full"
                      variant={'default'}
                    >
                      Register
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Form>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm">Already have an account? </div>
            <Link
              to={`/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
            >
              <Button variant="link">Login</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
