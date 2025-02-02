import { UserStats } from '@/types/types.gen';
import { Film, PlayCircle, Tv } from 'lucide-react';
import { Stat } from './stat';
import { useGetUserStats } from '@/features/users/api/get-user-stats';

export const DashboardStats = () => {
  const userStatsQuery = useGetUserStats({});
  const data = userStatsQuery.data?.user_stats as UserStats;

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

export const SuspenseDashboardStats = () => {
  return (
    <div className="flex gap-2 flex-wrap justify-center pt-2">
      <Stat
        title="Movies Watched"
        icon={<Film className="h-4 w-4 text-foreground" />}
      />
      <Stat
        title="Episodes Watched"
        icon={<Tv className="h-4 w-4 text-foreground" />}
      />
      <Stat
        title="Watchlist Items"
        icon={<PlayCircle className="h-4 w-4 text-foreground" />}
      />
    </div>
  );
};
