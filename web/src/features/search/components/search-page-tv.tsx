import { CommandItem, CommandList } from '@/components/ui/cmdk';
import { CommandLoading, useCommandState } from 'cmdk';
import { SearchTv } from '@/types/types.gen';
import { useSearchTV } from '../api/search-tv';
import { getTvDetailsQueryOptions } from '@/features/tv/api/get-tv-details';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { getTvSeasonDetailsQueryOptions } from '@/features/tv/api/get-tv-season-details';
import { Spinner } from '@/components/ui/spinner';
import { useDebounce } from '@uidotdev/usehooks';
import { getTvCastQueryOptions } from '@/features/cast/api/get-tv-cast';
import { getTvWatchProvidersQueryOptions } from '@/features/watchproviders/api/get-tv-watch-providers';
import { SearchPageItem } from './search-page-item';

export interface SearchPageTVProps {
  searchTerm: string;
  onSelect: (tv: SearchTv) => void;
}

export const SearchPageTV = ({ searchTerm, onSelect }: SearchPageTVProps) => {
  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(searchTerm, 500);

  const currentItem = useCommandState((state) => state.value);
  React.useEffect(() => {
    const prefetchTv = (id: string) => {
      queryClient.prefetchQuery(getTvDetailsQueryOptions({ id }));
      queryClient.prefetchQuery(
        getTvSeasonDetailsQueryOptions({ id, seasonId: '1' }),
      );
      queryClient.prefetchQuery(getTvCastQueryOptions({ id }));
      queryClient.prefetchQuery(getTvWatchProvidersQueryOptions({ id }));
    };
    if (currentItem) {
      const idString = currentItem.split('_');
      const id = idString[idString.length - 1].split(':')[1];
      prefetchTv(id);
    }
  }, [currentItem, queryClient]);

  const searchTVQuery = useSearchTV({ q: debouncedSearch });
  const tv = searchTVQuery.data?.tv;

  if (searchTerm.length === 0) {
    return (
      <CommandList className="h-[300px]">
        <CommandLoading className="px-4 py-2 flex justify-center">
          <p>Type a tv show title.</p>
        </CommandLoading>
      </CommandList>
    );
  }

  if (tv == null || tv === undefined) {
    return (
      <CommandList className="h-[300px]">
        <CommandLoading className="flex justify-center py-4">
          <Spinner />
        </CommandLoading>
      </CommandList>
    );
  }

  if (tv.length === 0) {
    return (
      <CommandList className="h-[300px]">
        <CommandLoading className="px-4 py-2 flex justify-center">
          <p>No tv show found.</p>
        </CommandLoading>
      </CommandList>
    );
  }

  return (
    <>
      <CommandList className="h-[300px]">
        {tv
          .filter((tv) => tv.popularity > 1)
          .sort((a, b) => b.popularity - a.popularity)
          .map((tv) => (
            <CommandItem
              key={tv.id}
              value={tv.title + '_tvID:' + tv.id}
              onSelect={() => {
                onSelect(tv);
              }}
            >
              <SearchPageItem data={tv} type="tv" />
            </CommandItem>
          ))}
      </CommandList>
    </>
  );
};
