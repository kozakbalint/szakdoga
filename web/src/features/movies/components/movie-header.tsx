import { Badge } from '@/components/ui/badge';
import { MovieWatchedToggle } from '@/components/ui/watchedtoggle';
import { WatchlistToggle } from '@/components/ui/watchlisttoggle';
import { WatchProvider } from '@/components/ui/watchprovider';
import { useAddMovieToWatchlist } from '@/features/watchlist/api/add-movie-to-watchlist';
import { useIsMovieOnWatchlist } from '@/features/watchlist/api/is-movie-on-watchlist';
import { useRemoveMovieFromWatchlist } from '@/features/watchlist/api/remove-movie-from-watchlist';
import { useGetMovieWatchProviders } from '@/features/watchproviders/api/get-movie-watch-providers';
import { Star } from 'lucide-react';
import { useGetMovieDetails } from '../api/get-movie-details';

export const MovieHeader = ({ movieId }: { movieId: string }) => {
  const movieQuery = useGetMovieDetails({ id: movieId });
  const onWatchlistQuery = useIsMovieOnWatchlist({ id: movieId });
  const addMovieToWatchlistMutation = useAddMovieToWatchlist({ id: movieId });
  const removeMovieFromWatchlistMutation = useRemoveMovieFromWatchlist({
    id: movieId,
  });
  const watchproviderQuery = useGetMovieWatchProviders({ id: movieId });

  if (
    movieQuery.isLoading ||
    onWatchlistQuery.isLoading ||
    watchproviderQuery.isLoading
  ) {
    return <div>Loading...</div>;
  }

  const movie = movieQuery.data?.movie;
  const isOnWatchlist = onWatchlistQuery.data?.in_watchlist;
  const watchProviderData = watchproviderQuery.data?.watch_providers;

  if (!movie || !watchProviderData || isOnWatchlist === undefined) {
    return '';
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-4">
      <div className="flex flex-col sm:flex-row w-full lg:w-4/5 gap-4">
        <div className="flex w-full sm:w-1/3 justify-center content-center">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="rounded-md shadow object-center w-3/5 sm:w-full"
          />
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-2/3 max-h-fit overflow-scroll">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-bold text-pretty">{movie.title}</div>
            <div className="flex flex-row items-start gap-4">
              <div className="text-xl font-thin">
                ({movie.release_date.slice(0, 4)})
              </div>
              <div className="flex text-xl lg:pr-4 font-thin self-start items-center flex-grow sm:justify-end gap-1">
                <Star fill="gold" stroke="black" />
                {Math.fround(movie.vote_average).toFixed(1)}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {movie.genres.map((genre) => (
              <Badge key={genre}>{genre}</Badge>
            ))}
          </div>
          <div className="text-justify lg:pr-4 overflow-scroll">
            {movie.overview}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full lg:w-1/5 lg:justify-between">
        <div className="flex">
          <div>
            <WatchlistToggle
              id={movieId}
              type="Movie"
              isOnWatchlist={isOnWatchlist}
              addMutatuion={addMovieToWatchlistMutation}
              removeMutation={removeMovieFromWatchlistMutation}
            />
          </div>
          <div>
            <MovieWatchedToggle id={movieId} />
          </div>
        </div>
        <div>
          <WatchProvider watchproviders={watchProviderData} />
        </div>
      </div>
    </div>
  );
};
