import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { TvWatchlistToggle } from '@/features/watchlist/components/watchlisttoggle';
import { Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Link } from '@tanstack/react-router';
import { TvWatchedToggle } from '@/features/watched/components/watchedtoggle';

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
}

export function WatchlistTvDataTable<TData, TValue>({
  data,
  columns,
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
          id="tv-watchlist-search"
          placeholder="Search..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="grid gap-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <Card key={row.id} className="shadow-md">
              <div className="flex flex-col sm:flex-row gap-4 p-2 sm:p-0 justify-between">
                <Link
                  to={`/app/tv/` + `${row.getValue('id')}`}
                  className="group"
                >
                  <div className="flex gap-4">
                    <img
                      src={row.getValue('poster_url') || ''}
                      alt={row.getValue('title') || 'Poster'}
                      width={imgWidth}
                      height={imgHeight}
                      className="rounded-xl object-cover self-center sm:self-start"
                    />
                    <div className="flex flex-col py-2 sm:py-0">
                      <div>
                        <CardTitle className="text-lg font-bold sm:pt-2 group-hover:underline">
                          {flexRender(
                            row
                              .getVisibleCells()
                              .find((cell) => cell.column.id === 'title')
                              ?.column.columnDef.cell,
                            row
                              .getVisibleCells()
                              .find((cell) => cell.column.id === 'title')!
                              .getContext(),
                          )}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          Rating:{' '}
                          <Star
                            className="inline align-text-bottom"
                            fill="gold"
                            size={16}
                          />{' '}
                          {flexRender(
                            row
                              .getVisibleCells()
                              .find((cell) => cell.column.id === 'vote_average')
                              ?.column.columnDef.cell,
                            row
                              .getVisibleCells()
                              .find(
                                (cell) => cell.column.id === 'vote_average',
                              )!
                              .getContext(),
                          )}
                        </CardDescription>
                      </div>
                      <CardContent className="text-sm text-gray-700 py-2 sm:py-0 pb-0 px-0 line-clamp-4">
                        {flexRender(
                          row
                            .getVisibleCells()
                            .find((cell) => cell.column.id === 'overview')
                            ?.column.columnDef.cell,
                          row
                            .getVisibleCells()
                            .find((cell) => cell.column.id === 'overview')!
                            .getContext(),
                        )}
                      </CardContent>
                    </div>
                  </div>
                </Link>
                <div className="flex sm:flex-col gap-2 p-2 sm:p-4">
                  <TvWatchlistToggle
                    id={row.getValue('id') as string}
                    type="Movie"
                    isOnWatchlist={true}
                  />
                  <TvWatchedToggle id={row.getValue('id') as string} />
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center p-4">
            Currently no movies on your watchlist.
          </div>
        )}
      </div>
    </div>
  );
}
