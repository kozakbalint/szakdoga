import { TvCast } from '@/features/cast/components/tv-cast';
import { TvHeader } from './tv-header';
import { TvSeasons } from './tv-seasons';

export const TvView = ({ tvId }: { tvId: string }) => {
  return (
    <div className="flex flex-col gap-8">
      <TvHeader tvId={tvId} />
      <TvSeasons tvId={tvId} />
      <TvCast tvId={tvId} />
    </div>
  );
};
