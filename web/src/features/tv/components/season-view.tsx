import { useGetTvDetails } from '../api/get-tv-details';
import { useGetTvSeasonDetails } from '../api/get-tv-season-details';
import { TvEpisodeItem } from './tv-episode-item';

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
  );
};
