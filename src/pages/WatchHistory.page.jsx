import { useEffect, useState, useRef } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { timeAgo } from '../utils/timeAgo'
import { Like, Button, AccountHover, Comments, ParseContents, Video as VideoPlayer } from "../components/index.js"
import { useNavigate } from 'react-router-dom'
import formatNumbers from '../utils/formatNumber.js'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'
import setAvatar from '../utils/setAvatar.js'
import { videoDuration } from '../utils/videoDuration.js'
import toast from "react-hot-toast"
import { BadgeCheck, UserRoundCheck, UserRoundPlus, LoaderCircle, FolderClosed, Plus, X, Earth, LockKeyholeIcon, Check, Play } from 'lucide-react'
import { AvatarImage, Avatar } from '@/components/ui/avatar.jsx'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice.js'
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

const WatchHistory = () => {
    const [historyData, setHistoryData] = useState([])
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        axios.get('/users/history')
            .then((res) => {
                console.log(res.data)
                setHistoryData(res.data.data)
            })
            .catch((error) => {
                console.error(errorMessage(error))
            })
            .finally(() => {
                setLoader(false)
            })
    }, [])
    const toggleSubscribe = () => {
    }
    console.log(historyData)

    if (loader) {
        return (<div className='w-full h-full flex justify-center items-center'>
            <LoaderCircle className="w-16 h-16 animate-spin" />
        </div>)
    }

    return (
        <section className='w-full p-4 pt-0 mb-10'>
            {/* Page Title */}
            {/* <div className="w-full mt-4 px-4 flex items-center justify-between"> */}
            {/* <h1 className="font-medium text-2xl">Playlists</h1></div>
            <hr className="my-4 border-primary" /> */}

            <div className="flex flex-wrap gap-x-4 gap-y-10 p-4 lg:flex-nowrap">
                <div className="w-full shrink-0 sm:max-w-md lg:max-w-sm">
                    <div className="relative mb-2 w-full pt-[56%] group">
                        <div className="absolute inset-0">
                            {historyData.history.length > 0 ? <img src={historyData.history[0].videos[0].thumbnail} alt={`Watch history`} className="h-full w-full rounded-md object-cover" />
                                :
                                <div className='bg-gray-400 h-full w-full rounded-md flex items-center justify-center'> <Play className='group-hover:text-background' /> </div>}

                            <div className="absolute inset-x-0 bottom-0">
                                <div className="relative bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                                    <div className="relative z-[1]">
                                        <p className="flex justify-between">
                                            <span className="inline-block">{`${formatNumbers(historyData.totalVideos)} videos`}</span>
                                        </p>
                                        {/* <p className="text-sm text-gray-200">{`${formatNumbers(playlistData.totalViews)} Views • ${timeAgo(playlistData.createdAt)}`}</p> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='flex justify-between items-start gap-x-2'>
                            <h6 className="mb-1 font-semibold">Watch History</h6>
                            <span className='flex gap-x-2 items-center'>
                                <button className="relative group cursor-pointer h-min  sm:mr-2" title={"Private"}>{<LockKeyholeIcon className='size-4' />}
                                    <span className='top-1/2 right-6 -translate-y-1/2 sm:right-auto sm:-translate-y-0 sm:-translate-x-1/2 sm:left-1/2 sm:top-6 z-[5] text-sm bg-primary text-background absolute text-nowrap hidden group-hover:block group-focus:block px-3 py-1 border border-zinc-600 rounded-md backdrop-blur-md'>{`Only you can see your watch history`}</span>
                                    <span className='w-3 h-3 sm:translate-y-1 sm:translate-x-1/2  z-[1] absolute -left-3 top-1/2 -translate-x-1/2 -translate-y-1/2 right-1/2 sm:left-auto  sm:top-auto sm:right-1/2 hidden group-hover:block group-focus:block rotate-45 bg-primary border border-zinc-600'></span>
                                </button>
                            </span>
                        </div>
                    </div>
                </div>

                {historyData?.history?.length === 0 ? (
                    <p className="text-center text-gray-500">No watch history available.</p>
                ) : (
                    <div className="flex w-full flex-col gap-y-4">
                        {historyData.history.map((day, index) => (
                            <div key={index}>
                                <h3 className="text-xl font-medium text-gray-700 mb-3">
                                    {`${new Date(day.createdAt).getDate()}th ${new Date(day.createdAt).toLocaleString('default', { month: 'long' })} ${new Date(day.createdAt).getFullYear()}`}
                                </h3>
                                <hr className="my-4 border-primary" />

                                <div className="flex w-full flex-col gap-y-4">
                                    {day.videos.map((video, index) => (
                                        <>
                                            <div key={index + Math.random() * 10} className="sm:border border-zinc-500 rounded-md shadow-md">
                                                {console.log(index + Math.random())}
                                                <div className="w-full  gap-x-4 sm:flex">
                                                    <div className="relative mb-2 w-full sm:mb-0 sm:w-5/12">
                                                        <div className="w-full pt-[56%]" aria-label='Thubmnail'>
                                                            <NavLink to={`/video/${video._id}`} title={video.title} className="absolute inset-0">
                                                                <img src={video.thumbnail} alt={`${video.title} | uploaded by @${video.owner.username}`} className="h-full w-full object-cover rounded-md" />
                                                            </NavLink>
                                                            <span className="absolute bottom-1 right-1 inline-block rounded bg-black/100 text-white px-1.5 text-sm">{videoDuration(video.duration)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-x-2 px-2 sm:w-7/12 sm:px-0">
                                                        <AccountHover user={{ ...video.owner, subscribers: video.owner.subscribers, isSubscribed: video.owner.isSubscribed }} toggleSubscribe={toggleSubscribe}>
                                                            <div onClick={() => navigate(`/@${video.owner.username}`)} className="h-10 w-10 shrink-0 sm:hidden cursor-pointer">
                                                                <img src={video.owner.avatar} alt={`@${video.owner.username}`} className="h-full w-full rounded-full object-cover" />
                                                            </div>
                                                        </AccountHover>
                                                        <div className="w-full">
                                                            <div className='flex justify-between gap-x-2 items-start'>
                                                                <NavLink to={`/video/${video._id}`} className="flex-1">
                                                                    <h6 className="mb-1 sm:mt-1 font-semibold sm:max-w-[75%] max-h-16 line-clamp-2 whitespace-normal" title={video.title}>{video.title}</h6>
                                                                </NavLink>


                                                            </div>
                                                            <NavLink to={`/video/${video._id}`}>
                                                                <p className="flex text-sm text-primary/90 sm:pt-3" title={`${formatNumbers(video.views)} Views | uploaded ${timeAgo(video.createdAt)}`}>{`${formatNumbers(video.views)} Views • ${timeAgo(video.createdAt)}`}</p>
                                                            </NavLink>
                                                            <div className="flex items-center sm:gap-x-4">
                                                                <AccountHover user={{ ...video.owner, subscribers: video.owner.subscribers, isSubscribed: video.owner.isSubscribed }} toggleSubscribe={toggleSubscribe}>
                                                                    <div className="mt-2 hidden h-10 w-10 shrink-0 sm:block cursor-pointer" onClick={() => navigate(`/@${video.owner.username}`)}>
                                                                        <img src={setAvatar(video.owner.avatar)} alt={`@${video.owner.username}`} className="h-full w-full rounded-full object-cover" />
                                                                    </div>
                                                                </AccountHover>

                                                                <AccountHover user={{ ...video.owner, subscribers: video.owner.subscribers, isSubscribed: video.owner.isSubscribed }} toggleSubscribe={toggleSubscribe}>
                                                                    <p className="text-sm mt-1 mb-3 sm:mb-0 sm:mt-0 text-primary/80 sm:text-primary/90 sm:font-medium cursor-pointer" onClick={() => navigate(`/@${video.owner.username}`)}>{`@${video.owner.username}`}</p>
                                                                </AccountHover>
                                                                <NavLink to={`/video/${video._id}`} className="block w-full h-max">
                                                                    <p className='invisible h-max'>a</p></NavLink>
                                                            </div>
                                                            <NavLink to={`/video/${video._id}`} className="hidden sm:block w-full h-1/3"></NavLink>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {historyData?.totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <button
                            className="px-4 py-2 mx-1 text-sm bg-gray-200 rounded-md"
                            disabled={historyData.currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-sm">
                            Page {historyData.currentPage} of {historyData.totalPages}
                        </span>
                        <button
                            className="px-4 py-2 mx-1 text-sm bg-gray-200 rounded-md"
                            disabled={historyData.currentPage === historyData.totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}

            </div>
        </section>
    )
}

export default WatchHistory
