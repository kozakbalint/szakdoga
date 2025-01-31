import type { Meta, StoryObj } from '@storybook/react';

import { DataTableItem } from './data-table-item';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { castMovieColumns } from './movie-cast-columns';

const DemoDataTableItem = () => {
  const data = [
    {
      character: 'J. Robert Oppenheimer',
      id: 2037,
      name: 'Cillian Murphy',
      order: 0,
      popularity: 91.871,
      profile_url:
        'https://image.tmdb.org/t/p/w185/ycZpLjHxsNPvsB6ndu2D9qsx94X.jpg',
    },
    {
      character: 'Kitty Oppenheimer',
      id: 5081,
      name: 'Emily Blunt',
      order: 1,
      popularity: 55.473,
      profile_url:
        'https://image.tmdb.org/t/p/w185/kqsEGTXC1GATSIUVnE8lRggCZPp.jpg',
    },
  ];
  const columns = castMovieColumns;
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

  return table.getRowModel().rows.length ? (
    table
      .getRowModel()
      .rows.map((row) => <DataTableItem row={row} isTv={false} />)
  ) : (
    <div className="text-center p-4">Could not find any cast members.</div>
  );
};

const meta: Meta<typeof DataTableItem> = {
  component: DataTableItem,
};

export default meta;

type Story = StoryObj<typeof DataTableItem>;

export const Demo: Story = {
  render: () => <DemoDataTableItem />,
};
