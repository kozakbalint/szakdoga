import { cn } from '@/utils/cn';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command';
import { Search } from 'lucide-react';
import React from 'react';
import { Button } from '../button';

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

export const SearchInput = ({ className, groups }: SearchInputProps) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
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

  const handleInputClick = () => {
    setOpen(true);
  };
  return (
    <>
      <div
        className={cn('justify-center', className)}
        onClick={handleInputClick}
      >
        <Command className="lg:max-w-lg">
          <Button variant={'outlineShortCut'} shortCut={'⌘K'} icon={<Search />}>
            Search...
          </Button>
        </Command>
      </div>
      <div
        onKeyDown={(e) => {
          if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
            e.preventDefault();
            setPages((pages) => pages.slice(0, -1));
            setSearchPlaceholder('Search...');
          }
        }}
      >
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            autoFocus
            placeholder={searchPlaceholder}
          />

          {!page && (
            <CommandList>
              {groups.map((group) => (
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
            <CommandList>
              <CommandSeparator />
              <CommandEmpty>No results found.</CommandEmpty>
            </CommandList>
          )}
          {page === 'tv-shows' && (
            <CommandList>
              <CommandSeparator />
              <CommandEmpty>No results found.</CommandEmpty>
            </CommandList>
          )}
          {page === 'people' && (
            <CommandList>
              <CommandSeparator />
              <CommandEmpty>No results found.</CommandEmpty>
            </CommandList>
          )}
        </CommandDialog>
      </div>
    </>
  );
};
