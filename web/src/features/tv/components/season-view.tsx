import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useGetTvById } from '../api/get-tv-by-id';
import { useGetTvSeasonById } from '../api/get-tv-season-by-id';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

export const SeasonView = ({
  id,
  seasonId,
}: {
  id: string;
  seasonId: string;
}) => {
  const tvQuery = useGetTvById({ id });
  const seasonQuery = useGetTvSeasonById({ id, seasonId });

  if (tvQuery.isLoading || seasonQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const tv = tvQuery.data?.tv;
  const season = seasonQuery.data?.season;

  if (!tv || !season) {
    return <div>No seasons found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl">
        {tv.name} Seasons {season.season.season_number}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <img
          src={season.season.poster_url}
          alt={season.season.name}
          className="sm:h-96"
        />
        <div className="flex flex-col">
          <div className="text-2xl">{season.season.name}</div>
          <div>{season.season.overview}</div>
        </div>
      </div>
      <div className="text-2xl">Episodes</div>
      <div className="flex flex-row sm:flex-col gap-2 flex-wrap justify-center sm:justify-start">
        {season.season.episodes.map((episode) => (
          <Link
            to={`/app/episode/${tv.id}/${seasonId}/${episode.episode_number}`}
            className="hover:underline w-3/4 sm:w-full"
            key={episode.episode_number}
          >
            <Card
              key={episode.episode_number}
              className="flex flex-col h-full w-full sm:flex-row sm:h-32"
            >
              <CardHeader className="p-0 min-w-fit">
                <img
                  src={episode.still_url}
                  alt={episode.name}
                  className="h-full w-full rounded-xl object-cover"
                />
              </CardHeader>
              <CardContent className="py-2 w-full">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col">
                    <div className="flex flex-row gap-2 font-bold text-lg sm:text-xl">
                      <div>{episode.episode_number}.</div>
                      <div className="line-clamp-2">{episode.name}</div>
                    </div>
                    <div className="line-clamp-2 lg:line-clamp-3">
                      {episode.overview}
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
