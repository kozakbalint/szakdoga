import { useGetWatched } from '../api/get-watched';
import { watchedTvColumns } from './watched-data-table/tv-columns';
import { WatchedDataTable } from './watched-data-table/data-table';

export const TvWatched = () => {
  const watchedTvQuery = useGetWatched({});
  if (watchedTvQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const watchedTv = watchedTvQuery.data?.watched.tv;
  if (!watchedTv) {
    return 'No tv shows in watched list';
  }

  return (
    <WatchedDataTable columns={watchedTvColumns} data={watchedTv} isTv={true} />
  );
};
