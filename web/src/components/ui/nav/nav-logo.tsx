import {
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link } from '@/components/ui/link';

export function NavLogo() {
  const { open } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link
          className="text-2xl text-center transition-[width] ease-linear duration-500 font-semibold"
          to="./dashboard"
        >
          {open ? 'ScreenLog' : 'SL'}
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
