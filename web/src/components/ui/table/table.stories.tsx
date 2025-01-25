import type { Meta, StoryObj } from '@storybook/react';

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableCaption,
  TableFooter,
  TableHeader,
} from './table';

const DemoTable = () => (
  <Table>
    <TableCaption>Table Caption</TableCaption>
    <TableHeader>
      <TableRow>
        <TableCell>Header 1</TableCell>
        <TableCell>Header 2</TableCell>
        <TableCell>Header 3</TableCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Row 1 Cell 1</TableCell>
        <TableCell>Row 1 Cell 2</TableCell>
        <TableCell>Row 1 Cell 3</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Row 2 Cell 1</TableCell>
        <TableCell>Row 2 Cell 2</TableCell>
        <TableCell>Row 2 Cell 3</TableCell>
      </TableRow>
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell>Footer 1</TableCell>
        <TableCell>Footer 2</TableCell>
        <TableCell>Footer 3</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
);

const meta: Meta<typeof Table> = {
  component: Table,
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Demo: Story = {
  render: () => <DemoTable />,
};
