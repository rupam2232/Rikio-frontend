import {
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
import { Button, Logo, ModeToggle } from "./index.js"
import { useNavigate } from "react-router-dom";

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
    title: "Collections",
    url: "/collections",
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
  const navigate = useNavigate()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="">
        <NavLink to={"/"} className="!bg-transparent hover:!bg-transparent cursor-pointer flex items-center gap-0" title='Limo' aria-label='Limo'>
          <Logo className="w-12"/>
          <p className="group-data-[collapsible=icon]:hidden logo-font !font-bold text-2xl  from-[#c7b1ea] to-[#844cdd] bg-gradient-to-r bg-clip-text text-transparent">  
          Limo
          </p>
        </NavLink>
        {/* Limo */}
      </SidebarHeader>

      <SidebarGroupAction title="Close" className="[&>svg]:size-6 sm:[&>svg]:size-5 z-30" onClick={toggleSidebar} type="button">
        <X /> <span className="sr-only">Close</span>
      </SidebarGroupAction>


      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle className="border-zinc-500 md:hidden" title="toggle theme" />
        {user ? <NavUser /> :
          <>
            <Button onClick={toggleSidebar} className="md:hidden"><NavLink className="text-primary-foreground w-full" to="/login">Login</NavLink></Button>
            <Button onClick={toggleSidebar} className="md:hidden"><NavLink className="text-primary-foreground w-full" to="/signup">Signup</NavLink></Button>
          </>
        }
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
