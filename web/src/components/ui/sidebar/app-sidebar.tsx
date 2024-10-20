import * as React from 'react';
import { SquareMenu, List } from 'lucide-react';

import { NavMain } from '@/components/ui/nav/nav-main';
import { NavUser } from '@/components/ui/nav/nav-user';
import { NavLogo } from '@/components/ui/nav/nav-logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useUser } from '@/lib/auth';

const navItems = [
  {
    title: 'Dashboard',
    url: './',
    icon: SquareMenu,
  },
  {
    title: 'Lists',
    url: './lists',
    icon: List,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user.data!} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
