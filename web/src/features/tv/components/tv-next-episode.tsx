import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { EpisodeWatchedToggle } from '@/features/watched/components/watchedtoggle';
import { useIsTvOnWatched } from '@/features/watched/api/is-tv-on-watched';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from '@tanstack/react-router';

export const NextEpisode = ({ tvId }: { tvId: string }) => {
  const watchedQuery = useIsTvOnWatched({ id: tvId });
  const isMobile = useIsMobile();

  const imgWidth = isMobile ? 300 : 200;
  const imgHeight = isMobile ? 100 : 100;

  if (watchedQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const nextEpisode = watchedQuery.data?.watched_tv.next_episode;

  if (
    !nextEpisode ||
    nextEpisode.season_number === 0 ||
    nextEpisode.episode_number === 0
  ) {
    return '';
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-2xl font-bold">Next Episode:</div>
      <Card className="shadow-md">
        <div className="flex flex-col sm:flex-row gap-4 p-2 sm:p-0 justify-between">
          <Link
            to={`/app/episode/${tvId}/${nextEpisode.season_number}/${nextEpisode.episode_number}`}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <img
                src={nextEpisode.episode_details.still_url}
                alt={nextEpisode.episode_details.name}
                width={imgWidth}
                height={imgHeight}
                className="rounded-xl object-cover self-center sm:self-center justify-center"
              />
              <div className="flex flex-col py-2 sm:py-0">
                <div>
                  <CardTitle className="text-lg font-bold sm:pt-2 line-clamp-1">
                    S{nextEpisode.season_number}:E{nextEpisode.episode_number}:{' '}
                    {nextEpisode.episode_details.name}
                  </CardTitle>
                  <CardContent className="text-sm text-gray-700 py-2 sm:py-0 pb-0 px-0 line-clamp-3">
                    {nextEpisode.episode_details.overview}
                  </CardContent>
                </div>
              </div>
            </div>
          </Link>
          <div className="flex sm:flex-col gap-2 p-2 sm:p-4">
            <EpisodeWatchedToggle
              id={tvId}
              seasonNumber={nextEpisode.season_number.toString()}
              episodeNumber={nextEpisode.episode_number.toString()}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
