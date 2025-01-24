import {
  ChevronsUpDown,
  LogOut,
  Settings,
  User as UserIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useLogout } from '@/lib/auth';
import { User } from '@/types/types.gen';
import { ThemeModeToggle } from '../theme';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

export function NavUser({ user }: { user: User }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isMobile } = useSidebar();
  const logout = useLogout();
  const navigate = useNavigate();
  const handleDropdownClose = useCallback(() => {
    if (!isDropdownOpen) {
      document.body.removeAttribute('style'); // Removes pointer-events: none
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    handleDropdownClose();
  }, [isDropdownOpen, handleDropdownClose]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserIcon className="size-4" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserIcon className="size-4" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ThemeModeToggle />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  navigate({ to: '/app/profile' });
                }}
              >
                <UserIcon size={16} />
                <p className="px-2">Account</p>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate({ to: '/app/settings' });
                }}
              >
                <Settings size={16} />
                <p className="px-2">Settings</p>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout.mutate({})}>
              <LogOut size={16} />
              <p className="px-2">Log out</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
