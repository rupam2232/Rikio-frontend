import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";

import { NavLink } from "react-router-dom";

export function NavMain({ items }) {
  const { toggleSidebar } = useSidebar()
  return (

    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild className={`text-lg sm:text-base [&>svg]:size-5 sm:[&>svg]:size-4`} onClick={toggleSidebar} tooltip={item.title}>
              <NavLink to={item.url} >
                <item.icon />
                <span>{item.title}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
