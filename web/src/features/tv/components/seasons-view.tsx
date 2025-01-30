import { useGetTvDetails } from '../api/get-tv-details';
import { TvSeasonItem } from './tv-season-item';

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
      {tv.seasons.map((season, index) => (
        <TvSeasonItem
          key={index + 1}
          season={season}
          tvId={id}
          seasonNumber={index + 1}
        />
      ))}
    </div>
  );
};
