import { Search } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/lib/auth';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/cmdk';
import { SearchPageMovies } from './search-page-movies';
import { SearchPageTV } from './search-page-tv';
import { SearchPagePeople } from './search-page-people';
import { useNavigate } from '@tanstack/react-router';

export type SearchInputProps = {
  className?: string;
  groups: SearchInputGroups[];
};

export type SearchInputGroups = {
  title: string;
  items: SearchInputItem[];
};

export type SearchInputItem = {
  title: string;
  shortcut?: string;
  page?: string;
  onSelect: () => void;
};

export const SearchInput = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const commandGroups: SearchInputGroups[] = [
    {
      title: 'Search',
      items: [
        {
          title: 'Movies',
          page: 'movies',
          onSelect: () => {},
        },
        {
          title: 'TV Shows',
          page: 'tv-shows',
          onSelect: () => {},
        },
        {
          title: 'People',
          page: 'people',
          onSelect: () => {},
        },
      ],
    },
    {
      title: 'Naviagtion',
      items: [
        {
          title: 'Dashboard',
          onSelect: () => navigate({ to: '/app/dashboard' }),
        },
        {
          title: 'Lists',
          onSelect: () => navigate({ to: '/app/watchlist' }),
        },
      ],
    },
    {
      title: 'User',
      items: [
        {
          title: 'Profile',
          onSelect: () => navigate({ to: '/app/profile' }),
        },
        {
          title: 'Settings',
          onSelect: () => navigate({ to: '/app/settings' }),
        },
        {
          title: 'Log Out',
          onSelect: () => {
            logout.mutate({});
          },
        },
      ],
    },
  ];

  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [shouldFilter, setShouldFilter] = React.useState(true);
  const [searchPlaceholder, setSearchPlaceholder] = React.useState('Search...');
  const [pages, setPages] = React.useState<string[]>([]);
  const page = pages[pages.length - 1];

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  React.useEffect(() => {
    if (pages.length > 0) {
      setShouldFilter(false);
    } else {
      setShouldFilter(true);
    }
  }, [pages.length, shouldFilter]);

  React.useEffect(() => {
    if (!open) {
      setSearch('');
      setPages([]);
      setSearchPlaceholder('Search...');
    }
  }, [open]);

  const handleInputClick = () => {
    setOpen(true);
  };

  return (
    <div
      className="flex grow justify-center"
      onKeyDown={(e) => {
        if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
          e.preventDefault();
          setPages((pages) => pages.slice(0, -1));
          setSearchPlaceholder('Search...');
        }
      }}
    >
      <Button
        variant={'outlineShortCut'}
        shortCut={'⌘K'}
        icon={<Search size={16} />}
        size={'sm'}
        onClick={handleInputClick}
        className="flex grow sm:max-w-sm md:max-w-md lg:max-w-lg"
      >
        Search...
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        shouldFilter={shouldFilter}
      >
        <CommandInput
          value={search}
          onValueChange={setSearch}
          autoFocus
          placeholder={searchPlaceholder}
        />

        {!page && (
          <CommandList className="h-[300px]">
            {commandGroups.map((group) => (
              <CommandGroup key={group.title} heading={group.title}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.title}
                    onSelect={() => {
                      item.onSelect();
                      if (item.page) {
                        setPages([...pages, item.page]);
                        setSearchPlaceholder(
                          group.title + ' ' + item.title + '...',
                        );
                        setSearch('');
                      } else {
                        setOpen(false);
                      }
                    }}
                  >
                    <div className="flex gap-2 items-start align-middle">
                      <p>{item.title}</p>
                      {item.shortcut && (
                        <CommandShortcut>{item.shortcut}</CommandShortcut>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            <CommandSeparator />
            <CommandEmpty>No results found.</CommandEmpty>
          </CommandList>
        )}

        {page === 'movies' && (
          <SearchPageMovies
            searchTerm={search}
            onSelect={(movie) => {
              navigate({ to: `/app/movies/${movie.id}` });
              setOpen(false);
            }}
          />
        )}
        {page === 'tv-shows' && (
          <SearchPageTV
            searchTerm={search}
            onSelect={(tv) => {
              navigate({ to: `/app/tv/${tv.id}` });
              setOpen(false);
            }}
          />
        )}
        {page === 'people' && (
          <SearchPagePeople
            searchTerm={search}
            onSelect={(person) => {
              navigate({ to: `/app/people/${person.id}` });
              setOpen(false);
            }}
          />
        )}
      </CommandDialog>
    </div>
  );
};
