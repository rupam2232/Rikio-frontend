import { useState } from 'react';
import { Logo, Input, Button, SidebarTrigger } from './index'
import { Search } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom'
import { useSelector } from "react-redux";
import { useIsMobile } from "../hooks/use-mobile.jsx"
import { NavUser } from "./nav-user";
import conf from '../conf/conf.js'

const Header = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const user = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();
    const signUpPage = () => navigate("/signup");
    const loginPage = () => navigate("/login");
    const isMobile = useIsMobile()

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            navigate(`/search?query=${searchQuery}`)
            e.target.blur()
        }
    }

    return (
        <header className="sticky inset-x-0 top-0 z-50 w-full border-b px-4 bg-background/85 border-grid backdrop-blur-[12px] supports-[backdrop-filter]:bg-background/60">
            <nav className="mx-auto flex  justify-between  max-w-7xl  items-center py-2">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    {isMobile && <NavLink to={"/"} className="mr-4 w-12 !bg-transparent hover:!bg-transparent shrink-0 sm:w-16 cursor-pointer" title={conf.appName} aria-label='Logo'>
                        <Logo />
                    </NavLink>}

                </div>
                <div className="md:absolute left-1/2 md:-translate-x-1/2 gap-1 flex items-center w-full md:w-1/3">

                    <Input type="search" onKeyDown={handleEnter} onChange={(e)=> setSearchQuery(e.target.value)} value={searchQuery} placeholder="Search" className="border-zinc-500 pl-8 hidden md:block " />

                    <span className="hidden md:inline-block peer-focus:opacity-0 transition-opacity absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4">
                        <Search className='w-full h-full' />
                    </span>
                    <Button title='search' className="ml-auto mr-2 md:mr-0 w-max block" type='button' onClick={() => navigate(`/search?query=${searchQuery}`)}>
                        <Search className="w-6 h-6" />
                    </Button>
                </div>

                <div className=" flex w-max md:gap-3 gap-1 sm:items-center sm:px-0 justify-center">
                    {!user && <Button title='Login' className="md:block px-2 py-1 md:px-4 md:py-2" onClick={loginPage}>Log in</Button>}
                    {!user && <Button title='Signup' className="md:block px-2 py-1 md:px-4 md:py-2" onClick={signUpPage}>Sign up</Button>}
                    {isMobile && user && <NavUser />}
                </div>
            </nav>
        </header>
    )
}

export default Header