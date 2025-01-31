import { TvEpisodeItem } from './tv-episode-item';
import { TvEpisode, WatchedTv } from '@/types/types.gen';

export const NextEpisode = ({
  tvId,
  data,
}: {
  tvId: string;
  data: WatchedTv;
}) => {
  const nextEpisode = data.next_episode;

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
      <TvEpisodeItem
        episode={nextEpisode.episode_details as TvEpisode}
        tvId={tvId}
        seasonNumber={nextEpisode.season_number}
        episodeNumber={nextEpisode.episode_number}
      />
    </div>
  );
};
