import { UserStats } from '@/types/types.gen';
import { Film, PlayCircle, Tv } from 'lucide-react';
import { Stat } from './stat';

export const DashboardStats = ({ data }: { data: UserStats }) => {
  return (
    <div className="flex gap-2 flex-wrap justify-center pt-2">
      <Stat
        title="Movies Watched"
        icon={<Film className="h-4 w-4 text-foreground" />}
        value={data.watched_movies}
      />
      <Stat
        title="Episodes Watched"
        icon={<Tv className="h-4 w-4 text-foreground" />}
        value={data.watched_episodes}
      />
      <Stat
        title="Watchlist Items"
        icon={<PlayCircle className="h-4 w-4 text-foreground" />}
        value={data.watchlist_count}
      />
    </div>
  );
};
