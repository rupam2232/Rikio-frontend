import { useEffect, useState } from 'react'
import axios from '../utils/axiosInstance.js';
import errorMessage from '../utils/errorMessage.js';
import formatNumbers from '../utils/formatNumber.js'
import { timeAgo } from '../utils/timeAgo.js'
import { useLocation, NavLink } from 'react-router-dom'
import { FolderClosed, Play, LoaderCircle, Earth, LockKeyholeIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Button, UploadPlaylist } from '../components/index.js';

const Playlist = () => {
    const [playlist, setPlaylist] = useState(null);
    const [error, setError] = useState(false);
    const [loader, setLoader] = useState(true);
    const [fetch, setFetch] = useState(true)
    const [openEditPopup, setOpenEditPopup] = useState(false)
    const user = useSelector((state) => state.auth.userData);
    const location = useLocation();
    const pathname = location.pathname.substring(1);
    const isCreate = pathname.includes("/") ? pathname.split("/")[1] : pathname;

    useEffect(() => {
        setLoader(true);
        setError(false)
        axios.get(`/playlist/user`)
            .then((res) => {
                setPlaylist(res.data.data)
            })
            .catch((error) => {
                console.error(errorMessage(error))
                setError(true)
            })
            .finally(() => setLoader(false))
    }, [location, fetch])

    if (loader) return (
        <section className='w-full h-[80vh] flex justify-center items-center'>
            <LoaderCircle className="w-16 h-16 animate-spin" />
        </section>
    )

    if (error) {
        return (
            <section className='h-[80vh] flex items-center justify-center flex-col p-2 sm:p-0'>
                <p className='text-center'>Something went wrong. Please refresh the page and try again.</p>
            </section>
        )
    }

    if (playlist?.length === 0) {
        return (
            <section className='h-[80vh] flex items-center justify-center flex-col'>
                <div className='mb-2 px-2 py-2 w-auto  text-[#AE7AFF] bg-[#E4D3FF] rounded-full'>
                    <FolderClosed className='size-7' />
                </div>
                <h3 className='font-bold mb-2'>No playlist created</h3>
                <p>You haven't created any playlist</p>
                <Button onClick={() => setOpenEditPopup(true)} className="flex justify-center items-center gap-2 mt-4 bg-[#ae7aff] hover:bg-[#ae7aff] text-primary hover:text-primary px-4 py-2 rounded-md font-medium text-sm [&>svg]:size-4 [&>svg]:shrink-0">Create new Playlist</Button>
                {(isCreate === "create" || openEditPopup) && <UploadPlaylist setOpenEditPopup={setOpenEditPopup} setFetch={setFetch} />}
            </section>
        )
    }
    return (
        <section className="w-full p-4 pt-0 mb-10">
            <div className="w-full mt-4 px-4 flex items-center justify-between">
                <div>
                <h1 className="font-medium text-2xl flex items-center gap-2"><span><FolderClosed className='size-4'/></span>Playlists</h1>
                <p className='text-sm text-primary/80'>Manage all your created playlists.</p>
                </div>
                <Button onClick={() => setOpenEditPopup(true)} className="flex justify-center items-center gap-2 bg-[#ae7aff] hover:bg-[#ae7aff] text-primary hover:text-primary px-4 py-2 rounded-md font-medium text-sm [&>svg]:size-4 [&>svg]:shrink-0">Create new Playlist</Button>
            </div>
            <hr className="my-4 border-primary" />
            {(isCreate === "create" || openEditPopup) && <UploadPlaylist setOpenEditPopup={setOpenEditPopup} setFetch={setFetch} />}
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-x-4 gap-y-8 relative mt-2 mb-5">
                {playlist && playlist.map((elem) => {
                    return (
                        <NavLink to={`/playlist/${elem._id}`} className="w-full group" key={elem._id}>
                            <div className="relative mb-2 w-full pt-[56%]">
                                <div className="absolute inset-0">
                                    {
                                        elem.thumbnail ?
                                            <img src={elem.thumbnail} alt={`${elem.playlistName} by @${user.username}`} className="h-full w-full rounded-md object-cover" /> :
                                            <div className='bg-gray-400 h-full w-full rounded-md flex items-center justify-center'> <Play className='group-hover:text-background' /> </div>
                                    }
                                    <div className="absolute inset-x-0 bottom-0">
                                        <div className="relative bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                                            <div className="relative z-[1]">
                                                <div className="flex justify-between items-center">
                                                    <span className="max-h-6 text-lg font-bold truncate whitespace-normal line-clamp-1">{elem.playlistName}</span>
                                                    <div className='flex gap-x-2 items-center'>
                                                        <button className="relative z-[15] group/icon cursor-pointer h-min  sm:mr-2" title={elem.isPublic ? "Public" : "Private"}>{elem.isPublic ? <Earth className='size-4' /> : <LockKeyholeIcon className='size-4' />}
                                                            <span className='top-1/2 right-6 -translate-y-1/2 sm:right-auto sm:-translate-y-0 sm:-translate-x-1/2 sm:left-1/2 sm:top-6 z-[5] text-sm bg-primary text-background absolute text-nowrap hidden group-hover/icon:block group-focus/icon:block px-3 py-1 border border-zinc-600 rounded-md backdrop-blur-md'>{elem.isPublic ? "This playlist is public" : `This playlist is private`}</span>
                                                            <span className='w-3 h-3 sm:translate-y-1 sm:translate-x-1/2  z-[1] absolute -left-3 top-1/2 -translate-x-1/2 -translate-y-1/2 right-1/2 sm:left-auto  sm:top-auto sm:right-1/2 hidden group-hover/icon:block group-focus/icon:block rotate-45 bg-primary border border-zinc-600'></span>
                                                        </button>

                                                        <span className="inline-block">{formatNumbers(elem.totalVideos)}&nbsp;videos</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-200">{formatNumbers(elem.totalViews)} Views&nbsp;•&nbsp;{timeAgo(elem.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </NavLink>
                    )
                })}
            </div>

        </section>
    )
}

export default Playlist
