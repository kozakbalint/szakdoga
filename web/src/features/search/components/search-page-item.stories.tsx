import type { Meta, StoryObj } from '@storybook/react';
import { SearchPageItem } from './search-page-item';
import { SearchMovie, SearchPeople } from '@/types/types.gen';

const movie = {
  id: 1,
  title: 'Inception',
  poster_url: '',
  popularity: 100,
  vote_average: 1,
  overview: 'A movie about dreams',
  release_date: '2021-01-01',
} as SearchMovie;

const person = {
  id: 1,
  name: 'John Doe',
  profile_url: '',
  popularity: 1,
} as SearchPeople;

const DemoSearchPageItem = () => (
  <div className="flex flex-col gap-4">
    <SearchPageItem data={movie} type="movie" />
    <SearchPageItem data={movie} type="tv" />
    <SearchPageItem data={person} type="person" />
  </div>
);

const meta: Meta<typeof SearchPageItem> = {
  component: SearchPageItem,
};

export default meta;

type Story = StoryObj<typeof SearchPageItem>;

export const Demo: Story = {
  render: () => <DemoSearchPageItem />,
};
