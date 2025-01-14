import { useGetTvEpisodeDetails } from '../api/get-tv-episode-details';

export const EpisodeView = ({
  id,
  seasonId,
  episodeId,
}: {
  id: string;
  seasonId: string;
  episodeId: string;
}) => {
  const episodeQuery = useGetTvEpisodeDetails({ id, seasonId, episodeId });

  if (episodeQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const episode = episodeQuery.data?.episode;

  if (!episode) {
    return <div>Episode not found</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col sm:flex-row gap-2">
        <img
          src={episode.still_url}
          alt={episode.name}
          className="w-3/4 sm:w-1/3"
        />
        <div className="flex flex-col gap-2">
          <div className="text-2xl">{episode.name}</div>
          <div>{episode.overview}</div>
        </div>
      </div>
    </div>
  );
};
