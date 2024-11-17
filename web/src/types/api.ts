export type User = {
  id: number;
  createdAt: string;
  name: string;
  email: string;
};

export type LoginAuthResponse = {
  login: {
    authentication_token: string;
    user: User;
  };
};

export type RegisterAuthResponse = {
  user: User;
};

export type SearchMovieResponse = {
  id: number;
  title: string;
  overview: string;
  poster_url: string;
  release_date: string;
  popularity: number;
};

export type SearchMoviesResponse = {
  movies: SearchMovieResponse[] | null;
};

export type SearchTvResponse = {
  id: number;
  name: string;
  overview: string;
  poster_url: string;
  first_air_date: string;
  popularity: number;
};

export type SearchTvsResponse = {
  tv: SearchTvResponse[] | null;
};

export type SearchPersonResponse = {
  id: number;
  name: string;
  profile_url: string;
  popularity: number;
};

export type SearchPeopleResponse = {
  people: SearchPersonResponse[] | null;
};

export type Genre = {
  id: number;
  name: string;
};

export type GetMovieResponse = {
  movie: {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    genres: Genre[];
    runtime: number;
    poster_url: string;
    popularity: number;
    vote_average: number;
  } | null;
};

export type GetMovieCastResponse = {
  cast:
    | {
        id: number;
        name: string;
        character: string;
        profile_url: string;
        popularity: number;
      }[]
    | null;
};

export type GetTvResponse = {
  tv: {
    id: number;
    name: string;
    overview: string;
    first_air_date: string;
    poster_url: string;
    popularity: number;
  } | null;
};

export type GetTvCastResponse = {
  cast:
    | {
        id: number;
        name: string;
        roles: Role[];
        profile_url: string;
        total_episode_count: number;
        popularity: number;
      }[]
    | null;
};

export type Role = {
  character: string;
  episode_count: number;
};

export type GetPersonResponse = {
  person: {
    id: number;
    name: string;
    biography: string;
    birthday: string;
    profile_url: string;
    popularity: number;
  } | null;
};

export type GetWatchProvidersResponse = {
  providers: {
    streaming: WatchProvider[];
    buy: WatchProvider[];
  } | null;
};

export type WatchProvider = {
  id: number;
  name: string;
  logo_url: string;
};
