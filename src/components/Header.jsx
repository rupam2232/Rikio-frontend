import React, { useRef, useState, useEffect } from 'react';
import { Like, Logo, SettingBtn, SupportBtn, VideoBtn, Search, Close, Input } from './index.js'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate();
    const sidebarRef = useRef();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const signUpPage = () => navigate("/signup");
    const loginPage = () => navigate("/login");

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close the sidebar if the click is outside of it
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };

        // Add event listener for clicks outside
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky inset-x-0 top-0 z-50 w-full border-b border-white bg-[#121212] px-4">
            <nav className="mx-auto flex max-w-7xl items-center py-2">
                <div className="mr-4 w-12 shrink-0 sm:w-16 cursor-pointer" title='Logo' aria-label='Logo' onClick={() => navigate("/")}>
                    <Logo />
                </div>
                <div className="relative mx-auto hidden w-full max-w-md overflow-hidden sm:block">

                    <Input type="search" className="w-full border bg-transparent py-1 pl-8 pr-3 placeholder-white outline-none sm:py-2 border-white" placeholder="Search" />

                    <span className="absolute left-2.5 top-1/2 inline-block -translate-y-1/2 h-4 w-4">
                        <Search />
                    </span>
                </div>
                <button className="ml-auto sm:hidden h-6 w-6">
                    <Search />
                </button>
                <button className="group peer ml-4 flex w-6 shrink-0 flex-wrap gap-y-1.5 sm:hidden" onClick={() => setIsSidebarOpen((prev) => !prev)}>
                    <span className="block h-[2px] w-full bg-white group-hover:bg-[#ae7aff]">
                    </span>
                    <span className="block h-[2px] w-2/3 bg-white group-hover:bg-[#ae7aff]">
                    </span>
                    <span className="block h-[2px] w-full bg-white group-hover:bg-[#ae7aff]">
                    </span>
                </button>
                <div ref={sidebarRef}
                    className={`fixed inset-y-0 flex flex-col shrink-0 right-0 transform bg-[#121212] border-l border-white sm:static sm:ml-4 sm:border-none sm:translate-x-0 duration-200 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                        } w-full xs:max-w-xs sm:max-w-sm sm:w-auto`}>
                    <div className="relative flex w-full items-center justify-between bg-[#292929] border-b border-white px-4 py-2 sm:hidden">
                        <span className="inline-block visible xs:invisible w-12 cursor-pointer" title='Logo'>
                            <Logo />
                        </span>
                        <button className="inline-block w-8" title='Close' onClick={() => setIsSidebarOpen(false)}>
                            <Close />
                        </button>
                    </div>
                    <ul className="my-4 flex w-full flex-wrap gap-2 px-4 sm:hidden">
                        <li className="w-full">
                            <button title='Liked Videos' className="flex w-full items-center justify-start gap-x-4 border border-white px-4 py-1.5 text-left hover:bg-[#ae7aff] hover:text-black focus:border-[#ae7aff] focus:bg-[#ae7aff] focus:text-black">
                                <span className="inline-block w-full max-w-[20px] group-hover:mr-4 lg:mr-4">
                                    <Like />
                                </span>
                                <span>Liked Videos</span>
                            </button>
                        </li>
                        <li className="w-full">
                            <button title='My Content' className="flex w-full items-center justify-start gap-x-4 border border-white px-4 py-1.5 text-left hover:bg-[#ae7aff] hover:text-black focus:border-[#ae7aff] focus:bg-[#ae7aff] focus:text-black">
                                <span className="inline-block w-full max-w-[20px] group-hover:mr-4 lg:mr-4">
                                    <VideoBtn />
                                </span>
                                <span>My Content</span>
                            </button></li>
                        <li className="w-full">
                            <button title='Support' className="flex w-full items-center justify-start gap-x-4 border border-white px-4 py-1.5 text-left hover:bg-[#ae7aff] hover:text-black focus:border-[#ae7aff] focus:bg-[#ae7aff] focus:text-black">
                                <span className="inline-block w-full max-w-[20px] group-hover:mr-4 lg:mr-4">
                                    <SupportBtn />
                                </span>
                                <span>Support</span>
                            </button></li>
                        <li className="w-full">
                            <button title='Settings' className="flex w-full items-center justify-start gap-x-4 border border-white px-4 py-1.5 text-left hover:bg-[#ae7aff] hover:text-black focus:border-[#ae7aff] focus:bg-[#ae7aff] focus:text-black">
                                <span className="inline-block w-full max-w-[20px] group-hover:mr-4 lg:mr-4">
                                    <SettingBtn />
                                </span>

                                <span>Settings</span>
                            </button></li>
                    </ul>

                    <div className="mb-8 mt-auto flex w-full flex-wrap gap-4 px-4 sm:mb-0 sm:mt-0 sm:items-center sm:px-0">
                        <button title='Login' className="w-full bg-[#5a5a5a] px-3 py-2 hover:bg-[#616060] sm:w-auto " onClick={loginPage}>Log in</button>

                        <button title='Signup' className="mr-1 w-full bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto" onClick={signUpPage}>Sign up</button>

                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header


