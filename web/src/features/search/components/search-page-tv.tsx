import { CommandItem, CommandList } from '@/components/ui/cmdk';
import { CommandLoading } from 'cmdk';
import { SearchTvResponse } from '@/types/api';
import { useSearchTV } from '../api/search-tv';

export interface SearchPageTVProps {
  searchTerm: string;
  onSelect: (tv: SearchTvResponse) => void;
}

export const SearchPageTV = ({ searchTerm, onSelect }: SearchPageTVProps) => {
  const searchTVQuery = useSearchTV({ q: searchTerm });
  const tv = searchTVQuery.data?.tv;

  if (tv == null || tv.length === 0 || tv === undefined) {
    return (
      <CommandList>
        <CommandLoading className="px-4 py-2">
          <p>No tv shows found...</p>
        </CommandLoading>
      </CommandList>
    );
  }

  return (
    <>
      <CommandList>
        {tv.map((tv) => (
          <CommandItem
            key={tv.id + tv.name}
            value={tv.name + tv.id}
            onSelect={() => {
              onSelect(tv);
            }}
          >
            <div className="flex gap-2 items-start align-middle">
              <p>{tv.name}</p>
              <p className="text-muted text-sm">
                {tv.first_air_date.slice(0, 4)}
              </p>
            </div>
          </CommandItem>
        ))}
      </CommandList>
    </>
  );
};
