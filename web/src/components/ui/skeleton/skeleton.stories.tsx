import type { Meta } from '@storybook/react';

import { Skeleton } from './skeleton';

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
};

export default meta;

export const Default = () => (
  <div className="flex flex-col gap-4">
    <Skeleton className="h-[125px] w-[250px]" />
    <div className="flex flex-col gap-4">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[100px]" />
    </div>
  </div>
);
