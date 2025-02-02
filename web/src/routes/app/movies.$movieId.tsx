import { ContentLayout } from '@/components/layouts';

import {
  getMovieDetailsQueryOptions,
  useGetMovieDetails,
} from '@/features/movies/api/get-movie-details';
import {
  MovieView,
  SuspenseMovieView,
} from '@/features/movies/components/movie-view';
import { QueryClient } from '@tanstack/react-query';
import { createFileRoute, redirect, useParams } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const queryClient = new QueryClient();

export const Route = createFileRoute('/app/movies/$movieId')({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.data === null) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.pathname },
      });
    }
  },
  component: MovieRoute,
  loader: async ({ params }) => {
    await queryClient.ensureQueryData(
      getMovieDetailsQueryOptions({ id: params.movieId }),
    );
  },
});

function MovieRoute() {
  const params = useParams({ strict: false });
  const movieId = params.movieId as string;
  const movieQuery = useGetMovieDetails({ id: movieId });

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
        <Suspense fallback={<SuspenseMovieView />}>
          <MovieView movieId={movieId} />
          <div className="mt-8">
            <ErrorBoundary
              fallback={
                <div>Failed to load the movie. Try to refresh the page.</div>
              }
            ></ErrorBoundary>
          </div>
        </Suspense>
      </ContentLayout>
    </>
  );
}
