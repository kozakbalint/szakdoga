import { CommandItem, CommandList } from '@/components/ui/cmdk';
import { AspectRatio } from '@/components/ui/aspectratio';
import { CommandLoading, useCommandState } from 'cmdk';
import { SearchTvResponse } from '@/types/api';
import { useSearchTV } from '../api/search-tv';
import { getTvByIdQueryOptions } from '@/features/tv/api/get-tv-by-id';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { getTvSeasonByIdQueryOptions } from '@/features/tv/api/get-tv-season-by-id';
import { Spinner } from '@/components/ui/spinner';
import { useDebounce } from '@uidotdev/usehooks';

export interface SearchPageTVProps {
  searchTerm: string;
  onSelect: (tv: SearchTvResponse) => void;
}

export const SearchPageTV = ({ searchTerm, onSelect }: SearchPageTVProps) => {
  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(searchTerm, 500);

  const currentItem = useCommandState((state) => state.value);
  React.useEffect(() => {
    const prefetchTv = (id: string) => {
      queryClient.prefetchQuery(getTvByIdQueryOptions({ id }));
      queryClient.prefetchQuery(
        getTvSeasonByIdQueryOptions({ id, seasonId: '1' }),
      );
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
            key={tv.id + tv.name}
            value={tv.name + '_tvID:' + tv.id}
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
                        alt={tv.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </AspectRatio>
                  )}
                </div>
                <div className="flex flex-col align-middle">
                  <p className="font-medium">{tv.name}</p>
                  <p className="text-sm font-thin">
                    {tv.first_air_date.slice(0, 4)}
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
