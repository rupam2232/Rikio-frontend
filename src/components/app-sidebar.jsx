import {
  CircleX,
  Home,
  Settings,
  ThumbsUp,
  History,
  Video,
  FolderClosed,
  UserRoundCheck
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroupAction,
  useSidebar,
} from "./ui/sidebar";
import { useSelector } from "react-redux";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Liked Videos",
    url: "/liked-videos",
    icon: ThumbsUp,
  },
  {
    title: "Watch History",
    url: "/watch-history",
    icon: History,
  },
  {
    title: "My Content",
    url: "/my-content",
    icon: Video,
  },
  {
    title: "Collection",
    url: "/collection",
    icon: FolderClosed
  }, {
    title: "Subscribed",
    url: "/subscribed",
    icon: UserRoundCheck
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar(props) {
  const user = useSelector((state) => state.auth.userData);
  const { toggleSidebar } = useSidebar()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      </SidebarHeader>

      <SidebarGroupAction title="Close" onClick={toggleSidebar} type="button" style={{ zIndex: 100, width: "2rem" }}>
        <CircleX style={{ width: "100%" }} /> <span className="sr-only">Close</span>
      </SidebarGroupAction>


      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
