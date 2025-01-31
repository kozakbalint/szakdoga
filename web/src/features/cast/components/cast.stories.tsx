import type { Meta, StoryObj } from '@storybook/react';

import { Cast } from './cast';

const DemoCast = () => (
  <div className="flex gap-4">
    <Cast
      actor={{
        id: 1,
        name: 'John Doe',
        character: 'John Doe',
        profile_url: '',
        popularity: 1,
        order: 1,
      }}
    />
    <Cast
      actor={{
        id: 2,
        name: 'Jane Doe',
        roles: [{ character: 'John Doe', episode_count: 15 }],
        profile_url: 'https://github.com/shadcn.png',
        popularity: 1,
        order: 1,
      }}
    />
  </div>
);

const meta: Meta<typeof Cast> = {
  component: Cast,
};

export default meta;

type Story = StoryObj<typeof Cast>;

export const Demo: Story = {
  render: () => <DemoCast />,
};
