import { CommandItem, CommandList } from '@/components/ui/cmdk';
import { CommandLoading, useCommandState } from 'cmdk';
import { SearchPeople } from '@/types/types.gen';
import { useSearchPeople } from '../api/search-people';
import { getPersonDetailsQueryOptions } from '@/features/people/api/get-person-details';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useDebounce } from '@uidotdev/usehooks';
import { SearchPageItem } from './search-page-item';

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
        {people
          .filter((person) => person.popularity > 1)
          .sort((a, b) => b.popularity - a.popularity)
          .map((person) => (
            <CommandItem
              key={person.id}
              value={person.name + '_personID:' + person.id}
              onSelect={() => {
                onSelect(person);
              }}
            >
              <SearchPageItem data={person} type="person" />
            </CommandItem>
          ))}
      </CommandList>
    </>
  );
};
