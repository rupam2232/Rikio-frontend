import { useEffect } from 'react'
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

export default function App({ children }) {

  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    axios.get('/users/current-user')
      .then((res) => {
        if (res.data.data) {
          dispatch(login({ userData: res.data.data }))
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        dispatch(logout());
        console.error(error)
      });

  }, [userStatus]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={false}>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <Header />
          <Separator />
          <main className='w-full h-full'>
            {children ? children : <Outlet />}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}