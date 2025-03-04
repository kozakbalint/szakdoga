/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AppImport } from './routes/app'
import { Route as AuthRegisterImport } from './routes/auth/register'
import { Route as AuthLoginImport } from './routes/auth/login'
import { Route as AppWatchlistImport } from './routes/app/watchlist'
import { Route as AppWatchedImport } from './routes/app/watched'
import { Route as AppSettingsImport } from './routes/app/settings'
import { Route as AppProfileImport } from './routes/app/profile'
import { Route as AppDashboardImport } from './routes/app/dashboard'
import { Route as AppTvTvIdImport } from './routes/app/tv/$tvId'
import { Route as AppSeasonsTvIdImport } from './routes/app/seasons/$tvId'
import { Route as AppPeoplePersonIdImport } from './routes/app/people.$personId'
import { Route as AppMoviesMovieIdImport } from './routes/app/movies.$movieId'
import { Route as AppSeasonTvIdSeasonIdImport } from './routes/app/season/$tvId/$seasonId'
import { Route as AppCastTvTvIdImport } from './routes/app/cast/tv.$tvId'
import { Route as AppCastMovieMovieIdImport } from './routes/app/cast/movie.$movieId'
import { Route as AppEpisodeTvIdSeasonIdEpisodeIdImport } from './routes/app/episode/$tvId/$seasonId/$episodeId'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const AppRoute = AppImport.update({
  id: '/app',
  path: '/app',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const AuthRegisterRoute = AuthRegisterImport.update({
  id: '/auth/register',
  path: '/auth/register',
  getParentRoute: () => rootRoute,
} as any)

const AuthLoginRoute = AuthLoginImport.update({
  id: '/auth/login',
  path: '/auth/login',
  getParentRoute: () => rootRoute,
} as any)

const AppWatchlistRoute = AppWatchlistImport.update({
  id: '/watchlist',
  path: '/watchlist',
  getParentRoute: () => AppRoute,
} as any)

const AppWatchedRoute = AppWatchedImport.update({
  id: '/watched',
  path: '/watched',
  getParentRoute: () => AppRoute,
} as any)

const AppSettingsRoute = AppSettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => AppRoute,
} as any)

const AppProfileRoute = AppProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => AppRoute,
} as any)

const AppDashboardRoute = AppDashboardImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => AppRoute,
} as any)

const AppTvTvIdRoute = AppTvTvIdImport.update({
  id: '/tv/$tvId',
  path: '/tv/$tvId',
  getParentRoute: () => AppRoute,
} as any)

const AppSeasonsTvIdRoute = AppSeasonsTvIdImport.update({
  id: '/seasons/$tvId',
  path: '/seasons/$tvId',
  getParentRoute: () => AppRoute,
} as any)

const AppPeoplePersonIdRoute = AppPeoplePersonIdImport.update({
  id: '/people/$personId',
  path: '/people/$personId',
  getParentRoute: () => AppRoute,
} as any)

const AppMoviesMovieIdRoute = AppMoviesMovieIdImport.update({
  id: '/movies/$movieId',
  path: '/movies/$movieId',
  getParentRoute: () => AppRoute,
} as any)

const AppSeasonTvIdSeasonIdRoute = AppSeasonTvIdSeasonIdImport.update({
  id: '/season/$tvId/$seasonId',
  path: '/season/$tvId/$seasonId',
  getParentRoute: () => AppRoute,
} as any)

const AppCastTvTvIdRoute = AppCastTvTvIdImport.update({
  id: '/cast/tv/$tvId',
  path: '/cast/tv/$tvId',
  getParentRoute: () => AppRoute,
} as any)

const AppCastMovieMovieIdRoute = AppCastMovieMovieIdImport.update({
  id: '/cast/movie/$movieId',
  path: '/cast/movie/$movieId',
  getParentRoute: () => AppRoute,
} as any)

const AppEpisodeTvIdSeasonIdEpisodeIdRoute =
  AppEpisodeTvIdSeasonIdEpisodeIdImport.update({
    id: '/episode/$tvId/$seasonId/$episodeId',
    path: '/episode/$tvId/$seasonId/$episodeId',
    getParentRoute: () => AppRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/app': {
      id: '/app'
      path: '/app'
      fullPath: '/app'
      preLoaderRoute: typeof AppImport
      parentRoute: typeof rootRoute
    }
    '/app/dashboard': {
      id: '/app/dashboard'
      path: '/dashboard'
      fullPath: '/app/dashboard'
      preLoaderRoute: typeof AppDashboardImport
      parentRoute: typeof AppImport
    }
    '/app/profile': {
      id: '/app/profile'
      path: '/profile'
      fullPath: '/app/profile'
      preLoaderRoute: typeof AppProfileImport
      parentRoute: typeof AppImport
    }
    '/app/settings': {
      id: '/app/settings'
      path: '/settings'
      fullPath: '/app/settings'
      preLoaderRoute: typeof AppSettingsImport
      parentRoute: typeof AppImport
    }
    '/app/watched': {
      id: '/app/watched'
      path: '/watched'
      fullPath: '/app/watched'
      preLoaderRoute: typeof AppWatchedImport
      parentRoute: typeof AppImport
    }
    '/app/watchlist': {
      id: '/app/watchlist'
      path: '/watchlist'
      fullPath: '/app/watchlist'
      preLoaderRoute: typeof AppWatchlistImport
      parentRoute: typeof AppImport
    }
    '/auth/login': {
      id: '/auth/login'
      path: '/auth/login'
      fullPath: '/auth/login'
      preLoaderRoute: typeof AuthLoginImport
      parentRoute: typeof rootRoute
    }
    '/auth/register': {
      id: '/auth/register'
      path: '/auth/register'
      fullPath: '/auth/register'
      preLoaderRoute: typeof AuthRegisterImport
      parentRoute: typeof rootRoute
    }
    '/app/movies/$movieId': {
      id: '/app/movies/$movieId'
      path: '/movies/$movieId'
      fullPath: '/app/movies/$movieId'
      preLoaderRoute: typeof AppMoviesMovieIdImport
      parentRoute: typeof AppImport
    }
    '/app/people/$personId': {
      id: '/app/people/$personId'
      path: '/people/$personId'
      fullPath: '/app/people/$personId'
      preLoaderRoute: typeof AppPeoplePersonIdImport
      parentRoute: typeof AppImport
    }
    '/app/seasons/$tvId': {
      id: '/app/seasons/$tvId'
      path: '/seasons/$tvId'
      fullPath: '/app/seasons/$tvId'
      preLoaderRoute: typeof AppSeasonsTvIdImport
      parentRoute: typeof AppImport
    }
    '/app/tv/$tvId': {
      id: '/app/tv/$tvId'
      path: '/tv/$tvId'
      fullPath: '/app/tv/$tvId'
      preLoaderRoute: typeof AppTvTvIdImport
      parentRoute: typeof AppImport
    }
    '/app/cast/movie/$movieId': {
      id: '/app/cast/movie/$movieId'
      path: '/cast/movie/$movieId'
      fullPath: '/app/cast/movie/$movieId'
      preLoaderRoute: typeof AppCastMovieMovieIdImport
      parentRoute: typeof AppImport
    }
    '/app/cast/tv/$tvId': {
      id: '/app/cast/tv/$tvId'
      path: '/cast/tv/$tvId'
      fullPath: '/app/cast/tv/$tvId'
      preLoaderRoute: typeof AppCastTvTvIdImport
      parentRoute: typeof AppImport
    }
    '/app/season/$tvId/$seasonId': {
      id: '/app/season/$tvId/$seasonId'
      path: '/season/$tvId/$seasonId'
      fullPath: '/app/season/$tvId/$seasonId'
      preLoaderRoute: typeof AppSeasonTvIdSeasonIdImport
      parentRoute: typeof AppImport
    }
    '/app/episode/$tvId/$seasonId/$episodeId': {
      id: '/app/episode/$tvId/$seasonId/$episodeId'
      path: '/episode/$tvId/$seasonId/$episodeId'
      fullPath: '/app/episode/$tvId/$seasonId/$episodeId'
      preLoaderRoute: typeof AppEpisodeTvIdSeasonIdEpisodeIdImport
      parentRoute: typeof AppImport
    }
  }
}

// Create and export the route tree

interface AppRouteChildren {
  AppDashboardRoute: typeof AppDashboardRoute
  AppProfileRoute: typeof AppProfileRoute
  AppSettingsRoute: typeof AppSettingsRoute
  AppWatchedRoute: typeof AppWatchedRoute
  AppWatchlistRoute: typeof AppWatchlistRoute
  AppMoviesMovieIdRoute: typeof AppMoviesMovieIdRoute
  AppPeoplePersonIdRoute: typeof AppPeoplePersonIdRoute
  AppSeasonsTvIdRoute: typeof AppSeasonsTvIdRoute
  AppTvTvIdRoute: typeof AppTvTvIdRoute
  AppCastMovieMovieIdRoute: typeof AppCastMovieMovieIdRoute
  AppCastTvTvIdRoute: typeof AppCastTvTvIdRoute
  AppSeasonTvIdSeasonIdRoute: typeof AppSeasonTvIdSeasonIdRoute
  AppEpisodeTvIdSeasonIdEpisodeIdRoute: typeof AppEpisodeTvIdSeasonIdEpisodeIdRoute
}

const AppRouteChildren: AppRouteChildren = {
  AppDashboardRoute: AppDashboardRoute,
  AppProfileRoute: AppProfileRoute,
  AppSettingsRoute: AppSettingsRoute,
  AppWatchedRoute: AppWatchedRoute,
  AppWatchlistRoute: AppWatchlistRoute,
  AppMoviesMovieIdRoute: AppMoviesMovieIdRoute,
  AppPeoplePersonIdRoute: AppPeoplePersonIdRoute,
  AppSeasonsTvIdRoute: AppSeasonsTvIdRoute,
  AppTvTvIdRoute: AppTvTvIdRoute,
  AppCastMovieMovieIdRoute: AppCastMovieMovieIdRoute,
  AppCastTvTvIdRoute: AppCastTvTvIdRoute,
  AppSeasonTvIdSeasonIdRoute: AppSeasonTvIdSeasonIdRoute,
  AppEpisodeTvIdSeasonIdEpisodeIdRoute: AppEpisodeTvIdSeasonIdEpisodeIdRoute,
}

const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/app': typeof AppRouteWithChildren
  '/app/dashboard': typeof AppDashboardRoute
  '/app/profile': typeof AppProfileRoute
  '/app/settings': typeof AppSettingsRoute
  '/app/watched': typeof AppWatchedRoute
  '/app/watchlist': typeof AppWatchlistRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/register': typeof AuthRegisterRoute
  '/app/movies/$movieId': typeof AppMoviesMovieIdRoute
  '/app/people/$personId': typeof AppPeoplePersonIdRoute
  '/app/seasons/$tvId': typeof AppSeasonsTvIdRoute
  '/app/tv/$tvId': typeof AppTvTvIdRoute
  '/app/cast/movie/$movieId': typeof AppCastMovieMovieIdRoute
  '/app/cast/tv/$tvId': typeof AppCastTvTvIdRoute
  '/app/season/$tvId/$seasonId': typeof AppSeasonTvIdSeasonIdRoute
  '/app/episode/$tvId/$seasonId/$episodeId': typeof AppEpisodeTvIdSeasonIdEpisodeIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/app': typeof AppRouteWithChildren
  '/app/dashboard': typeof AppDashboardRoute
  '/app/profile': typeof AppProfileRoute
  '/app/settings': typeof AppSettingsRoute
  '/app/watched': typeof AppWatchedRoute
  '/app/watchlist': typeof AppWatchlistRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/register': typeof AuthRegisterRoute
  '/app/movies/$movieId': typeof AppMoviesMovieIdRoute
  '/app/people/$personId': typeof AppPeoplePersonIdRoute
  '/app/seasons/$tvId': typeof AppSeasonsTvIdRoute
  '/app/tv/$tvId': typeof AppTvTvIdRoute
  '/app/cast/movie/$movieId': typeof AppCastMovieMovieIdRoute
  '/app/cast/tv/$tvId': typeof AppCastTvTvIdRoute
  '/app/season/$tvId/$seasonId': typeof AppSeasonTvIdSeasonIdRoute
  '/app/episode/$tvId/$seasonId/$episodeId': typeof AppEpisodeTvIdSeasonIdEpisodeIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/app': typeof AppRouteWithChildren
  '/app/dashboard': typeof AppDashboardRoute
  '/app/profile': typeof AppProfileRoute
  '/app/settings': typeof AppSettingsRoute
  '/app/watched': typeof AppWatchedRoute
  '/app/watchlist': typeof AppWatchlistRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/register': typeof AuthRegisterRoute
  '/app/movies/$movieId': typeof AppMoviesMovieIdRoute
  '/app/people/$personId': typeof AppPeoplePersonIdRoute
  '/app/seasons/$tvId': typeof AppSeasonsTvIdRoute
  '/app/tv/$tvId': typeof AppTvTvIdRoute
  '/app/cast/movie/$movieId': typeof AppCastMovieMovieIdRoute
  '/app/cast/tv/$tvId': typeof AppCastTvTvIdRoute
  '/app/season/$tvId/$seasonId': typeof AppSeasonTvIdSeasonIdRoute
  '/app/episode/$tvId/$seasonId/$episodeId': typeof AppEpisodeTvIdSeasonIdEpisodeIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/app'
    | '/app/dashboard'
    | '/app/profile'
    | '/app/settings'
    | '/app/watched'
    | '/app/watchlist'
    | '/auth/login'
    | '/auth/register'
    | '/app/movies/$movieId'
    | '/app/people/$personId'
    | '/app/seasons/$tvId'
    | '/app/tv/$tvId'
    | '/app/cast/movie/$movieId'
    | '/app/cast/tv/$tvId'
    | '/app/season/$tvId/$seasonId'
    | '/app/episode/$tvId/$seasonId/$episodeId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/app'
    | '/app/dashboard'
    | '/app/profile'
    | '/app/settings'
    | '/app/watched'
    | '/app/watchlist'
    | '/auth/login'
    | '/auth/register'
    | '/app/movies/$movieId'
    | '/app/people/$personId'
    | '/app/seasons/$tvId'
    | '/app/tv/$tvId'
    | '/app/cast/movie/$movieId'
    | '/app/cast/tv/$tvId'
    | '/app/season/$tvId/$seasonId'
    | '/app/episode/$tvId/$seasonId/$episodeId'
  id:
    | '__root__'
    | '/'
    | '/app'
    | '/app/dashboard'
    | '/app/profile'
    | '/app/settings'
    | '/app/watched'
    | '/app/watchlist'
    | '/auth/login'
    | '/auth/register'
    | '/app/movies/$movieId'
    | '/app/people/$personId'
    | '/app/seasons/$tvId'
    | '/app/tv/$tvId'
    | '/app/cast/movie/$movieId'
    | '/app/cast/tv/$tvId'
    | '/app/season/$tvId/$seasonId'
    | '/app/episode/$tvId/$seasonId/$episodeId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  AppRoute: typeof AppRouteWithChildren
  AuthLoginRoute: typeof AuthLoginRoute
  AuthRegisterRoute: typeof AuthRegisterRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  AppRoute: AppRouteWithChildren,
  AuthLoginRoute: AuthLoginRoute,
  AuthRegisterRoute: AuthRegisterRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/app",
        "/auth/login",
        "/auth/register"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/app": {
      "filePath": "app.tsx",
      "children": [
        "/app/dashboard",
        "/app/profile",
        "/app/settings",
        "/app/watched",
        "/app/watchlist",
        "/app/movies/$movieId",
        "/app/people/$personId",
        "/app/seasons/$tvId",
        "/app/tv/$tvId",
        "/app/cast/movie/$movieId",
        "/app/cast/tv/$tvId",
        "/app/season/$tvId/$seasonId",
        "/app/episode/$tvId/$seasonId/$episodeId"
      ]
    },
    "/app/dashboard": {
      "filePath": "app/dashboard.tsx",
      "parent": "/app"
    },
    "/app/profile": {
      "filePath": "app/profile.tsx",
      "parent": "/app"
    },
    "/app/settings": {
      "filePath": "app/settings.tsx",
      "parent": "/app"
    },
    "/app/watched": {
      "filePath": "app/watched.tsx",
      "parent": "/app"
    },
    "/app/watchlist": {
      "filePath": "app/watchlist.tsx",
      "parent": "/app"
    },
    "/auth/login": {
      "filePath": "auth/login.tsx"
    },
    "/auth/register": {
      "filePath": "auth/register.tsx"
    },
    "/app/movies/$movieId": {
      "filePath": "app/movies.$movieId.tsx",
      "parent": "/app"
    },
    "/app/people/$personId": {
      "filePath": "app/people.$personId.tsx",
      "parent": "/app"
    },
    "/app/seasons/$tvId": {
      "filePath": "app/seasons/$tvId.tsx",
      "parent": "/app"
    },
    "/app/tv/$tvId": {
      "filePath": "app/tv/$tvId.tsx",
      "parent": "/app"
    },
    "/app/cast/movie/$movieId": {
      "filePath": "app/cast/movie.$movieId.tsx",
      "parent": "/app"
    },
    "/app/cast/tv/$tvId": {
      "filePath": "app/cast/tv.$tvId.tsx",
      "parent": "/app"
    },
    "/app/season/$tvId/$seasonId": {
      "filePath": "app/season/$tvId/$seasonId.tsx",
      "parent": "/app"
    },
    "/app/episode/$tvId/$seasonId/$episodeId": {
      "filePath": "app/episode/$tvId/$seasonId/$episodeId.tsx",
      "parent": "/app"
    }
  }
}
ROUTE_MANIFEST_END */
