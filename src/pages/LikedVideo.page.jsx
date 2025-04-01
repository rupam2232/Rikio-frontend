import { useState, useEffect, useRef, useCallback } from 'react'
import { ChannelVideo } from '../components/index.js'
import { Loader, LockKeyholeIcon, Play, ThumbsUp } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import formatNumbers from '../utils/formatNumber.js'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'
import setAvatar from '../utils/setAvatar.js'
import { videoDuration } from '../utils/videoDuration.js'
import toast from "react-hot-toast"
import { timeAgo } from '../utils/timeAgo'
import { AccountHover } from "../components/index.js"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const LikedVideo = () => {
    const [videos, setVideos] = useState([]);
    const [totalPages, setTotalPages] = useState(null)
    const [totalVideos, setTotalVideos] = useState(null)
    const [page, setPage] = useState(1)
    const [videoLoader, setVideoLoader] = useState(true)
    const [sortType, setSortType] = useState("desc")
    const [loader, setLoader] = useState(true);
    const isFetching = useRef(false);
    const observer = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchLikedVideos = () => {
            if ((totalPages && page > totalPages) || isFetching.current === true) {
                setVideoLoader(false)
                setLoader(false)
                return;
            }
            if (videos.length !== 0) {
                isFetching.current = true;
                setVideoLoader(true)
                axios.get(`/like/videos/?sortType=${sortType}&page=${page}`)
                    .then((value) => {
                        setTotalPages(value.data.data.totalPages)
                        setTotalVideos(value.data.data.totalVideos)
                        setVideos([
                            ...videos,
                            ...value.data.data.likedVideos.filter((video) =>
                                !videos.some((v) =>
                                    v._id === video._id
                                ))
                        ])

                    })
                    .catch((error) => console.error(errorMessage(error)))
                    .finally(() => {
                        isFetching.current = false;
                        setVideoLoader(false)
                    })
                return;
            }
        }
        fetchLikedVideos();
    }, [page])


    useEffect(() => {
        isFetching.current = true;
        setLoader(true)
        setPage(1)
        axios.get(`/like/videos/?sortType=${sortType}`)
            .then((value) => {
                setTotalPages(value.data.data.totalPages)
                setTotalVideos(value.data.data.totalVideos)
                setVideos(value.data.data.likedVideos)
            })
            .catch((error) => console.error(errorMessage(error)))
            .finally(() => {
                isFetching.current = false;
                setLoader(false)
            })
    }, [sortType])

    const toggleSubscribe = (ownerId) => {
        axios.post(`/subscription/c/${ownerId}`)
            .then((value) => {
                if (value.data.message.toLowerCase() === "subscribed") {
                    let updatedVideos = videos.map((video) => {
                        if (video.owner._id === ownerId) {
                            video.owner.isSubscribed = true
                            video.owner.subscribers += 1
                        }
                        return video
                    })
                    setVideos(updatedVideos)
                } else if (value.data.message.toLowerCase() === "unsubscribed") {
                    let updatedVideos = videos.map((video) => {
                        if (video.owner._id === ownerId) {
                            video.owner.isSubscribed = false
                            video.owner.subscribers -= 1
                        }
                        return video
                    })
                    setVideos(updatedVideos)
                } else {
                    setVideos(videos)
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
                } else {
                    toast.error(errorMessage(error), {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                }
                console.error(errorMessage(error));
            })
    }

    const lastVideoElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [])

    if (loader === true) {
        return (
            <div className='w-full h-full pb-[70px] sm:pb-0 flex justify-center items-center'>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] auto-rows-min gap-x-4 gap-y-8 ">

                        <div className="flex flex-col gap-y-3" >
                            <div className="aspect-video rounded-xl animate-pulse bg-muted/90" >
                            </div>
                            <div className="flex gap-x-2">
                                <div className="w-12 h-10 rounded-full animate-pulse bg-muted/90">
                                </div>
                                <div className="w-full h-16">
                                    <div className='w-full h-1/3 rounded-xl animate-pulse bg-muted/90'></div>
                                    <div className='w-2/3 h-1/3 mt-2 rounded-xl animate-pulse bg-muted/90'></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-3" >
                            <div className="aspect-video rounded-xl animate-pulse bg-muted/90" >
                            </div>
                            <div className="flex gap-x-2">
                                <div className="w-12 h-10 rounded-full animate-pulse bg-muted/90">
                                </div>
                                <div className="w-full h-16">
                                    <div className='w-full h-1/3 rounded-xl animate-pulse bg-muted/90'></div>
                                    <div className='w-2/3 h-1/3 mt-2 rounded-xl animate-pulse bg-muted/90'></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-3" >
                            <div className="aspect-video rounded-xl animate-pulse bg-muted/90" >
                            </div>
                            <div className="flex gap-x-2">
                                <div className="w-12 h-10 rounded-full animate-pulse bg-muted/90">
                                </div>
                                <div className="w-full h-16">
                                    <div className='w-full h-1/3 rounded-xl animate-pulse bg-muted/90'></div>
                                    <div className='w-2/3 h-1/3 mt-2 rounded-xl animate-pulse bg-muted/90'></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-3" >
                            <div className="aspect-video rounded-xl animate-pulse bg-muted/90" >
                            </div>
                            <div className="flex gap-x-2">
                                <div className="w-12 h-10 rounded-full animate-pulse bg-muted/90">
                                </div>
                                <div className="w-full h-16">
                                    <div className='w-full h-1/3 rounded-xl animate-pulse bg-muted/90'></div>
                                    <div className='w-2/3 h-1/3 mt-2 rounded-xl animate-pulse bg-muted/90'></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-3" >
                            <div className="aspect-video rounded-xl animate-pulse bg-muted/90" >
                            </div>
                            <div className="flex gap-x-2">
                                <div className="w-12 h-10 rounded-full animate-pulse bg-muted/90">
                                </div>
                                <div className="w-full h-16">
                                    <div className='w-full h-1/3 rounded-xl animate-pulse bg-muted/90'></div>
                                    <div className='w-2/3 h-1/3 mt-2 rounded-xl animate-pulse bg-muted/90'></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-3" >
                            <div className="aspect-video rounded-xl animate-pulse bg-muted/90" >
                            </div>
                            <div className="flex gap-x-2">
                                <div className="w-12 h-10 rounded-full animate-pulse bg-muted/90">
                                </div>
                                <div className="w-full h-16">
                                    <div className='w-full h-1/3 rounded-xl animate-pulse bg-muted/90'></div>
                                    <div className='w-2/3 h-1/3 mt-2 rounded-xl animate-pulse bg-muted/90'></div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/90" />
                </div>
            </div>)
    }

    if (videos.length === 0) {
        return (<section className='h-[80vh] flex items-center justify-center flex-col'>
            <div className='mb-2 px-2 py-2 w-auto  text-[#AE7AFF] bg-[#E4D3FF] rounded-full'>
                <ThumbsUp className='size-7' />
            </div>
            <h3 className='font-bold mb-2'>No liked videos</h3>
            <p>You haven't liked any video</p>
        </section>)
    }

    return (
        <section className="w-full pt-0 mb-10">
            <div className="flex flex-wrap gap-x-4 gap-y-5 p-4 lg:flex-nowrap">

                <div className="w-full shrink-0 sm:max-w-md lg:max-w-sm">
                    <div className="relative mb-2 w-full pt-[56%] group">
                        <div className="absolute inset-0">
                            {videos.length > 0 ? <img src={videos[0].thumbnail} alt={`Watch history`} className="h-full w-full rounded-md object-cover" />
                                :
                                <div className='bg-gray-400 h-full w-full rounded-md flex items-center justify-center'> <Play className='group-hover:text-background' /> </div>}

                            <div className="absolute inset-x-0 bottom-0">
                                <div className="relative bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                                    <div className="relative z-[1]">
                                        <p className="flex justify-between">
                                            <span className="inline-block">{`${totalVideos} videos`}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='flex justify-between items-start gap-x-2'>
                            <div className='mb-1'>
                                <h6 className="font-semibold flex items-center gap-2"><span><ThumbsUp className='size-4' /></span>Liked Videos</h6>
                                <p className='text-sm text-primary/80'>Videos you have liked.</p>
                            </div>
                            <span className='flex gap-x-2 items-center'>
                                <button className="relative group cursor-pointer h-min  sm:mr-2" title={"Private"}>{<LockKeyholeIcon className='size-4' />}
                                    <span className='top-1/2 right-6 -translate-y-1/2 sm:right-auto sm:-translate-y-0 sm:-translate-x-1/2 sm:left-1/2 sm:top-6 z-[5] text-sm bg-primary text-background absolute text-nowrap hidden group-hover:block group-focus:block px-3 py-1 border border-zinc-600 rounded-md backdrop-blur-md'>{`Only you can see your liked video list`}</span>
                                    <span className='w-3 h-3 sm:translate-y-1 sm:translate-x-1/2  z-[1] absolute -left-3 top-1/2 -translate-x-1/2 -translate-y-1/2 right-1/2 sm:left-auto  sm:top-auto sm:right-1/2 hidden group-hover:block group-focus:block rotate-45 bg-primary border border-zinc-600'></span>
                                </button>
                            </span>
                        </div>
                    </div>
                    <hr className="my-4 sm:hidden border-primary" />
                </div>

                <div className="flex w-full flex-col gap-y-4 relative pt-12">
                    <div className='absolute top-0 right-0 z-20 bg-background'>
                        <Select onValueChange={(e) => setSortType(e)} defaultValue={sortType}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Latest liked</SelectItem>
                                <SelectItem value="asc">Oldest liked</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {videos.map((video, index) => {
                        if (videos.length === index + 1) {
                            return (
                                <div key={video._id} ref={lastVideoElementRef} className="sm:border s border-zinc-500 rounded-md shadow-md">
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
                            )
                        } else {
                            return (
                                <div key={video._id} className="sm:border s border-zinc-500 rounded-md shadow-md">
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
                            )
                        }

                    })}

                    {videoLoader && <div className='w-full flex justify-center items-center'>
                        <Loader className="animate-spin" />
                    </div>}
                </div>

            </div>
        </section>
    )
}

export default LikedVideo