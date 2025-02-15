import { useEffect, useState } from 'react'
import axios from '../utils/axiosInstance.js';
import errorMessage from '../utils/errorMessage.js';
import formatNumbers from '../utils/formatNumber.js'
import { timeAgo } from '../utils/timeAgo.js'
import { NavLink } from 'react-router-dom'
import { FolderClosed, Play } from 'lucide-react';

const ChannelPlaylist = ({ userId, username, isChannelOwner }) => {
    const [playlist, setPlaylist] = useState(null);
    const [error, setError] = useState(false);
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        setLoader(true);
        setError(false)
        axios.get(`/playlist/channel/${userId}`)
            .then((res) => {
                setPlaylist(res.data.data)
            })
            .catch((error) => {
                console.error(errorMessage(error))
                setError(true)
            })
            .finally(() => setLoader(true))
    }, [userId])
    console.log(playlist)

    if (error) {
        return (
            <div className='h-[80vh] flex items-center justify-center flex-col'>
                <p>Something went wrong. Please refresh the page and try again.</p>
            </div>
        )
    }
    if (playlist?.length === 0) {
        return (
            <div className='h-[80vh] flex items-center justify-center flex-col'>
                <FolderClosed className='mb-2 px-2 py-2 w-auto size-10 text-[#AE7AFF] bg-[#E4D3FF] rounded-full' />
                <h3 className='font-bold mb-2'>No playlist created</h3>
                <p>There are no playlist created on this channel.</p>
            </div>
        )
    }
    return (
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-x-4 gap-y-8 p-2 relative mt-2 mb-5">
            {playlist && playlist.map((elem) => {
                return (
                    <NavLink to={`/playlist/${elem._id}`} className="w-full group" key={elem._id}>
                        <div className="relative mb-2 w-full pt-[56%]">
                            <div className="absolute inset-0">
                                {
                                elem.thumbnail ? 
                                <img src={elem.thumbnail} alt={`${elem.playlistName} by @${username}`} className="h-full w-full rounded-md" /> : 
                                <div className='bg-gray-400 h-full w-full rounded-md flex items-center justify-center'> <Play className='group-hover:text-background'/> </div>
                                }
                                <div className="absolute inset-x-0 bottom-0">
                                    <div className="relative bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                                        <div className="relative z-[1]">
                                            <p className="flex justify-between items-center">
                                                <span className="max-h-6 text-lg font-bold truncate whitespace-normal line-clamp-1">{elem.playlistName}</span>
                                                <span className="inline-block">{formatNumbers(elem.totalVideos)}&nbsp;videos</span>
                                            </p>
                                            <p className="text-sm text-gray-200">{formatNumbers(elem.totalViews)} Views&nbsp;·&nbsp;{timeAgo(elem.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </NavLink>
                )
            })}

        </div>
    )
}

export default ChannelPlaylist
