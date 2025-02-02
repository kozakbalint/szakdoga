import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { WatchProviders } from '@/types/types.gen';
import { useLocalStorage } from '@uidotdev/usehooks';

export const WatchProvider = ({
  watchproviders,
}: {
  watchproviders: WatchProviders;
}) => {
  const [type] = useLocalStorage('preferredProvider', 'Stream');

  if (
    (watchproviders.buy.length === 0 && type === 'Buy') ||
    (watchproviders.rent.length === 0 && type === 'Rent') ||
    (watchproviders.flatrate.length === 0 && type === 'Stream')
  ) {
    return (
      <div>
        <p className="text-xl font-bold">{type} at:</p>
        <div>{`${type}ing is not available`}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xl font-bold">{type} at:</p>
      <div className="flex gap-2 flex-wrap">
        {(type === 'Buy'
          ? watchproviders.buy
          : type === 'Rent'
            ? watchproviders.rent
            : type === 'Stream'
              ? watchproviders.flatrate
              : []
        ).map((provider) => (
          <Card className="flex items-center w-fit max-h-11" key={provider.id}>
            {provider.logo_url === '' ? (
              <Skeleton className="h-10 w-10 rounded-xl" />
            ) : (
              <img
                src={provider.logo_url}
                alt={provider.name}
                className="h-10 rounded-xl"
              />
            )}
            <p className="px-2 truncate">{provider.name}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const SuspenseWatchProvider = () => {
  const [type] = useLocalStorage('preferredProvider', 'Stream');
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xl font-bold">{type} at:</p>
      <div className="flex gap-2 flex-wrap">
        {[...Array(3)].map((_, index) => (
          <Card className="flex items-center w-fit max-h-11" key={index}>
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="px-2">
              <Skeleton className="h-5 w-15" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
