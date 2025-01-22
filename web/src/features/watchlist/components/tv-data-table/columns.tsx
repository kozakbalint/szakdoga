import { SearchTv } from '@/types/types.gen';
import { ColumnDef } from '@tanstack/react-table';

export type WatchlistTvItem = SearchTv;

export const watchlistTvColumns: ColumnDef<WatchlistTvItem>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
    cell: ({ row }) => row.getValue('id'),
  },
  {
    accessorKey: 'poster_url',
    header: 'Poster',
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => row.getValue('title'),
  },
  {
    accessorKey: 'release_date',
    header: 'Release Date',
    cell: ({ row }) => {
      const releaseDate = row.getValue('release_date')!.toString();
      return releaseDate.split('-')[0];
    },
  },
  {
    accessorKey: 'vote_average',
    header: 'Vote Average',
    cell: ({ row }) => {
      const voteAverage = row.getValue('vote_average') as number;
      return voteAverage.toFixed(1);
    },
  },
  {
    accessorKey: 'overview',
    header: 'Overview',
    cell: ({ row }) => row.getValue('overview'),
  },
];
