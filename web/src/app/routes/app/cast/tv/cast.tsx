import { ContentLayout } from '@/components/layouts';
import { useGetTvById } from '@/features/tv/api/get-tv-by-id';
import { useGetTvCastById } from '@/features/tv/api/get-tv-cast-by-id';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export const CastRoute = () => {
  const params = useParams();
  const tvId = params.tvId?.toString() ?? '';

  const tvQuery = useGetTvById({ id: tvId });
  const tvCastQuery = useGetTvCastById({ id: tvId });

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
                    Total Episode Count: {actor.total_episode_count}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ContentLayout>
    </>
  );
};
