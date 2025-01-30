import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SeasonWatchedToggle } from '@/features/watched/components/watchedtoggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { TvSeason } from '@/types/types.gen';
import { Link } from '@tanstack/react-router';
import { Star } from 'lucide-react';

export const TvSeasonItem = ({
  season,
  tvId,
  seasonNumber,
}: {
  season: TvSeason;
  tvId: string;
  seasonNumber: number;
}) => {
  const isMobile = useIsMobile();

  const imgWidth = isMobile ? 100 : 100;
  const imgHeight = isMobile ? 150 : 150;

  return (
    <Card key={seasonNumber} className="shadow-md">
      <div className="flex flex-col sm:flex-row gap-4 p-2 sm:p-0 justify-between">
        <Link to={'/app/season/' + `${tvId}/${seasonNumber}`} className="group">
          <div className="flex gap-4">
            {season.poster_url === '' ? (
              <Skeleton
                className="rounded-xl shrink-0"
                style={{ width: imgWidth, height: imgHeight }}
              />
            ) : (
              <img
                src={season.poster_url}
                alt={season.name}
                width={imgWidth}
                height={imgHeight}
                className="rounded-xl object-cover self-center sm:self-start"
              />
            )}
            <div className="flex flex-col py-2 sm:py-0">
              <div>
                <CardTitle className="text-lg font-bold sm:pt-2 group-hover:underline">
                  {season.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-300">
                  Rating:{' '}
                  <Star
                    className="inline align-text-bottom"
                    fill="gold"
                    size={16}
                  />{' '}
                  {season.vote_average}
                </CardDescription>
              </div>
              <CardContent className="text-sm text-gray-500 py-2 sm:py-0 pb-0 px-0 line-clamp-4">
                {season.overview}
              </CardContent>
            </div>
          </div>
        </Link>
        <div className="flex sm:flex-col gap-2 p-2 sm:p-4">
          <SeasonWatchedToggle
            id={tvId}
            seasonNumber={seasonNumber.toString()}
          />
        </div>
      </div>
    </Card>
  );
};
