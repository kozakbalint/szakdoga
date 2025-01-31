import { Input } from '@/components/ui/input';
import { Link } from '@tanstack/react-router';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { DataTableItem } from './data-table-item';

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  isTv: boolean;
}

export function CastDataTable<TData, TValue>({
  data,
  columns,
  isTv,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          id="cast-search"
          placeholder="Search Cast..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="grid gap-4">
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <Link
              key={row.id}
              to={'/app/people/' + row.getValue('id')}
              resetScroll={true}
            >
              <DataTableItem row={row} isTv={isTv} />
            </Link>
          ))
        ) : (
          <div className="text-center p-4">
            Could not find any cast members.
          </div>
        )}
      </div>
    </div>
  );
}
