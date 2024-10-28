import { CommandItem, CommandList } from '@/components/ui/cmdk';
import { AspectRatio } from '@/components/ui/aspectratio';
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
