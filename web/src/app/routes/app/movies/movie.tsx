import { ContentLayout } from '@/components/layouts';
import {
  getMovieByIdQueryOptions,
  useGetMovieById,
} from '@/features/movies/api/get-movie-by-id';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { QueryClient } from '@tanstack/react-query';
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
      <ContentLayout title={movie.title}>
        <div className="flex gap-4">
          <div className="w-1/3">
            <AspectRatio ratio={2 / 3}>
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover rounded-md"
              />
            </AspectRatio>
          </div>
          <div className="flex flex-col gap-2 w-2/3">
            <h1 className="text-2xl font-bold">
              {movie.title}{' '}
              <span className="text-xl font-normal">
                ({movie.release_date.slice(0, 4)})
              </span>
            </h1>
            <p>{movie.overview}</p>
          </div>
        </div>
      </ContentLayout>
    </>
  );
};
