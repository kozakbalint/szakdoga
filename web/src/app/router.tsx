import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  //LoaderFunctionArgs,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import { ProtectedRoute } from '@/lib/auth';

import { AppRoot } from './routes/app/root';
import { paths } from '@/config/paths';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: async () => {
        const { LandingRoute } = await import('./routes/landing');
        return { Component: LandingRoute };
      },
    },
    {
      path: paths.auth.register.path,
      lazy: async () => {
        const { RegisterRoute } = await import('./routes/auth/register');
        return { Component: RegisterRoute };
      },
    },
    {
      path: paths.auth.login.path,
      lazy: async () => {
        const { LoginRoute } = await import('./routes/auth/login');
        return { Component: LoginRoute };
      },
    },
    {
      path: paths.app.root.path,
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      children: [
        {
          path: paths.app.dashboard.path,
          lazy: async () => {
            const { DashboardRoute } = await import('./routes/app/dashboard');
            return { Component: DashboardRoute };
          },
        },
        {
          path: paths.app.movie.path,
          lazy: async () => {
            const { MovieRoute, movieLoader } = await import(
              './routes/app/movies/movie'
            );
            return { Component: MovieRoute, loader: movieLoader };
          },
        },
        {
          path: paths.app.tv.path,
          lazy: async () => {
            const { TvRoute, tvLoader } = await import('./routes/app/tv/tv');
            return { Component: TvRoute, loader: tvLoader };
          },
        },
        {
          path: paths.app.person.path,
          lazy: async () => {
            const { PersonRoute, personLoader } = await import(
              './routes/app/people/person'
            );
            return { Component: PersonRoute, loader: personLoader };
          },
        },
        {
          path: paths.app.categoris.path,
          lazy: async () => {
            const { CategoriesRoute } = await import(
              './routes/app/categories/categories'
            );
            return { Component: CategoriesRoute };
          },
        },
        {
          path: paths.app.cast.movie.path,
          lazy: async () => {
            const { CastRoute } = await import('./routes/app/cast/movie/cast');
            return { Component: CastRoute };
          },
        },
        {
          path: paths.app.cast.tv.path,
          lazy: async () => {
            const { CastRoute } = await import('./routes/app/cast/tv/cast');
            return { Component: CastRoute };
          },
        },
        {
          path: paths.app.tv.seasons.path,
          lazy: async () => {
            const { SeasonsRoute, seasonsLoader } = await import(
              './routes/app/tv/seasons/seasons'
            );
            return { Component: SeasonsRoute, loader: seasonsLoader };
          },
        },
        {
          path: paths.app.tv.season.path,
          lazy: async () => {
            const { SeasonRoute, seasonLoader } = await import(
              './routes/app/tv/seasons/season'
            );
            return { Component: SeasonRoute, loader: seasonLoader };
          },
        },
        {
          path: paths.app.tv.episode.path,
          lazy: async () => {
            const { EpisodeRoute, episodeLoader } = await import(
              './routes/app/tv/episode/episode'
            );
            return { Component: EpisodeRoute, loader: episodeLoader };
          },
        },
        {
          path: paths.app.profile.path,
          lazy: async () => {
            const { ProfileRoute } = await import('./routes/app/profile');
            return { Component: ProfileRoute };
          },
        },
        {
          path: paths.app.settings.path,
          lazy: async () => {
            const { SettingsRoute } = await import('./routes/app/settings');
            return { Component: SettingsRoute };
          },
        },
        {
          path: paths.app.lists.path,
          lazy: async () => {
            const { ListsRoute } = await import('./routes/app/lists');
            return { Component: ListsRoute };
          },
        },
      ],
    },
    {
      path: '*',
      lazy: async () => {
        const { NotFoundRoute } = await import('./routes/not-found');
        return { Component: NotFoundRoute };
      },
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
