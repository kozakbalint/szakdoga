import type { Meta, StoryObj } from '@storybook/react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';

const DemoCollapsible = () => (
  <Collapsible>
    <CollapsibleTrigger>Trigger</CollapsibleTrigger>
    <CollapsibleContent>Content</CollapsibleContent>
  </Collapsible>
);

const meta: Meta<typeof Collapsible> = {
  component: Collapsible,
};

export default meta;

type Story = StoryObj<typeof Collapsible>;

export const Demo: Story = {
  render: () => <DemoCollapsible />,
};
