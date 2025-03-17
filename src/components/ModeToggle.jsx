import { Moon, Sun } from "lucide-react"
import {
  // DropdownMenu,
  // DropdownMenuContent,
  // DropdownMenuItem,
  // DropdownMenuTrigger,
  // Button,
  useTheme
} from "./index.js"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

export function ModeToggle({ className, ...props }) {
  const { setTheme } = useTheme()

  const handleToggle = () => {
    const root = window.document.documentElement;
    if (root.classList.contains("dark")) {
      setTheme("light")
    } else if (root.classList.contains("light")) {
      setTheme("dark")
    } else {
      setTheme("system")
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border border-zinc-500">
          <div role="button" onClick={() => handleToggle()}>
            <div variant="outline" size="icon" className={`w-max bg-transparent flex items-center gap-4 border-none shadow-none ${className}`} {...props}>
              <div className="inline-flex bg-transparent items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary shadow h-8 w-8 border border-zinc-500">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </div>
              <span className="sr-only">Toggle theme</span>
              <p className="group-data-[collapsible=icon]:hidden truncate">Toggle Theme</p>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )

  // return (
  //   <SidebarMenu>
  //     <SidebarMenuItem>
  //       <SidebarMenuButton className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border border-zinc-500">
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <div variant="outline" size="icon" className={`w-max bg-transparent flex items-center gap-4 border-none shadow-none ${className}`} {...props}>
  //               <div className="inline-flex bg-transparent items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary shadow h-8 w-8 border border-zinc-500">
  //                 <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
  //                 <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
  //               </div>
  //               <span className="sr-only">Toggle theme</span>
  //               <p className="group-data-[collapsible=icon]:hidden truncate">Toggle Theme</p>
  //             </div>
  //           </DropdownMenuTrigger>
  //           {/* <DropdownMenuContent align="end">
  //             <DropdownMenuItem onClick={() => setTheme("light")}>
  //               Light
  //             </DropdownMenuItem>
  //             <DropdownMenuItem onClick={() => setTheme("dark")}>
  //               Dark
  //             </DropdownMenuItem>
  //             <DropdownMenuItem onClick={() => setTheme("system")}>
  //               System
  //             </DropdownMenuItem>
  //           </DropdownMenuContent> */}
  //         </DropdownMenu>
  //       </SidebarMenuButton>
  //     </SidebarMenuItem>
  //   </SidebarMenu>
  // )
}
