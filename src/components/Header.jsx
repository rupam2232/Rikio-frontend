import { Logo, Input, Button, ModeToggle, SidebarTrigger } from './index'
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux";
import { useIsMobile } from "../hooks/use-mobile.jsx"

const Header = () => {
    const user = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();
    const signUpPage = () => navigate("/signup");
    const loginPage = () => navigate("/login");
    const isMobile = useIsMobile()

    return (
        <header className="sticky inset-x-0 top-0 z-50 w-full border-b px-4 bg-background/85 border-grid backdrop-blur-[12px] supports-[backdrop-filter]:bg-background/60">
            <nav className="mx-auto flex  justify-between  max-w-7xl  items-center py-2">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    {isMobile && <div className="mr-4 w-12 shrink-0 sm:w-16 cursor-pointer" title='Logo' aria-label='Logo' onClick={() => navigate("/")}>
                        <Logo />
                    </div>}
                    
                </div>
                <div className="md:absolute left-1/2 md:-translate-x-1/2 gap-1 flex items-center md:w-1/3">

                    <Input type="search" placeholder="Search" className="border-zinc-500 pl-8 hidden md:block " />

                    <span className="hidden md:inline-block peer-focus:opacity-0 transition-opacity absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4">
                        <Search className='w-full h-full' />
                    </span>
                    <Button title='search' className="ml-auto w-max block" type='button'>
                        <Search className="w-6 h-6" />
                    </Button>
                </div>

                <div className=" flex w-max md:gap-3 gap-1 sm:items-center sm:px-0 justify-center">
                    <ModeToggle className="border-zinc-500 hidden md:inline-flex" title="toggle theme" />
                    {!user && <Button title='Login' className="md:block " onClick={loginPage}>Log in</Button>}
                    {!user && <Button title='Signup' className="md:block " onClick={signUpPage}>Sign up</Button>}
                </div>
            </nav>
        </header>
    )
}

export default Header