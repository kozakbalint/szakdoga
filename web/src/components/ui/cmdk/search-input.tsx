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
  groups: SearchInputGroup[];
};

export type SearchInputGroup = {
  title: string;
  items: SearchInputItem[];
};

export type SearchInputItem = {
  title: string;
  shortcut?: string;
  onSelect: () => void;
};

export const SearchInput = ({ className, groups }: SearchInputProps) => {
  const [open, setOpen] = React.useState(false);

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
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput autoFocus />
        <CommandList>
          {groups.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.title}
                  onSelect={() => {
                    item.onSelect();
                    setOpen(false);
                  }}
                >
                  {item.title}
                  {item.shortcut && (
                    <CommandShortcut>{item.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandEmpty>No results found</CommandEmpty>
        </CommandList>
      </CommandDialog>
    </>
  );
};
