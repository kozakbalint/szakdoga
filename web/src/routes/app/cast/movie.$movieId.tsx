import { ContentLayout } from '@/components/layouts';
import {
  getMovieDetailsQueryOptions,
  useGetMovieDetails,
} from '@/features/movies/api/get-movie-details';
import {
  getMovieCastQueryOptions,
  useGetMovieCast,
} from '@/features/cast/api/get-movie-cast';
import { QueryClient } from '@tanstack/react-query';
import {
  createFileRoute,
  Link,
  redirect,
  useParams,
} from '@tanstack/react-router';
import { CastDataTable } from '@/features/cast/components/cast-data-table/data-table';
import { castMovieColumns } from '@/features/cast/components/cast-data-table/movie-cast-columns';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';

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
      getMovieDetailsQueryOptions({ id: params.movieId }),
    );
    queryClient.ensureQueryData(
      getMovieCastQueryOptions({ id: params.movieId }),
    );
  },
});

function MovieCastRoute() {
  const params = useParams({ strict: false });
  const movieId = params.movieId as string;

  const movieQuery = useGetMovieDetails({ id: movieId });
  const movieCastQuery = useGetMovieCast({ id: movieId });

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
      <ContentLayout head={movie.title + ' Cast'}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="text-2xl text-primary hover:underline">
              <Link to={`/app/movies/` + `${movieId}`}>{movie.title}</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary">
              <ChevronRight />
            </BreadcrumbSeparator>
            <BreadcrumbItem className="text-2xl text-primary">
              Cast
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <CastDataTable columns={castMovieColumns} data={cast} isTv={false} />
      </ContentLayout>
    </>
  );
}
