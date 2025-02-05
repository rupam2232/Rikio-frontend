import { useState } from "react";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  Sparkles,
  Upload,
  LoaderCircle,
  LayoutDashboard
} from "lucide-react";

import {
  Avatar,
  AvatarImage,
} from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useSelector, useDispatch } from "react-redux";
import setAvatar from '../utils/setAvatar.js'
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice.js";
import axios from "../utils/axiosInstance.js";
import toast from "react-hot-toast"
import errorMessage from "../utils/errorMessage.js";

export function NavUser() {
  const { isMobile } = useSidebar();
  const user = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const logoutUser = () => {
    setLoader(true);

    if (!user) {
      toast.error("You are not logged in", {
        style: { color: "#ffffff", backgroundColor: "#333333" },
        position: "top-center"
      });
      return;
    }

    axios.post(`/users/logout`)
      .then((res) => {
        if (res.status === 200) {
          dispatch(logout());
          toast.success("Log out successfully", {
            style: { color: "#ffffff", backgroundColor: "#333333" },
            position: "top-center"
          });
        } else {
          toast.error("Something went wrong please try again", {
            style: { color: "#ffffff", backgroundColor: "#333333" },
            position: "top-center"
          });
        }
      })
      .catch((error) => {
        console.error(error)
        toast.error(errorMessage(error), {
          style: { color: "#ffffff", backgroundColor: "#333333" },
          position: "top-center"
        });
      })
      .finally(() => {
        setLoader(false);
      });
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-transparent"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={setAvatar(user.avatar)} alt={`@${user.username}`} className="object-cover" />
              </Avatar>
              {!isMobile && (
                <>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.fullName}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <NavLink to={`/@${user.username}`}>
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src={setAvatar(user.avatar)} alt={user.fullName} className="object-cover" />
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.fullName}{user.verified && <span title="verified" className=" ml-1 cursor-pointer"><BadgeCheck className="inline-block size-4 fill-blue-600 text-background" /></span>}
                    </span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </NavLink>
            </DropdownMenuLabel>
            {/* <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
            <DropdownMenuGroup>
              <DropdownMenuItem className="px-0 py-0">
                <button onClick={() => navigate(`/dashboard`)} className={`w-full px-2 py-1.5 relative flex select-none items-center gap-2 rounded-sm text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled] group-focus:bg-accent :pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 deactive`}><LayoutDashboard />Dashboard</button>
              </DropdownMenuItem>

              <DropdownMenuItem className="px-0 py-0">
                <button onClick={() => navigate("/upload")} className={`w-full px-2 py-1.5 relative flex select-none items-center gap-2 rounded-sm text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled] group-focus:bg-accent :pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 deactive`}><Upload /> Upload</button>
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger className="w-full px-2 py-1.5 relative flex select-none items-center gap-2 rounded-sm text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled] group-focus:bg-accent :pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 deactive ">
                <LogOut />
                Log out
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Log out from current logged in account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will log out your current device from your current logged in account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="text-red-600 bg-transparent shadow-none hover:bg-accent border border-input" disabled={loader} onClick={logoutUser}>{loader ? <LoaderCircle className="w-16 h-16 animate-spin" /> : "Log Out"}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
