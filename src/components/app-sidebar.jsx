import {
  CircleX,
  Home,
  Settings,
  ThumbsUp,
  History,
  Video,
  FolderClosed,
  UserRoundCheck,
  X
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
import { NavLink } from "react-router-dom";
import { Button } from "./index.js"

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

      <SidebarGroupAction title="Close" className="[&>svg]:size-6 sm:[&>svg]:size-5 z-30" onClick={toggleSidebar} type="button">
        <X /> <span className="sr-only">Close</span>
      </SidebarGroupAction>


      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        {user ? <NavUser /> :
          <>
            <Button><NavLink className="sm:hidden" to="/login">Login</NavLink></Button>
            <Button><NavLink className="sm:hidden" to="/signup">Signup</NavLink></Button>
          </>
        }
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
