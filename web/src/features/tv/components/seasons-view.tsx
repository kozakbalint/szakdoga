import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useGetTvDetails } from '../api/get-tv-details';
import { Link } from '@tanstack/react-router';
import { SeasonWatchedToggle } from '@/components/ui/watchedtoggle';

export const SeasonsView = ({ id }: { id: string }) => {
  const tvQuery = useGetTvDetails({ id });

  if (tvQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const tv = tvQuery.data?.tv;

  if (!tv) {
    return <div>No seasons found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl">{tv.name} Seasons:</div>
      <div className="flex flex-row sm:flex-col gap-2 flex-wrap justify-center sm:justify-start">
        {tv.seasons.map((season, index) => (
          <Card
            key={index + 1}
            className="flex flex-col h-full w-full sm:flex-row sm:h-32"
          >
            <CardHeader className="p-0 min-w-fit">
              <img
                src={season.poster_url}
                alt={season.name}
                className="h-full w-full rounded-xl object-cover"
              />
            </CardHeader>
            <CardContent className="py-2 w-full">
              <div className="flex">
                <Link
                  to={`/app/season/${tv.id}/${index + 1}`}
                  className="hover:underline w-3/4 sm:w-full"
                  key={index + 1}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col">
                      <div className="flex flex-row gap-2 font-bold text-lg sm:text-xl">
                        <div className="line-clamp-2">{season.name}</div>
                      </div>
                      <div className="line-clamp-2 lg:line-clamp-3">
                        {season.overview}
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2 grow justify-start lg:justify-end"></div>
                  </div>
                </Link>
                <SeasonWatchedToggle
                  key={index}
                  id={tv.id.toString()}
                  seasonNumber={(index + 1).toString()}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
