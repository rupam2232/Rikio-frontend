import { useState, useEffect } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import Header from "./components/Header.jsx"
import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from './store/authSlice.js'
import axios from './utils/axiosInstance'

import { ThemeProvider } from "./components/ThemeProvider"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "./components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
} from "./components/ui/sidebar"

export default function App() {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  console.log( user )
  // dispatch(login({userData:  {name: 'Rupam Mondal', avatar: 'https://example.com/avatar.jpg'} }));

  useEffect(() => {
    if (!user) { // Only fetch if the user is not already in Redux
      axios.get('/users/current-user')
        .then((res) => {
          if( res.data.data ) {
            dispatch(login({userData: res.data.data}))
          }else{
            dispatch(logout());
          }
        })
        .catch((error) => {
          dispatch(logout());
          console.log( error )
        });
    }
  }, [dispatch, user]); // Only fetch if `user` is not already set

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={false}>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <Header />
          <Separator />
          {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div> */}
          <main className='w-full h-full'>
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}








// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
//       <SidebarProvider defaultOpen={false} >
//         <AppSidebar />
//         <main className='w-full'>
//           <Header />
//           <div className='mx-auto max-w-[85rem]'>
//             <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
//               <Outlet />
//             </div>
//           </div>
//         </main>
//       </SidebarProvider>
//     </ThemeProvider>
//   )
// }

// export default App
