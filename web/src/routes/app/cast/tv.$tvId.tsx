import { ContentLayout } from '@/components/layouts';
import {
  getTvDetailsQueryOptions,
  useGetTvDetails,
} from '@/features/tv/api/get-tv-details';
import {
  getTvCastQueryOptions,
  useGetTvCast,
} from '@/features/cast/api/get-tv-cast';
import { QueryClient } from '@tanstack/react-query';
import {
  createFileRoute,
  Link,
  redirect,
  useParams,
} from '@tanstack/react-router';

const queryClient = new QueryClient();

export const Route = createFileRoute('/app/cast/tv/$tvId')({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.data === null) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.pathname },
      });
    }
  },
  component: TvCastRoute,
  loader: async ({ params }) => {
    queryClient.ensureQueryData(getTvDetailsQueryOptions({ id: params.tvId }));
    queryClient.ensureQueryData(getTvCastQueryOptions({ id: params.tvId }));
  },
});

function TvCastRoute() {
  const params = useParams({ strict: false });
  const tvId = params.tvId as string;

  const tvQuery = useGetTvDetails({ id: tvId });
  const tvCastQuery = useGetTvCast({ id: tvId });

  if (tvCastQuery.isLoading || tvQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const tv = tvQuery.data?.tv;
  const cast = tvCastQuery.data?.cast;

  if (!cast || !tv) {
    return <div>Cast not found</div>;
  }

  return (
    <>
      <ContentLayout title={tv.name + ' Cast'} head={tv.name + ' Cast'}>
        <div className="flex flex-col gap-2 pt-4">
          {cast.map((actor) => (
            <Link to={`/app/people/${actor.id}`} className="hover:underline">
              <div key={actor.id} className="flex gap-4">
                <img
                  src={actor.profile_url}
                  alt={actor.name}
                  className="rounded h-32"
                />
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold">{actor.name}</h2>
                  <p className="text-base">
                    Roles:{' '}
                    {actor.roles.map((role) => {
                      return role.character + ', ';
                    })}
                  </p>
                  <p className="text-base">
                    Total Episode Count:{' '}
                    {actor.roles
                      .map((role) => role.episode_count)
                      .reduce((a, b) => a + b, 0)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ContentLayout>
    </>
  );
}
