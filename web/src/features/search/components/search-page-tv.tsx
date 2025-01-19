import { CommandItem, CommandList } from '@/components/ui/cmdk';
import { AspectRatio } from '@/components/ui/aspectratio';
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
        {tv.map((tv) => (
          <CommandItem
            key={tv.id + tv.title}
            value={tv.title + '_tvID:' + tv.id}
            onSelect={() => {
              onSelect(tv);
            }}
          >
            <div className="flex flex-grow justify-between">
              <div className="flex gap-4 items-start align-middle">
                <div className="w-12">
                  {tv.poster_url == '' ? (
                    <div className="w-full h-full bg-gray-300 rounded-md"></div>
                  ) : (
                    <AspectRatio ratio={2 / 3}>
                      <img
                        src={tv.poster_url}
                        alt={tv.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </AspectRatio>
                  )}
                </div>
                <div className="flex flex-col align-middle">
                  <p className="font-medium">{tv.title}</p>
                  <p className="text-sm font-thin">
                    {tv.release_date.slice(0, 4)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col align-middle">
                <p className="text-sm font-thin">Popularity:</p>
                <p className="text-sm font-medium">{tv.popularity}</p>
              </div>
            </div>
          </CommandItem>
        ))}
      </CommandList>
    </>
  );
};
