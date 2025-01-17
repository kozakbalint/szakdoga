import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useGetTvDetails } from '../api/get-tv-details';
import { useGetTvSeasonDetails } from '../api/get-tv-season-details';
import { Link } from '@tanstack/react-router';
import { EpisodeWatchedToggle } from '@/components/ui/watchedtoggle';

export const SeasonView = ({
  id,
  seasonId,
}: {
  id: string;
  seasonId: string;
}) => {
  const tvQuery = useGetTvDetails({ id });
  const seasonQuery = useGetTvSeasonDetails({ id, seasonId });

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
        {tv.name} Seasons {seasonId}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <img src={season.poster_url} alt={season.name} className="sm:h-96" />
        <div className="flex flex-col">
          <div className="text-2xl">{season.name}</div>
          <div>{season.overview}</div>
        </div>
      </div>
      <div className="text-2xl">Episodes</div>
      <div className="flex flex-row sm:flex-col gap-2 flex-wrap justify-center sm:justify-start">
        {season.episodes.map((episode, index) => (
          <Card
            key={index + 1}
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
                <Link
                  to={`/app/episode/${tv.id}/${seasonId}/${index + 1}`}
                  className="hover:underline w-3/4 sm:w-full"
                  key={index + 1}
                >
                  <div className="flex flex-col">
                    <div className="flex flex-row gap-2 font-bold text-lg sm:text-xl">
                      <div>{index + 1}.</div>
                      <div className="line-clamp-2">{episode.name}</div>
                    </div>
                    <div className="line-clamp-2 lg:line-clamp-3">
                      {episode.overview}
                    </div>
                  </div>
                </Link>
                <div className="flex flex-row sm:flex-col gap-2 flex-grow justify-start">
                  <EpisodeWatchedToggle
                    key={index}
                    id={id}
                    seasonNumber={seasonId}
                    episodeNumber={(index + 1).toString()}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
