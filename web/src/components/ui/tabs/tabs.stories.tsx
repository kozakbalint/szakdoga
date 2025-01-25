import type { Meta, StoryObj } from '@storybook/react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const DemoTabs = () => (
  <Tabs defaultValue="movies">
    <TabsList>
      <TabsTrigger value="movies">Movies</TabsTrigger>
      <TabsTrigger value="tv">TV Shows</TabsTrigger>
    </TabsList>
    <TabsContent value="movies">Movies</TabsContent>
    <TabsContent value="tv">TV Shows</TabsContent>
  </Tabs>
);

const meta: Meta<typeof Tabs> = {
  component: Tabs,
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Demo: Story = {
  render: () => <DemoTabs />,
};
