import { CommandItem, CommandList } from '@/components/ui/cmdk';
import { AspectRatio } from '@/components/ui/aspectratio';
import { CommandLoading, useCommandState } from 'cmdk';
import { SearchPersonResponse } from '@/types/api';
import { useSearchPeople } from '../api/search-people';
import { getPersonByIdQueryOptions } from '@/features/people/api/get-person-by-id';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Spinner } from '@/components/ui/spinner';

export interface SearchPagePeopleProps {
  searchTerm: string;
  onSelect: (person: SearchPersonResponse) => void;
}

export const SearchPagePeople = ({
  searchTerm,
  onSelect,
}: SearchPagePeopleProps) => {
  const queryClient = useQueryClient();

  const currentItem = useCommandState((state) => state.value);
  React.useEffect(() => {
    const prefetchPerson = (id: string) => {
      queryClient.prefetchQuery(getPersonByIdQueryOptions({ id }));
    };
    if (currentItem) {
      const id = currentItem.split('-')[1];
      prefetchPerson(id);
    }
  }, [currentItem, queryClient]);

  const searchPeopleQuery = useSearchPeople({ q: searchTerm });
  const people = searchPeopleQuery.data?.people;

  if (searchTerm.length === 0) {
    return (
      <CommandList className="h-[300px]">
        <CommandLoading className="px-4 py-2 flex justify-center">
          <p>Type a movie title.</p>
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
          <p>No movies found.</p>
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
            value={person.name + '-' + person.id}
            onSelect={() => {
              onSelect(person);
            }}
          >
            <div className="flex flex-grow justify-between">
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
