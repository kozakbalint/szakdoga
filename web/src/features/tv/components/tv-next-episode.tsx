import { useIsTvOnWatched } from '@/features/watched/api/is-tv-on-watched';
import { TvEpisodeItem } from './tv-episode-item';
import { TvEpisode } from '@/types/types.gen';

export const NextEpisode = ({ tvId }: { tvId: string }) => {
  const watchedQuery = useIsTvOnWatched({ id: tvId });

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
      <TvEpisodeItem
        episode={nextEpisode.episode_details as TvEpisode}
        tvId={tvId}
        seasonNumber={nextEpisode.season_number}
        episodeNumber={nextEpisode.episode_number}
      />
    </div>
  );
};
