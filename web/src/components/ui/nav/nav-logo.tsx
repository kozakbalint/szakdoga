import {
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from '@tanstack/react-router';

export function NavLogo() {
  const { open } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <SidebarMenu>
      <SidebarMenuItem className="text-center">
        <Link
          className="text-2xl text-center transition-[width] ease-linear duration-500 font-semibold text-primary"
          to="/app/dashboard"
          resetScroll={true}
        >
          {isMobile
            ? open
              ? 'Screenlog'
              : 'Screenlog'
            : open
              ? 'Screenlog'
              : 'SL'}
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
