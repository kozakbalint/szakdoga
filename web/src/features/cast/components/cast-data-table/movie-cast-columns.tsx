import { CastMovies } from '@/types/types.gen';
import { ColumnDef } from '@tanstack/react-table';

export type CastMovieItem = CastMovies;

export const castMovieColumns: ColumnDef<CastMovieItem>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
    cell: ({ row }) => row.getValue('id'),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.getValue('name'),
  },
  {
    accessorKey: 'character',
    header: 'Character',
    cell: ({ row }) => {
      const releaseDate = row.getValue('character')!.toString();
      return releaseDate.split('-')[0];
    },
  },
  {
    accessorKey: 'order',
    header: 'Order',
    cell: ({ row }) => {
      const voteAverage = row.getValue('order') as number;
      return voteAverage.toFixed(1);
    },
  },
  {
    accessorKey: 'profile_url',
    header: 'Profile',
    cell: ({ row }) => row.getValue('profile_url'),
  },
];
