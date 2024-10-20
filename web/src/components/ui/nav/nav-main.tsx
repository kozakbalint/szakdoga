import { type LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { useNavigate } from 'react-router-dom';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const navigate = useNavigate();

  return (
    <SidebarMenu>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        {items.map((item) => (
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate(item.url)}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarGroup>
    </SidebarMenu>
  );
}
