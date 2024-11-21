import {
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link } from '@tanstack/react-router';

export function NavLogo() {
  const { open } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link
          className="text-2xl text-center transition-[width] ease-linear duration-500 font-semibold text-primary"
          to="/app/dashboard"
        >
          {open ? 'ScreenLog' : 'SL'}
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
