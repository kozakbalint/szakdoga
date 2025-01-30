import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { flexRender, Row } from '@tanstack/react-table';

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

  return (
    <Card key={row.id} className="shadow-md group">
      <div className="flex flex-col sm:flex-row gap-4 p-0 justify-between">
        <div className="flex gap-4">
          {row.getValue('profile_url') === '' ? (
            <div
              className="bg-secondary rounded-xl shrink-0"
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
              <CardTitle className="text-lg font-bold sm:pt-2 group-hover:underline">
                {flexRender(
                  row
                    .getVisibleCells()
                    .find((cell) => cell.column.id === 'name')?.column.columnDef
                    .cell,
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
                      .find((cell) => cell.column.id === 'character')?.column
                      .columnDef.cell,
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
                      .find((cell) => cell.column.id === 'roles')?.column
                      .columnDef.cell,
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
    </Card>
  );
};
