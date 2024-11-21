import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useGetTvById } from '../api/get-tv-by-id';
import { useGetTvSeasonsById } from '../api/get-tv-seasons-by-id';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

export const SeasonsView = ({ id }: { id: string }) => {
  const tvQuery = useGetTvById({ id });
  const seasonQuery = useGetTvSeasonsById({ id });

  if (tvQuery.isLoading || seasonQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const tv = tvQuery.data?.tv;
  const seasons = seasonQuery.data?.seasons;

  if (!tv || !seasons) {
    return <div>No seasons found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl">{tv.name} Seasons:</div>
      <div className="flex flex-row sm:flex-col gap-2 flex-wrap justify-center sm:justify-start">
        {seasons.seasons_without_episodes.map((season) => (
          <Link
            to={`/app/season/${tv.id}/${season.season_number}`}
            className="hover:underline w-3/4 sm:w-full"
            key={season.season_number}
          >
            <Card
              key={season.season_number}
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
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col">
                    <div className="flex flex-row gap-2 font-bold text-lg sm:text-xl">
                      <div className="line-clamp-2">{season.name}</div>
                    </div>
                    <div className="line-clamp-2 lg:line-clamp-3">
                      {season.overview}
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2 flex-grow justify-start lg:justify-end">
                    <Button size={'icon'} variant={'default'}></Button>
                    <Button size={'icon'} variant={'default'}></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
