import { SearchInput } from '@/features/search/components/search-input';
import { SidebarProvider, SidebarTrigger, AppSidebar } from '../ui/sidebar';
import { ThemeModeToggle } from '../ui/theme';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col h-screen w-full">
        <header className="sticky top-0 z-10 flex gap-4 items-center justify-between px-4 py-2 bg-primary-foreground shadow-sm">
          <div className="flex align-middle h-max">
            <SidebarTrigger />
          </div>
          <div className="w-max flex-grow flex justify-center h-max">
            <SearchInput />
          </div>
          <div>
            <ThemeModeToggle />
          </div>
        </header>
        <main className="grid flex-grow flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
