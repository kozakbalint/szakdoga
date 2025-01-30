import { Star } from 'lucide-react';
import { useGetTvDetails } from '../api/get-tv-details';
import { useGetTvSeasonDetails } from '../api/get-tv-season-details';
import { TvEpisodeItem } from './tv-episode-item';
import { SeasonWatchedToggle } from '@/features/watched/components/watchedtoggle';

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
        {tv.name}: Seasons {seasonId}
      </div>
      <div className="flex flex-row gap-10">
        <div className="flex flex-col sm:flex-row gap-3">
          <img
            src={season.poster_url}
            alt={season.name}
            className="sm:h-96 rounded-xl"
          />
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xl">
              <span>{season.name}</span>
              <div className="flex gap-1 items-center">
                <Star size={18} fill="gold" className="inline align-bottom" />{' '}
                {season.vote_average}
              </div>
            </div>
            <div className="text-sm text-gray-500">{season.overview}</div>
          </div>
        </div>
        <div>
          <SeasonWatchedToggle id={id} seasonNumber={seasonId} />
        </div>
      </div>
      <div>
        <div className="text-xl pb-2">Episodes:</div>
        <div className="flex flex-row sm:flex-col gap-2 flex-wrap justify-center sm:justify-start">
          {season.episodes.map((episode, index) => (
            <TvEpisodeItem
              key={index}
              episode={episode}
              tvId={id}
              seasonNumber={Number(seasonId)}
              episodeNumber={index + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
