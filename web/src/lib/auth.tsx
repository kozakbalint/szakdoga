import { configureAuth } from 'react-query-auth';
import { Navigate, useLocation } from 'react-router-dom';
import { z } from 'zod';

import { LoginAuthResponse, User } from '@/types/api';

import { apiClient } from './api-client';

const getUser = async (): Promise<User | void | null> => {
  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    return null;
  }
  const response = (await apiClient.getWithToken('/users/me', jwt)) as {
    user: User;
  };

  return response.user;
};

const logout = (): Promise<void> => {
  localStorage.removeItem('jwt');
  return Promise.resolve();
};

export const loginInputSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  password: z.string(),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
const loginWithEmailAndPassword = async (
  data: LoginInput,
): Promise<LoginAuthResponse> => {
  try {
    const response = (await apiClient.post(
      '/tokens/authentication',
      data,
    )) as LoginAuthResponse;
    if (response.login.authentication_token !== undefined) {
      localStorage.setItem('jwt', response.login.authentication_token);
    }
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const registerInputSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

const registerWithEmailAndPassword = async (
  data: RegisterInput,
): Promise<null> => {
  try {
    await apiClient.post('/users', data);
    return null;
  } catch (error) {
    return Promise.reject(error);
  }
};

const authConfig = {
  userFn: getUser,
  loginFn: async (data: LoginInput) => {
    const response = await loginWithEmailAndPassword(data);
    return response.login.user;
  },
  registerFn: async (data: RegisterInput) => {
    return await registerWithEmailAndPassword(data);
  },
  logoutFn: logout,
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const location = useLocation();

  if (!user.data) {
    return (
      <Navigate
        to={`/auth/login?redirectTo=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
};
