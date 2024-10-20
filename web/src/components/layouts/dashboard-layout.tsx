import { useNavigate } from 'react-router-dom';
import { useLogout } from '@/lib/auth';

import { SearchInput, SearchInputGroups } from '../ui/cmdk';
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { AppSidebar } from '../ui/nav/app-sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
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
          onSelect: () => navigate('.'),
        },
        {
          title: 'Lists',
          onSelect: () => navigate('./lists'),
        },
      ],
    },
    {
      title: 'User',
      items: [
        {
          title: 'Profile',
          onSelect: () => navigate('./profile'),
        },
        {
          title: 'Settings',
          onSelect: () => {},
        },
        {
          title: 'Sign Out',
          onSelect: () => logout.mutate({}),
        },
      ],
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col h-screen w-full">
        <header className="sticky top-0 z-10 flex gap-4 items-center justify-between px-4 py-2 bg-primary-foreground shadow-sm">
          <div className="flex align-middle h-max">
            <SidebarTrigger />
          </div>
          <div className="w-max flex-grow flex justify-center h-max">
            <SearchInput groups={commandGroups} />
          </div>
        </header>
        <main className="grid flex-grow flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
