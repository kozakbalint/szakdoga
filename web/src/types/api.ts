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
