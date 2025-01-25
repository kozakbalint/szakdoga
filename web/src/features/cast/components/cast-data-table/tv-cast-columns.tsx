import { CastTv } from '@/types/types.gen';
import { ColumnDef } from '@tanstack/react-table';

export type CastTvItem = CastTv;

export const castTvColumns: ColumnDef<CastTvItem>[] = [
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
  {
    accessorKey: 'roles',
    header: 'Roles',
    cell: ({ row }) => {
      const roles = row.getValue('roles') as {
        character: string;
        episode_count: number;
      }[];
      return (
        <div className="flex flex-col gap-1 pb-2">
          {roles.map((role, index) => (
            <div key={index} className="flex flex-col">
              <div>{role.character}</div>
              <div>({role.episode_count} episodes)</div>
            </div>
          ))}
        </div>
      );
    },
  },
];
