import type { Meta, StoryObj } from '@storybook/react';

import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from './card';

const DemoCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Title</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription>Description</CardDescription>
    </CardContent>
    <CardFooter>Footer</CardFooter>
  </Card>
);

const meta: Meta<typeof Card> = {
  component: Card,
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Demo: Story = {
  render: () => <DemoCard />,
};
