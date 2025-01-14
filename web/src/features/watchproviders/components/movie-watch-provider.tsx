import { Card } from '@/components/ui/card';
import { useGetMovieWatchProviders } from '../api/get-movie-watch-providers';

export const MovieWatchProvider = ({
  movieId,
  type,
}: {
  movieId: string;
  type: 'streaming' | 'buy';
}) => {
  const movieWatchProviderQuery = useGetMovieWatchProviders({
    id: movieId,
  });

  if (movieWatchProviderQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const providers = movieWatchProviderQuery.data?.watch_providers;

  if (!providers) {
    return <div>Providers not found</div>;
  }

  if (!providers?.flatrate && type === 'streaming') {
    return (
      <div>
        <p className="text-xl font-bold">Stream at:</p>
        <div>Streaming is not available</div>
      </div>
    );
  }

  if (!providers?.buy && type === 'buy') {
    return (
      <div>
        <p className="text-xl font-bold">Buy at:</p>
        <div>Buying is not available</div>
      </div>
    );
  }

  if (type === 'streaming') {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xl font-bold">Stream at:</p>
        <div className="flex gap-2 flex-wrap">
          {providers.flatrate.map((stream) => (
            <Card className="flex items-center w-fit max-h-11" key={stream.id}>
              <img
                src={stream.logo_url}
                alt={stream.name}
                className="h-10 rounded-xl"
              />
              <p className="px-2 truncate">{stream.name}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'buy') {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xl font-bold">Buy at:</p>
        <div className="flex gap-2 flex-wrap">
          {providers.buy.map((buy) => (
            <Card className="flex items-center w-fit max-h-11" key={buy.id}>
              <img
                src={buy.logo_url}
                alt={buy.name}
                className="h-10 rounded-xl"
              />
              <p className="px-2 truncate">{buy.name}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  }
};
