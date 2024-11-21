import { ContentLayout } from '@/components/layouts';
import {
  getMovieByIdQueryOptions,
  useGetMovieById,
} from '@/features/movies/api/get-movie-by-id';
import {
  getMovieCastByIdQueryOptions,
  useGetMovieCastById,
} from '@/features/movies/api/get-movie-cast-by-id';
import { QueryClient } from '@tanstack/react-query';
import {
  createFileRoute,
  Link,
  redirect,
  useParams,
} from '@tanstack/react-router';

const queryClient = new QueryClient();

export const Route = createFileRoute('/app/cast/movie/$movieId')({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.data === null) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.pathname },
      });
    }
  },
  component: MovieCastRoute,
  loader: async ({ params }) => {
    queryClient.ensureQueryData(
      getMovieByIdQueryOptions({ id: params.movieId }),
    );
    queryClient.ensureQueryData(
      getMovieCastByIdQueryOptions({ id: params.movieId }),
    );
  },
});

function MovieCastRoute() {
  const params = useParams({ strict: false });
  const movieId = params.movieId as string;

  const movieQuery = useGetMovieById({ id: movieId });
  const movieCastQuery = useGetMovieCastById({ id: movieId });

  if (movieCastQuery.isLoading || movieQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const movie = movieQuery.data?.movie;
  const cast = movieCastQuery.data?.cast;

  if (!cast || !movie) {
    return <div>Cast not found</div>;
  }

  return (
    <>
      <ContentLayout title={movie.title + ' Cast'} head={movie.title + ' Cast'}>
        <div className="flex flex-col gap-2 pt-4">
          {cast.map((actor) => (
            <Link to={`/app/people/${actor.id}`} className="hover:underline">
              <div key={actor.id} className="flex gap-4">
                <img
                  src={actor.profile_url}
                  alt={actor.name}
                  className="rounded h-32"
                />
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-bold">{actor.name}</h2>
                  <p className="text-base">Role: {actor.character}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ContentLayout>
    </>
  );
}
