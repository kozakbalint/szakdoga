import {
  MovieHeader,
  MovieHeaderData,
  SuspenseMovieHeader,
} from './movie-header';
import { SuspenseTopCast, TopCast } from '@/features/cast/components/top-cast';
import { getMovieCastQueryOptions } from '@/features/cast/api/get-movie-cast';
import { getMovieDetailsQueryOptions } from '../api/get-movie-details';
import { isMovieOnWatchlistQueryOptions } from '@/features/watchlist/api/is-movie-on-watchlist';
import { getMovieWatchProvidersQueryOptions } from '@/features/watchproviders/api/get-movie-watch-providers';
import { useSuspenseQueries } from '@tanstack/react-query';
import { Head } from '@/components/seo';

export const MovieView = ({ movieId }: { movieId: string }) => {
  const queries = useSuspenseQueries({
    queries: [
      getMovieDetailsQueryOptions({ id: movieId }),
      isMovieOnWatchlistQueryOptions({ id: movieId }),
      getMovieWatchProvidersQueryOptions({ id: movieId }),
      getMovieCastQueryOptions({ id: movieId }),
    ],
  });

  const headerData: MovieHeaderData = {
    movieDetails: queries[0].data.movie,
    onWatchlist: queries[1].data.in_watchlist,
    watchproviders: queries[2].data.watch_providers,
  };

  return (
    <div className="flex flex-col gap-8">
      <Head title={queries[0].data.movie.title} />
      <MovieHeader movieId={movieId} data={headerData} />
      <TopCast id={movieId} isTv={false} data={queries[3].data.cast} />
    </div>
  );
};

export const SuspenseMovieView = () => {
  return (
    <div className="flex flex-col gap-8">
      <SuspenseMovieHeader />
      <SuspenseTopCast />
    </div>
  );
};
