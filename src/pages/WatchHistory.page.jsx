import { useEffect, useState, useRef, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { timeAgo } from '../utils/timeAgo'
import { AccountHover } from "../components/index.js"
import { useNavigate } from 'react-router-dom'
import formatNumbers from '../utils/formatNumber.js'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'
import setAvatar from '../utils/setAvatar.js'
import { videoDuration } from '../utils/videoDuration.js'
import toast from "react-hot-toast"
import { LoaderCircle, LockKeyholeIcon, Play, Loader, HistoryIcon } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice.js'

const WatchHistory = () => {
    const [historyData, setHistoryData] = useState()
    const [loader, setLoader] = useState(true)
    const [videoLoader, setVideoLoader] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [page, setPage] = useState(1)
    const isFetching = useRef(false);
    const observer = useRef();
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if ((historyData?.totalPages && page > totalPages) || isFetching.current === true) {
            setVideoLoader(false)
            setLoader(false)
            return;
        }
        isFetching.current = true;
        if (historyData?.history?.length > 0) {
            setVideoLoader(true)
            axios.get(`/users/history?page=${page}`)
                .then((res) => {
                    setTotalPages(res.data.data.totalPages)
                    const newHistory = res.data.data.history;

                    setHistoryData((prevHistory) => {
                        let updatedHistory = [...prevHistory.history];

                        newHistory.forEach((newEntry) => {
                            const existingIndex = updatedHistory.findIndex(
                                (entry) => entry.createdAt.split("T")[0] === newEntry.createdAt.split("T")[0]
                            );

                            if (existingIndex !== -1) {
                                newEntry.videos.forEach((video) => {
                                    const isDuplicate = updatedHistory[existingIndex].videos.some(
                                        (existingVideo) => existingVideo._id === video._id
                                    );
                                    if (!isDuplicate) {
                                        updatedHistory[existingIndex].videos.push(video);
                                    }
                                })
                            } else {
                                updatedHistory.push(newEntry);
                            }
                        });

                        return { ...res.data.data, history: updatedHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) };
                    });
                })
                .catch((error) => {
                    console.error(errorMessage(error))
                })
                .finally(() => {
                    isFetching.current = false;
                    setVideoLoader(false)
                }
                )
        } else {
            setLoader(true)
            axios.get('/users/history')
                .then((res) => {
                    setTotalPages(res.data.data.totalPages)
                    setHistoryData(res.data.data)
                })
                .catch((error) => {
                    console.error(errorMessage(error))
                })
                .finally(() => {
                    setLoader(false)
                })
        }
        isFetching.current = false;
    }, [page])

    const lastVideoElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && (historyData?.totalPages && page < totalPages)) {
                setPage(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [])

    const toggleSubscribe = (userId) => {
        axios.post(`/subscription/c/${userId}`)
            .then((value) => {
                let updatedHistoryData = historyData.history
                if (value.data.message.toLowerCase() === "subscribed") {
                    updatedHistoryData = historyData.history.map((day) => {
                        let updatedVideos = day.videos.map((video) => {
                            if (video.owner._id === userId) {
                                video.owner.isSubscribed = true
                                video.owner.subscribers = video.owner.subscribers + 1
                            }
                            return video
                        })
                        return { ...day, videos: updatedVideos }
                    })
                    setHistoryData({ ...historyData, history: updatedHistoryData })

                } else if (value.data.message.toLowerCase() === "unsubscribed") {

                    updatedHistoryData = historyData.history.map((day) => {
                        let updatedVideos = day.videos.map((video) => {
                            if (video.owner._id === userId) {
                                video.owner.isSubscribed = false
                                video.owner.subscribers = video.owner.subscribers - 1
                            }
                            return video
                        })
                        return { ...day, videos: updatedVideos }
                    })
                    setHistoryData({ ...historyData, history: updatedHistoryData })
                } else {
                    setHistoryData(historyData)
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
                setHistoryData(historyData)
            })
    }

    if (loader) {
        return (<div className='w-full h-full flex justify-center items-center'>
            <LoaderCircle className="w-16 h-16 animate-spin" />
        </div>)
    }
    return (
        <section className='w-full pt-0 mb-10'>
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='flex justify-between items-start gap-x-2'>
                            <div className='mb-1'>
                                <h6 className="font-semibold flex items-center gap-2"><span><HistoryIcon className='size-4' /></span>Watch History</h6>
                                <p className='text-sm text-primary/80'>Videos you have watched before.</p>
                            </div>
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
                    <p className="text-center text-zinc-500">No watch history available.</p>
                ) : (
                    <div className="flex w-full flex-col gap-y-4">
                        {historyData.history.map((day, index) => (
                            <div key={index}>
                                <h3 className="text-xl font-medium mb-3">
                                    {`${new Date(day.createdAt).getDate()}th ${new Date(day.createdAt).toLocaleString('default', { month: 'long' })} ${new Date(day.createdAt).getFullYear()}`}
                                </h3>
                                <hr className="my-4 border-primary" />

                                <div className="flex w-full flex-col gap-y-4">
                                    {day.videos.map((video, i) => {
                                        if (historyData.history.length === index + 1 && day.videos.length === i + 1) {
                                            return (
                                                <div ref={lastVideoElementRef} key={i + Date.now() + (Math.random() * 10 + Math.random() * 10)} className="sm:border border-zinc-500 rounded-md shadow-md">
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
                                                <div key={i + Date.now() + (Math.random() * 10 + Math.random() * 10)} className="sm:border border-zinc-500 rounded-md shadow-md">
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
                                </div>
                            </div>
                        ))}
                        {videoLoader && <div className='w-full flex justify-center items-center'>
                            <Loader className="animate-spin" />
                        </div>}
                    </div>
                )}
            </div>
        </section>
    )
}

export default WatchHistory
