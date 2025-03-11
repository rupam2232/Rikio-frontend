import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'
import formatNumbers from '../utils/formatNumber.js'
import setAvatar from '../utils/setAvatar.js'
import { timeAgo } from '../utils/timeAgo.js'
import { videoDuration } from '../utils/videoDuration.js'
import { AccountHover, Button, ParseContents, UploadPlaylist } from '../components/index.js'
import { NavLink, useNavigate } from 'react-router-dom'
import { Play, LoaderCircle, LockKeyholeIcon, Earth, EditIcon, Trash2, BadgeCheck } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice.js'
import toast from 'react-hot-toast'
import NotFound from './NotFound.page.jsx'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

const PlaylistVideo = () => {
    const [playlistData, setPlaylistData] = useState(null)
    const [showFullDescription, setShowFullDescription] = useState(false)
    const [isDescOverflowing, setIsDescOverflowing] = useState(false);
    const [openEditPopup, setOpenEditPopup] = useState(false)
    const descriptionRef = useRef(null);
    const [loader, setLoader] = useState(true)
    const [error, setError] = useState(null)
    const [optionLoader, setOptionLoader] = useState(false)
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    useEffect(() => {
        setLoader(true)
        setError(null)
        axios.get(`/playlist/${playlistId}`)
            .then((res) => {
                setPlaylistData(res.data.data)
            })
            .catch((error) => {
                console.error(errorMessage(error))
                setError(errorMessage(error))
            })
            .finally(() => setLoader(false))
    }, [playlistId])

    useEffect(() => {
        if (descriptionRef.current) {
            const lineHeight = parseFloat(getComputedStyle(descriptionRef.current).lineHeight);
            const maxHeight = lineHeight * 3;
            setIsDescOverflowing(descriptionRef.current.scrollHeight > maxHeight);
        }
    }, [playlistData?.description, showFullDescription]);

    const toggleSubscribe = (userId) => {

        axios.post(`/subscription/c/${userId}`)
            .then((value) => {
                let updatedPlayelistOwnerData = { ...playlistData.owner }
                if (value.data.message.toLowerCase() === "subscribed") {
                    if (userId === playlistData.owner._id) {
                        updatedPlayelistOwnerData = { ...playlistData.owner, isSubscribed: true, subscribersCount: playlistData.owner.subscribersCount + 1 }
                    }

                    let videos = [...playlistData.videos]

                    let updatedVideo = videos.map((video) => {
                        if (video.owner._id === userId) {
                            video.owner.isSubscribed = true
                            video.owner.subscribersCount = video.owner.subscribersCount + 1
                        }
                        return video
                    })
                    setPlaylistData({ ...playlistData, videos: updatedVideo, owner: updatedPlayelistOwnerData })
                } else if (value.data.message.toLowerCase() === "unsubscribed") {
                    if (userId === playlistData.owner._id) {
                        updatedPlayelistOwnerData = { ...playlistData.owner, isSubscribed: false, subscribersCount: playlistData.owner.subscribersCount - 1 }
                    }

                    let videoData = [...playlistData.videos]

                    let updatedVideo = videoData.map((video) => {
                        if (video.owner._id === userId) {
                            video.owner.isSubscribed = false
                            video.owner.subscribersCount = video.owner.subscribersCount - 1
                        }
                        return video
                    })
                    setPlaylistData({ ...playlistData, videos: updatedVideo, owner: updatedPlayelistOwnerData })
                } else {
                    setPlaylistData(playlistData)
                }
            })
            .catch((error) => {
                if (error.status === 401) {
                    toast.error("You need to login first", {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                    dispatch(logout())
                    navigate("/login")
                }
                console.error(errorMessage(error));
                setPlaylistData(playlistData)
            })
    }

    const deleteVideo = (videoId) => {
        setOptionLoader(true)
        axios.patch(`/playlist/remove/${videoId}/${playlistData._id}`)
            .then((res) => {
                let updatedVideos = playlistData.videos.filter((video) => video._id !== videoId)
                setPlaylistData({ ...playlistData, videos: updatedVideos })
                toast.success(res.data.message, {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
            })
            .catch((error) => {
                if (error.status === 401) {
                    toast.error("You need to login first", {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                    dispatch(logout())
                    navigate("/login")
                } else {
                    toast.error(errorMessage(error), {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                }
                console.error(errorMessage(error));
            })
            .finally(() => {
                setOptionLoader(false)
            })
    }

    const deletePlaylist = () => {
        setLoader(true)
        setError(null)
        axios.delete(`/playlist/${playlistId}`)
            .then((res) => {
                toast.success(res.data.message, {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
                window.history.back()
                setPlaylistData(null)
            })
            .catch((error) => {
                if (error.status === 401) {
                    toast.error("You need to login first", {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                    dispatch(logout())
                    navigate("/login")
                } else {
                    toast.error(errorMessage(error), {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                }
                console.error(errorMessage(error));
            })
            .finally(() => setLoader(false))
    }


    if (loader) return (
        <div className='w-full h-[80vh] flex justify-center items-center'>
            <LoaderCircle className="w-16 h-16 animate-spin" />
        </div>
    )

    if (error) {
        return (
            <NotFound>
                <p className='px-3 text-center'>{error.replaceAll("&#39;", "'")}</p>
            </NotFound>
        )
    }

    if (playlistData) return (
        <section className="w-full">
            {openEditPopup && <UploadPlaylist setOpenEditPopup={setOpenEditPopup} playlistData={playlistData} setPlaylistData={setPlaylistData} />}
            <div className="flex flex-wrap gap-x-4 gap-y-10 p-4 lg:flex-nowrap">
                <div className="w-full shrink-0 sm:max-w-md lg:max-w-sm">
                    <div className="relative mb-2 w-full pt-[56%] group">
                        <div className="absolute inset-0">
                            {playlistData.videos.length > 0 ? <img src={playlistData.videos[0].thumbnail} alt={`${playlistData.playlistName} | by @${playlistData.owner.username}`} className="h-full w-full rounded-md object-cover" />
                                :
                                <div className='bg-gray-400 h-full w-full rounded-md flex items-center justify-center'> <Play className='group-hover:text-background' /> </div>}

                            <div className="absolute inset-x-0 bottom-0">
                                <div className="relative bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                                    <div className="relative z-[1]">
                                        <p className="flex justify-between">
                                            <span className="inline-block">Playlist</span>
                                            <span className="inline-block">{`${formatNumbers(playlistData.videos.length)} videos`}</span>
                                        </p>
                                        <p className="text-sm text-gray-200">{`${formatNumbers(playlistData.totalViews)} Views • ${timeAgo(playlistData.createdAt)}`}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='flex justify-between items-start gap-x-2'>
                            <h6 className="mb-1 font-semibold">{playlistData.playlistName}</h6>
                            {playlistData.isPlaylistOwner && (
                                <span className='flex gap-x-2 items-center'>
                                    <button className="relative group cursor-pointer h-min  sm:mr-2" title={playlistData.isPublic ? "Public" : "Private"}>{playlistData.isPublic ? <Earth className='size-4' /> : <LockKeyholeIcon className='size-4' />}
                                        <span className='top-1/2 right-6 -translate-y-1/2 sm:right-auto sm:-translate-y-0 sm:-translate-x-1/2 sm:left-1/2 sm:top-6 z-[5] text-sm bg-primary text-background absolute text-nowrap hidden group-hover:block group-focus:block px-3 py-1 border border-zinc-600 rounded-md backdrop-blur-md'>{playlistData.isPublic ? "This playlist is public" : `This playlist is private`}</span>
                                        <span className='w-3 h-3 sm:translate-y-1 sm:translate-x-1/2  z-[1] absolute -left-3 top-1/2 -translate-x-1/2 -translate-y-1/2 right-1/2 sm:left-auto  sm:top-auto sm:right-1/2 hidden group-hover:block group-focus:block rotate-45 bg-primary border border-zinc-600'></span>
                                    </button>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild title='options' className="mx-auto">
                                            <div className='flex cursor-pointer px-[15px] py-2 rounded-full transition-colors hover:bg-primary/30 flex-col gap-1 h-max w-max'>
                                                <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
                                                <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
                                                <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className={`min-w-min !z-30 ${optionLoader ? "!pointer-events-none opacity-70" : "pointer-events-auto"}`}>
                                            <DropdownMenuItem className="py-0 px-1 w-full">
                                                <Button className="bg-transparent w-max h-min text-primary shadow-none hover:bg-transparent hover:text-primary" onClick={() => { setOpenEditPopup(true) }}>
                                                    <EditIcon />Edit
                                                </Button>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <AlertDialog>
                                                <AlertDialogTrigger className="py-0 px-0 w-max hover:bg-accent rounded-sm transition-colors ">
                                                    <div role="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-4 py-2 bg-transparent w-max h-min text-primary shadow-none hover:bg-transparent hover:text-primary text-red-600 hover:text-red-600" >
                                                        <Trash2 />Delete
                                                    </div>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete your playlist.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction className="text-red-600 bg-transparent shadow-none hover:bg-accent border border-input" onClick={() => deletePlaylist()}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </span>
                            )}
                        </div>
                        {playlistData.description && <p ref={descriptionRef} role="button" className={`w-full relative cursor-pointer text-sm text-primary/60 break-words break-all whitespace-pre-wrap transition-all ${showFullDescription ? "h-full" : "line-clamp-3 "}`} onClick={() => setShowFullDescription(!showFullDescription)}>{<ParseContents content={playlistData.description} />} {isDescOverflowing && <span className={`font-bold bottom-0 left-0 ${showFullDescription ? "block" : "absolute w-full bg-background"}`}>{showFullDescription ? "Show Less" : "...more"}</span>} </p>}
                    </div>
                    <div className="mt-6 flex items-center gap-x-3">
                        <AccountHover user={{ ...playlistData.owner, subscribers: playlistData.owner.subscribersCount, isSubscribed: playlistData.owner.isSubscribed }} toggleSubscribe={toggleSubscribe}>
                            <div onClick={() => navigate(`/@${playlistData.owner.username}`)} className="h-16 w-16 shrink-0 cursor-pointer">
                                <img src={setAvatar(playlistData.owner.avatar)} alt={`@${playlistData.owner.username}`} className="h-full w-full rounded-full object-cover" />
                            </div>
                        </AccountHover>
                        <div className="w-full">
                            <AccountHover user={{ ...playlistData.owner, subscribers: playlistData.owner.subscribersCount, isSubscribed: playlistData.owner.isSubscribed }} toggleSubscribe={toggleSubscribe}>
                            <div className="font-bold relative flex" onClick={() => navigate(`/@${playlistData.owner.username}`)}>
                                <h6 className="font-semibold break-words break-all whitespace-pre-wrap min-w-0 max-w-[8rem] sm:max-w-[15rem] lg:max-w-[10rem] line-clamp-1">{playlistData.owner.fullName}</h6>
                                {playlistData.owner.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                    <BadgeCheck className='w-5 h-5 fill-blue-600 text-background inline-block ' />
                                </span>}
                            </div>
                                <p className="text-sm text-primary/60 cursor-pointer w-max" onClick={() => navigate(`/@${playlistData.owner.username}`)}>{`${formatNumbers(playlistData.owner.subscribersCount)} Subscribers`}</p>
                            </AccountHover>
                        </div>
                    </div>
                </div>
                <div className="flex w-full flex-col gap-y-4">

                    {playlistData.videos.length > 0 ?
                        playlistData.videos.map((video) => {
                            return (
                                <div key={video._id} className="sm:border border-zinc-500 rounded-md shadow-md">
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
                                            <AccountHover user={{ ...video.owner, subscribers: video.owner.subscribersCount, isSubscribed: video.owner.isSubscribed }} toggleSubscribe={toggleSubscribe}>
                                                <div onClick={() => navigate(`/@${video.owner.username}`)} className="h-10 w-10 shrink-0 sm:hidden cursor-pointer">
                                                    <img src={video.owner.avatar} alt={`@${video.owner.username}`} className="h-full w-full rounded-full object-cover" />
                                                </div>
                                            </AccountHover>
                                            <div className="w-full">
                                                <div className='flex justify-between gap-x-2 items-start'>
                                                    <NavLink to={`/video/${video._id}`} className="flex-1">
                                                        <h6 className="mb-1 sm:mt-1 font-semibold sm:max-w-[75%] max-h-16 line-clamp-2 whitespace-normal" title={video.title}>{video.title}</h6>
                                                    </NavLink>

                                                    {playlistData.isPlaylistOwner && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild title='options'>
                                                                <div className='flex cursor-pointer px-[15px] py-2 rounded-full transition-colors hover:bg-primary/30 flex-col gap-1 h-max w-max'>
                                                                    <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
                                                                    <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
                                                                    <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
                                                                </div>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent className={`min-w-min !z-30 ${optionLoader ? "!pointer-events-none opacity-70" : "pointer-events-auto"}`}>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger className="py-0 px-0 w-max hover:bg-accent rounded-sm transition-colors ">
                                                                        <div role="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-4 py-2 bg-transparent w-max h-min text-primary shadow-none hover:bg-transparent hover:text-primary text-red-600 hover:text-red-600" >
                                                                            <Trash2 />Delete
                                                                        </div>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This action cannot be undone. This will permanently delete this video from playlist.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction className="text-red-600 bg-transparent shadow-none hover:bg-accent border border-input" onClick={() => deleteVideo(video._id)}>Delete</AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </div>
                                                <NavLink to={`/video/${video._id}`}>
                                                    <p className="flex text-sm text-primary/90 sm:pt-3" title={`${formatNumbers(video.views)} Views | uploaded ${timeAgo(video.createdAt)}`}>{`${formatNumbers(video.views)} Views • ${timeAgo(video.createdAt)}`}</p>
                                                </NavLink>
                                                <div className="flex items-center sm:gap-x-4">
                                                    <AccountHover user={{ ...video.owner, subscribers: video.owner.subscribersCount, isSubscribed: video.owner.isSubscribed }} toggleSubscribe={toggleSubscribe}>
                                                        <div className="mt-2 hidden h-10 w-10 shrink-0 sm:block cursor-pointer" onClick={() => navigate(`/@${video.owner.username}`)}>
                                                            <img src={setAvatar(video.owner.avatar)} alt={`@${video.owner.username}`} className="h-full w-full rounded-full object-cover" />
                                                        </div>
                                                    </AccountHover>

                                                    <AccountHover user={{ ...video.owner, subscribers: video.owner.subscribersCount, isSubscribed: video.owner.isSubscribed }} toggleSubscribe={toggleSubscribe}>
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
                            )
                        })

                        :
                        <div>
                            <p>This playlist don't have any video to show</p>
                        </div>
                    }
                </div>
            </div>



        </section>
    )

    return (
        <NotFound />
    )
}

export default PlaylistVideo
