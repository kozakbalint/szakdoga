import { Card } from '@/components/ui/card';
import { useGetTvWatchProviders } from '../api/get-tv-watch-providers';
import { useLocalStorage } from '@uidotdev/usehooks';

export const TvWatchProvider = ({ tvId }: { tvId: string }) => {
  const tvWatchProviderQuery = useGetTvWatchProviders({ id: tvId });
  const [type] = useLocalStorage('preferredProvider', 'Stream');

  if (tvWatchProviderQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const providers = tvWatchProviderQuery.data?.watch_providers;

  if (!providers) {
    return <div>Providers not found</div>;
  }

  if (providers.flatrate.length === 0 && type === 'Stream') {
    return (
      <div>
        <p className="text-xl font-bold">Stream at:</p>
        <div>Streaming is not available</div>
      </div>
    );
  }

  if (providers.buy.length === 0 && type === 'Buy') {
    return (
      <div>
        <p className="text-xl font-bold">Buy at:</p>
        <div>Buying is not available</div>
      </div>
    );
  }

  if (providers.rent.length === 0 && type === 'Rent') {
    return (
      <div>
        <p className="text-xl font-bold">Rent at:</p>
        <div>Renting is not available</div>
      </div>
    );
  }

  if (type === 'Stream') {
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

  if (type === 'Buy') {
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

  if (type === 'Rent') {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xl font-bold">Rent at:</p>
        <div className="flex gap-2 flex-wrap">
          {providers.rent.map((rent) => (
            <Card className="flex items-center w-fit max-h-11" key={rent.id}>
              <img
                src={rent.logo_url}
                alt={rent.name}
                className="h-10 rounded-xl"
              />
              <p className="px-2 truncate">{rent.name}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  }
};
