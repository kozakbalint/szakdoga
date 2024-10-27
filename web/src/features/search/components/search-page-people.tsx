import { CommandItem, CommandList } from '@/components/ui/cmdk';
import { CommandLoading } from 'cmdk';
import { SearchPersonResponse } from '@/types/api';
import { useSearchPeople } from '../api/search-people';

export interface SearchPagePeopleProps {
  searchTerm: string;
  onSelect: (person: SearchPersonResponse) => void;
}

export const SearchPagePeople = ({
  searchTerm,
  onSelect,
}: SearchPagePeopleProps) => {
  const searchPeopleQuery = useSearchPeople({ q: searchTerm });
  const people = searchPeopleQuery.data?.people;

  if (people == null || people.length === 0 || people === undefined) {
    return (
      <CommandList>
        <CommandLoading className="px-4 py-2">
          <p>No people found...</p>
        </CommandLoading>
      </CommandList>
    );
  }

  return (
    <>
      <CommandList>
        {people.map((person) => (
          <CommandItem
            key={person.id + person.name}
            value={person.name + person.id}
            onSelect={() => {
              onSelect(person);
            }}
          >
            <div className="flex gap-2 items-start align-middle">
              <p>{person.name}</p>
              <p className="text-muted text-sm">{person.popularity}</p>
            </div>
          </CommandItem>
        ))}
      </CommandList>
    </>
  );
};
