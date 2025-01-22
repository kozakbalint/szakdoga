import { useGetWatched } from '../api/get-watched';
import { watchedTvColumns } from './tv-data-table/columns';
import { WatchedTvDataTable } from './tv-data-table/data-table';

export const TvWatched = () => {
  const watchedTvQuery = useGetWatched({});
  if (watchedTvQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const watchedTv = watchedTvQuery.data?.watched.tv;
  if (!watchedTv) {
    return 'No tv shows in watched list';
  }

  return <WatchedTvDataTable columns={watchedTvColumns} data={watchedTv} />;
};
