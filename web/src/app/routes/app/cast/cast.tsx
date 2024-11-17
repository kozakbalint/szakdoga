import { ContentLayout } from '@/components/layouts';
import { useGetMovieById } from '@/features/movies/api/get-movie-by-id';
import { useGetMovieCastById } from '@/features/movies/api/get-movie-cast-by-id';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export const CastRoute = () => {
  const params = useParams();
  const movieId = params.movieId?.toString() ?? '';

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
                  <p className="text-base">{actor.character}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ContentLayout>
    </>
  );
};
