import { useGetTvSeasonsById } from '../api/get-tv-seasons-by-id';

export const TvSeasons = ({ tvId }: { tvId: string }) => {
  const tvSeasonsQuery = useGetTvSeasonsById({ id: tvId });

  if (tvSeasonsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const seasons = tvSeasonsQuery.data?.seasons;

  if (!seasons) {
    return <div>Providers not found</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="text-2xl font-bold">Seasons</div>
      <div className="grid grid-cols-3 gap-4">
        {seasons.seasons.map((seasons) => (
          <div key={seasons.season_number} className="flex flex-col">
            <img
              src={seasons.poster_url}
              alt={seasons.name}
              className="w-full h-64 object-cover"
            />
            <div className="text-lg font-bold">{seasons.name}</div>
            <div className="text-lg">{seasons.episode_count} episodes</div>
          </div>
        ))}
      </div>
    </div>
  );
};
