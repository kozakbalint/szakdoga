import type { Meta, StoryObj } from '@storybook/react';

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from './dropdown-menu';
import { Button } from '../button';

const DemoDropdown = () => (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button>Menu</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Menu</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem>Item 1</DropdownMenuItem>
        <DropdownMenuItem>Item 2</DropdownMenuItem>
        <DropdownMenuItem>Item 3</DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);

const meta: Meta<typeof DropdownMenu> = {
  component: DropdownMenu,
};

export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const Demo: Story = {
  render: () => <DemoDropdown />,
};
