import { ChevronRight, Star } from 'lucide-react';
import { useGetTvDetails } from '../api/get-tv-details';
import { useGetTvEpisodeDetails } from '../api/get-tv-episode-details';
import { EpisodeWatchedToggle } from '@/features/watched/components/watchedtoggle';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';

export const EpisodeView = ({
  id,
  seasonId,
  episodeId,
}: {
  id: string;
  seasonId: string;
  episodeId: string;
}) => {
  const tvQuery = useGetTvDetails({ id });
  const episodeQuery = useGetTvEpisodeDetails({ id, seasonId, episodeId });

  if (episodeQuery.isLoading || tvQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const tv = tvQuery.data?.tv;
  const episode = episodeQuery.data?.episode;

  if (!episode || !tv) {
    return <div>Episode not found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between w-full">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="text-2xl text-primary hover:underline">
              <Link to={`/app/tv/` + `${id}`} resetScroll={true}>
                {tv.name}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary">
              <ChevronRight />
            </BreadcrumbSeparator>
            <BreadcrumbItem className="text-2xl text-primary hover:underline">
              <Link
                to={`/app/season/` + `${id}/${seasonId}`}
                resetScroll={true}
              >
                Season {seasonId}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary">
              <ChevronRight />
            </BreadcrumbSeparator>
            <BreadcrumbItem className="text-2xl text-primary">
              Episode {episodeId}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <EpisodeWatchedToggle
          id={id}
          seasonNumber={seasonId}
          episodeNumber={episodeId}
        />
      </div>
      <div className="flex flex-row gap-10">
        <div className="flex flex-col sm:flex-row gap-3">
          {episode.still_url === '' ? (
            <Skeleton className="sm:h-36 sm:w-64 rounded-xl" />
          ) : (
            <img
              src={episode.still_url}
              alt={episode.name}
              className="sm:h-36 rounded-xl"
            />
          )}

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xl">
              <span>{episode.name}</span>
              <div className="flex gap-1 items-center">
                <Star size={18} fill="gold" className="inline align-bottom" />{' '}
                {episode.vote_average.toFixed(1)}
              </div>
            </div>
            <div className="text-sm text-gray-500">{episode.overview}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
