import { useState, useRef } from 'react';
import { Logo, Input, Button, SidebarTrigger } from './index'
import { MoveLeft, Search, X } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom'
import { useSelector } from "react-redux";
import { useIsMobile } from "../hooks/use-mobile.jsx"
import { NavUser } from "./nav-user";
import conf from '../conf/conf.js'

const Header = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchInput, setSearchInput] = useState(false)
    const user = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();
    const signUpPage = () => navigate("/signup");
    const loginPage = () => navigate("/login");
    const isMobile = useIsMobile()
    const mobileInput = useRef(null)

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            if(!searchQuery) return;
            navigate(`/search?query=${searchQuery}`)
            e.target.blur()
            setSearchInput(false)
        }
    }

    const goback = () => {
        setSearchInput(false)
    }

    const handleSearchButton = () => {
        if (isMobile) {
            setSearchInput(true)
            setTimeout(() => {
                mobileInput.current.focus()
            }, 200);
        } else {
            if(!searchQuery) return;
            navigate(`/search?query=${searchQuery}`)
        }
    }

    return (
        <header className="sticky inset-x-0 top-0 z-50 w-full border-b px-4 bg-background/85 border-grid backdrop-blur-[12px] supports-[backdrop-filter]:bg-background/60">
            <nav className="mx-auto flex  justify-between  max-w-7xl  items-center py-2">
                {(isMobile && searchInput) ?
                    <div className="gap-1 relative flex items-center w-full py-1.5">

                        <button onClick={goback} type="button"><MoveLeft /></button>

                        <Input type="search" ref={mobileInput} onKeyDown={handleEnter} onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} placeholder="Search" className="border-zinc-500 pl-8" />

                        <span className="inline-block transition-opacity absolute left-9  top-1/2 -translate-y-1/2 h-4 w-4">
                            <Search className='w-full h-full' />
                        </span>
                        {searchQuery && <span className='cursor-pointer absolute right-2' onClick={() => setSearchQuery("")}>
                            <X />
                        </span>}
                    </div>
                    :
                    <>
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            {isMobile && <NavLink to={"/"} className="mr-4 w-12 !bg-transparent hover:!bg-transparent shrink-0 sm:w-16 cursor-pointer" title={conf.appName} aria-label='Logo'>
                                <Logo />
                            </NavLink>}

                        </div>
                        <div className="md:absolute left-1/2 md:-translate-x-1/2 gap-1 flex items-center w-full md:w-1/3">

                            <Input type="search" onKeyDown={handleEnter} onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} placeholder="Search" className="border-zinc-500 pl-8 hidden md:block " />

                            <span className="hidden md:inline-block absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4">
                                <Search className='w-full h-full' />
                            </span>
                            {searchQuery && <span className='cursor-pointer hidden md:inline-block absolute right-16' onClick={() => setSearchQuery("")}>
                                <X className='h-5 w-5' />
                            </span>}
                            <Button title='search' className="ml-auto mr-2 md:mr-0 w-max block" type='button' onClick={() => handleSearchButton()}>
                                <Search className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className=" flex w-max md:gap-3 gap-1 sm:items-center sm:px-0 justify-center">
                            {!user && <Button title='Login' className="md:block px-2 py-1 md:px-4 md:py-2" onClick={loginPage}>Log in</Button>}
                            {!user && <Button title='Signup' className="md:block px-2 py-1 md:px-4 md:py-2" onClick={signUpPage}>Sign up</Button>}
                            {isMobile && user && <NavUser />}
                        </div>
                    </>}
            </nav>
        </header>
    )
}

export default Header