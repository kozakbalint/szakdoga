import type { Meta, StoryObj } from '@storybook/react';

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
  DrawerHeader,
  DrawerFooter,
} from './drawer';

const DemoDrawer = () => (
  <Drawer>
    <DrawerTrigger>Open Drawer</DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Drawer Title</DrawerTitle>
        <DrawerDescription>Drawer Description</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>Drawer Footer</DrawerFooter>
    </DrawerContent>
  </Drawer>
);

const meta: Meta<typeof Drawer> = {
  component: Drawer,
};

export default meta;

type Story = StoryObj<typeof Drawer>;

export const Demo: Story = {
  render: () => <DemoDrawer />,
};
