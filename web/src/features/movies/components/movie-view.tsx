import { MovieHeader } from './movie-header';
import { MovieCast } from './movie-cast';

export const MovieView = ({ movieId }: { movieId: string }) => {
  return (
    <div className="flex flex-col gap-8">
      <MovieHeader movieId={movieId} />
      <MovieCast movieId={movieId} />
    </div>
  );
};
