import type { Meta, StoryObj } from '@storybook/react';

import {
  Select,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectContent,
  SelectLabel,
} from './select';

const DemoSelect = () => (
  <Select>
    <SelectTrigger>Open me</SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Group 1</SelectLabel>
        <SelectItem value="1">Option 1</SelectItem>
        <SelectItem value="2">Option 2</SelectItem>
        <SelectItem value="3">Option 3</SelectItem>
      </SelectGroup>
      <SelectGroup>
        <SelectLabel>Group 2</SelectLabel>
        <SelectItem value="4">Option 4</SelectItem>
        <SelectItem value="5">Option 5</SelectItem>
        <SelectItem value="6">Option 6</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
);

const meta: Meta<typeof Select> = {
  component: Select,
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Demo: Story = {
  render: () => <DemoSelect />,
};
