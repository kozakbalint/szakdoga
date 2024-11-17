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
      path: '/app/cast/:movieId',
      getHref: (id: string) => `/app/cast/${id}`,
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
