import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { EpisodeWatchedToggle } from '@/features/watched/components/watchedtoggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { TvEpisode } from '@/types/types.gen';
import { Link } from '@tanstack/react-router';

export const TvEpisodeItem = ({
  episode,
  tvId,
  seasonNumber,
  episodeNumber,
}: {
  episode: TvEpisode;
  tvId: string;
  seasonNumber: number;
  episodeNumber: number;
}) => {
  const isMobile = useIsMobile();

  const imgWidth = isMobile ? 300 : 200;
  const imgHeight = isMobile ? 100 : 100;

  return (
    <Card key={episodeNumber} className="shadow-md w-full">
      <div className="flex flex-col sm:flex-row gap-4 p-0 justify-between">
        <Link
          to={`/app/episode/` + `${tvId}/${seasonNumber}/${episodeNumber}`}
          className="group grow"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {episode.still_url === '' ? (
              <div
                className="bg-secondary rounded-xl shrink-0"
                style={{ width: imgWidth, height: imgHeight }}
              ></div>
            ) : (
              <img
                src={episode.still_url}
                alt={episode.name}
                width={imgWidth}
                height={imgHeight}
                className="rounded-xl object-cover self-center sm:self-center justify-center"
              />
            )}
            <div className="flex flex-col p-2 sm:p-0">
              <div>
                <CardTitle className="text-lg font-bold sm:pt-2 flex gap-2 group-hover:underline">
                  <span className="line-clamp-1">
                    {episodeNumber + '.' + ' '}
                    {episode.name}
                  </span>
                </CardTitle>
                <CardContent className="text-sm text-gray-700 py-2 sm:py-0 pb-0 px-0 line-clamp-3">
                  {episode.overview}
                </CardContent>
              </div>
            </div>
          </div>
        </Link>
        <div className="flex sm:flex-col gap-2 p-2 sm:p-4">
          <EpisodeWatchedToggle
            id={tvId}
            seasonNumber={seasonNumber.toString()}
            episodeNumber={episodeNumber.toString()}
          />
        </div>
      </div>
    </Card>
  );
};
