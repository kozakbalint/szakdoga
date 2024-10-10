import { Link, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';
import { useLogin, loginInputSchema } from '@/lib/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { APIError } from '@/lib/api-client';
import React from 'react';
import { Error } from '@/components/ui/form/error';

type LoginFormProps = {
  onSuccess: () => void;
};

export const description = 'Log in to your account';

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [loginError, setLoginError] = React.useState<string | undefined>();
  const login = useLogin({
    onSuccess,
    onError(error) {
      const err = error as APIError;
      const message = err.response?.error as string;
      setLoginError(message);
    },
  });
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <div>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            onSubmit={(values) => {
              login.mutate(values);
            }}
            schema={loginInputSchema}
          >
            {({ register, formState }) => (
              <>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Input
                      type="email"
                      label="Email"
                      error={formState.errors['email']}
                      registration={register('email')}
                      onChange={() => setLoginError(undefined)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Input
                      type="password"
                      label="Password"
                      error={formState.errors['password']}
                      registration={register('password')}
                      onChange={() => setLoginError(undefined)}
                    />
                    <Error errorMessage={loginError} />
                  </div>
                  <div>
                    <Button
                      isLoading={login.isPending}
                      type="submit"
                      className="w-full"
                    >
                      Log in
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Form>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm">Don&apos;t have an account? </div>
            <Link
              to={`/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
            >
              <Button variant="link">Register</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
