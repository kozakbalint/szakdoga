import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from '@tanstack/react-router';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

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

  const isMobile = useIsMobile();

  const imgWidth = isMobile ? 100 : 100;
  const imgHeight = isMobile ? 100 : 150;

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          id="movie-watched-search"
          placeholder="Search..."
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
            <Card key={row.id} className="shadow-md">
              <Link to={`/app/people/${row.getValue('id')}`}>
                <div className="flex flex-col sm:flex-row gap-4 p-2 sm:p-0 justify-between">
                  <div className="flex gap-4">
                    {row.getValue('profile_url') === '' ? (
                      <div
                        className="bg-secondary rounded-xl"
                        style={{ width: imgWidth, height: imgHeight }}
                      />
                    ) : (
                      <img
                        src={row.getValue('profile_url') || ''}
                        alt={row.getValue('name') || 'Profile'}
                        width={imgWidth}
                        height={imgHeight}
                        className="rounded-xl object-cover self-center sm:self-start"
                      />
                    )}
                    <div className="flex flex-col py-2 sm:py-0">
                      <div>
                        <CardTitle className="text-lg font-bold sm:pt-2">
                          {flexRender(
                            row
                              .getVisibleCells()
                              .find((cell) => cell.column.id === 'name')?.column
                              .columnDef.cell,
                            row
                              .getVisibleCells()
                              .find((cell) => cell.column.id === 'name')!
                              .getContext(),
                          )}
                        </CardTitle>
                        {!isTv ? (
                          <CardDescription className="text-sm text-gray-500">
                            {flexRender(
                              row
                                .getVisibleCells()
                                .find((cell) => cell.column.id === 'character')
                                ?.column.columnDef.cell,
                              row
                                .getVisibleCells()
                                .find((cell) => cell.column.id === 'character')!
                                .getContext(),
                            )}
                          </CardDescription>
                        ) : (
                          <div className="flex gap-2 text-sm text-muted-foreground">
                            {flexRender(
                              row
                                .getVisibleCells()
                                .find((cell) => cell.column.id === 'roles')
                                ?.column.columnDef.cell,
                              row
                                .getVisibleCells()
                                .find((cell) => cell.column.id === 'roles')!
                                .getContext(),
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
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
