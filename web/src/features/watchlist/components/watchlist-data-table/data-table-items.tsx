import {
  MovieWatchedToggle,
  TvWatchedToggle,
} from '@/features/watched/components/watchedtoggle';
import { MovieWatchlistToggle, TvWatchlistToggle } from '../watchlisttoggle';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import { flexRender, Row } from '@tanstack/react-table';
import { Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const DataTableItem = ({
  row,
  isTv,
}: {
  row: Row<unknown>;
  isTv: boolean;
}) => {
  const isMobile = useIsMobile();

  const imgWidth = isMobile ? 100 : 100;
  const imgHeight = isMobile ? 150 : 150;

  const link = isTv ? `/app/tv/` : `/app/movies/`;

  return (
    <Card key={row.id} className="shadow-md">
      <div className="flex flex-col sm:flex-row gap-4 p-2 sm:p-0 justify-between">
        <Link to={link + `${row.getValue('id')}`} className="group">
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
                      .find((cell) => cell.column.id === 'title')?.column
                      .columnDef.cell,
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
                      .find((cell) => cell.column.id === 'vote_average')?.column
                      .columnDef.cell,
                    row
                      .getVisibleCells()
                      .find((cell) => cell.column.id === 'vote_average')!
                      .getContext(),
                  )}
                </CardDescription>
              </div>
              <CardContent className="text-sm text-gray-700 py-2 sm:py-0 pb-0 px-0 line-clamp-4">
                {flexRender(
                  row
                    .getVisibleCells()
                    .find((cell) => cell.column.id === 'overview')?.column
                    .columnDef.cell,
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
          {isTv ? (
            <>
              <TvWatchlistToggle
                id={row.getValue('id') as string}
                type="TV"
                isOnWatchlist={true}
              />
              <TvWatchedToggle id={row.getValue('id') as string} />
            </>
          ) : (
            <>
              <MovieWatchlistToggle
                id={row.getValue('id') as string}
                type="Movie"
                isOnWatchlist={true}
              />
              <MovieWatchedToggle id={row.getValue('id') as string} />
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
