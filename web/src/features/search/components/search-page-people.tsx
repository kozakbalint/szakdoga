import { CommandItem, CommandList } from '@/components/ui/cmdk';
import { AspectRatio } from '@/components/ui/aspectratio';
import { CommandLoading, useCommandState } from 'cmdk';
import { SearchPeople } from '@/types/types.gen';
import { useSearchPeople } from '../api/search-people';
import { getPersonDetailsQueryOptions } from '@/features/people/api/get-person-details';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useDebounce } from '@uidotdev/usehooks';

export interface SearchPagePeopleProps {
  searchTerm: string;
  onSelect: (person: SearchPeople) => void;
}

export const SearchPagePeople = ({
  searchTerm,
  onSelect,
}: SearchPagePeopleProps) => {
  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(searchTerm, 500);

  const currentItem = useCommandState((state) => state.value);
  React.useEffect(() => {
    const prefetchPerson = (id: string) => {
      queryClient.prefetchQuery(getPersonDetailsQueryOptions({ id }));
    };
    if (currentItem) {
      const idString = currentItem.split('_');
      const id = idString[idString.length - 1].split(':')[1];
      prefetchPerson(id);
    }
  }, [currentItem, queryClient]);

  const searchPeopleQuery = useSearchPeople({ q: debouncedSearch });
  const people = searchPeopleQuery.data?.people;

  if (searchTerm.length === 0) {
    return (
      <CommandList className="h-[300px]">
        <CommandLoading className="px-4 py-2 flex justify-center">
          <p>Type a person name.</p>
        </CommandLoading>
      </CommandList>
    );
  }

  if (people == null || people === undefined) {
    return (
      <CommandList className="h-[300px]">
        <CommandLoading className="flex justify-center py-4">
          <Spinner />
        </CommandLoading>
      </CommandList>
    );
  }

  if (people.length === 0) {
    return (
      <CommandList className="h-[300px]">
        <CommandLoading className="px-4 py-2 flex justify-center">
          <p>No person found.</p>
        </CommandLoading>
      </CommandList>
    );
  }

  return (
    <>
      <CommandList className="h-[300px]">
        {people.map((person) => (
          <CommandItem
            key={person.id + person.name}
            value={person.name + '_personID:' + person.id}
            onSelect={() => {
              onSelect(person);
            }}
          >
            <div className="flex grow justify-between">
              <div className="flex gap-4 items-start align-middle">
                <div className="w-12">
                  {person.profile_url == '' ? (
                    <div className="w-full h-full bg-gray-300 rounded-md"></div>
                  ) : (
                    <AspectRatio ratio={2 / 3}>
                      <img
                        src={person.profile_url}
                        alt={person.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </AspectRatio>
                  )}
                </div>
                <div className="flex flex-col align-middle">
                  <p className="font-medium">{person.name}</p>
                </div>
              </div>
              <div className="flex flex-col align-middle">
                <p className="text-sm font-thin">Popularity:</p>
                <p className="text-sm font-medium">{person.popularity}</p>
              </div>
            </div>
          </CommandItem>
        ))}
      </CommandList>
    </>
  );
};
