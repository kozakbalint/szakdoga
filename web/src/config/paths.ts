export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },

  auth: {
    register: {
      path: '/auth/register',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  },

  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
    dashboard: {
      path: '/app',
      getHref: () => '/app',
    },
    movie: {
      path: '/app/movies/:movieId',
      getHref: (id: string) => `/app/movies/${id}`,
    },
    tv: {
      path: '/app/tv/:tvId',
      getHref: (id: string) => `/app/tv/${id}`,
      seasons: {
        path: '/app/tv/:tvId/seasons',
        getHref: (id: string) => `/app/tv/${id}/seasons`,
      },
      season: {
        path: '/app/tv/:tvId/seasons/:seasonNumber',
        getHref: (tvId: string, seasonNumber: string) =>
          `/app/tv/${tvId}/seasons/${seasonNumber}`,
      },
      episode: {
        path: '/app/tv/:tvId/seasons/:seasonNumber/episodes/:episodeNumber',
        getHref: (tvId: string, seasonNumber: string, episodeNumber: string) =>
          `/app/tv/${tvId}/seasons/${seasonNumber}/episodes/${episodeNumber}`,
      },
    },
    person: {
      path: '/app/people/:personId',
      getHref: (id: string) => `/app/people/${id}`,
    },
    categoris: {
      path: '/app/categories/:categoryId',
      getHref: (id: string) => `/app/categories/${id}`,
    },
    cast: {
      movie: {
        path: '/app/cast/movies/:movieId',
        getHref: (id: string) => `/app/cast/movies/${id}`,
      },
      tv: {
        path: '/app/cast/tv/:tvId',
        getHref: (id: string) => `/app/cast/tv/${id}`,
      },
    },
    profile: {
      path: '/app/profile',
      getHref: () => '/app/profile',
    },
    settings: {
      path: '/app/settings',
      getHref: () => '/app/settings',
    },
    lists: {
      path: '/app/lists',
      getHref: () => '/app/lists',
    },
  },
};
