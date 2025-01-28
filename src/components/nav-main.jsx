import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";

import { NavLink } from "react-router-dom";
import { useIsMobile } from "../hooks/use-mobile.jsx"

export function NavMain({ items }) {
  const { toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild className={`text-lg sm:text-base [&>svg]:size-5 sm:[&>svg]:size-4`} onClick={isMobile ? toggleSidebar : ""} tooltip={item.title}>
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
