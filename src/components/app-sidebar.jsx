import {
  Home,
  Settings,
  ThumbsUp,
  History,
  FolderClosed,
  UserRoundCheck,
  X,
  Heart
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
import { Button, Logo, ModeToggle, SidebarMenuButton } from "./index.js"
import { useIsMobile } from "../hooks/use-mobile.jsx"
import conf from '../conf/conf.js'

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
    title: "Playlists",
    url: "/playlists",
    icon: FolderClosed
  },
  {
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
  const isMobile = useIsMobile()
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavLink to={"/"} className="!bg-transparent hover:!bg-transparent cursor-pointer flex items-center gap-0" title={conf.appName} aria-label={conf.appName}>
          <Logo className="w-12 size-11" />
          <p className="group-data-[collapsible=icon]:hidden logo-font !font-bold text-4xl pr-1 from-[#d2b1ea] to-[#6356f4] bg-gradient-to-r bg-clip-text text-transparent relative right-1">
            {conf.appName}
          </p>
        </NavLink>
      </SidebarHeader>

      <SidebarGroupAction title="Close" className="[&>svg]:size-6 sm:[&>svg]:size-5 z-30" onClick={toggleSidebar} type="button">
        <X /> <span className="sr-only">Close</span>
      </SidebarGroupAction>


      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <div className="mb-2">
          <ModeToggle className="" title="toggle theme" />
        </div>
        {user ? !isMobile && <NavUser /> :
          <>
            <Button onClick={toggleSidebar} className="md:hidden"><NavLink className="text-primary-foreground w-full" to="/login">Login</NavLink></Button>
            <Button onClick={toggleSidebar} className="md:hidden"><NavLink className="text-primary-foreground w-full" to="/signup">Signup</NavLink></Button>
          </>
        }
        <SidebarMenuButton className={`text-xs py-0 h-auto hover:bg-transparent ${(state === "collapsed" && !isMobile) && "hidden"}`}>
            <NavLink to="/terms" className="deactive mr-2 !bg-transparent hover:underline group-data-[collapsible=icon]:hidden truncate">Terms</NavLink>
            <NavLink to="/privacy" className="deactive !bg-transparent hover:underline group-data-[collapsible=icon]:hidden truncate">Privacy</NavLink>
        </SidebarMenuButton>
        <SidebarMenuButton className={`text-sm cursor-default py-0 h-auto hover:bg-transparent ${(state === "collapsed" && !isMobile) && "hidden"}`}>
        <p className="group-data-[collapsible=icon]:hidden truncate">Made with <span><Heart className="fill-[#ae7aff] text-transparent size-5 inline-block animate-pulse" /></span> by <a className="bg-gradient-to-t font-semibold from-[#ae7aff] to-[#fcfcfc] text-transparent bg-clip-text" rel="noopener noreferrer" target="_blank" href="https://x.com/rupam2232/">Rupam</a></p>
        </SidebarMenuButton>
        <SidebarMenuButton className={`text-xs cursor-default py-0 h-auto hover:bg-transparent ${(state === "collapsed" && !isMobile) && "hidden"}`}>
        <span className="text-xs text-zinc-500 group-data-[collapsible=icon]:hidden truncate">© {new Date().getFullYear()} {conf.appName} All rights reserved</
        span>
        </SidebarMenuButton>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
