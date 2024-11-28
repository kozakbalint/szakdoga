import { configureAuth } from 'react-query-auth';
import { z } from 'zod';
import {
  GetProfileResponse,
  LoginAuthResponse,
  LogoutResponse,
  User,
} from '@/types/api';
import { apiClient } from './api-client';
import { Navigate, useLocation } from '@tanstack/react-router';

export const loginInputSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
const loginWithEmailAndPassword = async (
  data: LoginInput,
): Promise<User | null> => {
  try {
    const response = (await apiClient.post(
      '/users/authenticate',
      data,
    )) as LoginAuthResponse;
    if (
      response.authentication_token &&
      response.authentication_token.expiry !== undefined
    ) {
      const authString = JSON.stringify(response.authentication_token);
      localStorage.setItem('auth', authString);
    }
    return getUser();
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

const getUser = async (): Promise<User | null> => {
  const auth = localStorage.getItem('auth');
  const authObj = auth ? JSON.parse(auth) : null;
  if (!authObj || !authObj.token || !authObj.expiry) {
    return null;
  }
  const response = (await apiClient.getWithToken(
    '/users/me',
  )) as GetProfileResponse;

  return response.user;
};

const logout = async (): Promise<void> => {
  const response = (await apiClient.getWithToken(
    '/users/logout',
  )) as LogoutResponse;
  localStorage.removeItem('auth');

  if (response.message) {
    return Promise.resolve();
  }

  return Promise.reject('Failed to logout');
};

const authConfig = {
  userFn: getUser,
  loginFn: async (data: LoginInput) => {
    return await loginWithEmailAndPassword(data);
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
    return <Navigate to="/auth/login" search={location.search} replace />;
  }

  return children;
};
