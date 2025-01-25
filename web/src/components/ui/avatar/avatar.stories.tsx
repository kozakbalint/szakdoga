import type { Meta, StoryObj } from '@storybook/react';

import { Avatar, AvatarImage, AvatarFallback } from './avatar';

const meta: Meta<typeof Avatar> = {
  component: Avatar,
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="Balint Kozak" />
      <AvatarFallback>KB</AvatarFallback>
    </Avatar>
  ),
};
