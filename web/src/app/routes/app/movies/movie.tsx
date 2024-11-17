import { ContentLayout } from '@/components/layouts';
import {
  getMovieByIdQueryOptions,
  useGetMovieById,
} from '@/features/movies/api/get-movie-by-id';
import { MovieView } from '@/features/movies/components/movie-view';
import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { LoaderFunctionArgs, useParams } from 'react-router-dom';

export const movieLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const id = params.movieId as string;

    const movieQuery = getMovieByIdQueryOptions({ id });

    const movie =
      queryClient.getQueryData(movieQuery.queryKey) ??
      (await queryClient.fetchQuery(movieQuery));

    return { movie };
  };

export const MovieRoute = () => {
  const params = useParams();
  const movieId = params.movieId as string;
  const movieQuery = useGetMovieById({ id: movieId });

  if (movieQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const movie = movieQuery.data?.movie;
  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <>
      <ContentLayout head={movie.title}>
        <MovieView movieId={movieId} />
        <div className="mt-8">
          <ErrorBoundary
            fallback={
              <div>Failed to load the movie. Try to refresh the page.</div>
            }
          ></ErrorBoundary>
        </div>
      </ContentLayout>
    </>
  );
};
