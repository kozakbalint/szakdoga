import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';
import { useLogin, loginInputSchema } from '@/lib/auth';
import { APIError } from '@/lib/api-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Error } from '@/components/ui/form/error';
import { getRouteApi, Link } from '@tanstack/react-router';

type LoginFormProps = {
  onSuccess: () => void;
};

export const description = 'Log in to your account';

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [loginError, setLoginError] = React.useState<string | undefined>();
  const login = useLogin({
    onSuccess() {
      onSuccess();
      setLoginError(undefined);
    },
    onError(error) {
      const err = error as APIError;
      const message =
        typeof err.response?.error === 'string'
          ? err.response.error
          : undefined;
      setLoginError(message ?? 'Failed to log in');
    },
  });
  const routeApi = getRouteApi('/auth/login');
  const search = routeApi.useSearch();

  return (
    <div>
      <Card className="mx-auto max-w-sm bg-primary-foreground">
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
            options={{
              shouldUnregister: true,
            }}
          >
            {({ register, formState, setValue }) => (
              <>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Input
                      type="email"
                      label="Email"
                      error={formState.errors['email']}
                      registration={register('email')}
                      onChange={(e) => {
                        setLoginError(undefined);
                        setValue('email', e.target.value);
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Input
                      type="password"
                      label="Password"
                      error={formState.errors['password']}
                      registration={register('password')}
                      onChange={(e) => {
                        setLoginError(undefined);
                        setValue('password', e.target.value);
                      }}
                    />
                    <Error errorMessage={loginError} />
                  </div>
                  <div>
                    <Button
                      isLoading={login.isPending}
                      type="submit"
                      className="w-full"
                      variant={'default'}
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
              to="/auth/register"
              search={(prev) => ({ ...prev, redirect: search.redirect })}
            >
              <Button variant="link">Register</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
