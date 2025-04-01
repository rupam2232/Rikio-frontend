import { useEffect, useState, useCallback, useRef } from 'react'
import axios from '../utils/axiosInstance.js';
import { timeAgo } from '../utils/timeAgo.js'
import { videoDuration } from '../utils/videoDuration.js'
import formatNumbers from '../utils/formatNumber.js'
import setAvatar from '../utils/setAvatar.js'
import errorMessage from '../utils/errorMessage.js';
import { AvatarImage, Avatar } from '@/components/ui/avatar.jsx'
import { NavLink } from 'react-router-dom'
import VideoNotFound from './VideoNotFound.jsx'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const ChannelVideo = ({ username, isChannelOwner }) => {
    const [videos, setVideos] = useState([]);
    const [totalPages, setTotalPages] = useState(null)
    const [page, setPage] = useState(1)
    const [videoLoader, setVideoLoader] = useState(true)
    const [sortType, setSortType] = useState("desc")
    const [loader, setLoader] = useState(true);
    const isFetching = useRef(false);
    const observer = useRef();

    useEffect(() => {
        const fetchVideos = () => {
            if ((totalPages && page > totalPages) || isFetching.current === true) {
                setVideoLoader(false)
                setLoader(false)
                return;
            }
            if (videos.length !== 0) {
                isFetching.current = true;
                setVideoLoader(true)
                axios.get(`/videos/?channel=${username}&sortType=${sortType}&page=${page}`)
                    .then((value) => {
                        setTotalPages(value.data.data.totalPages)
                        setVideos([
                            ...videos,
                            ...value.data.data.channelsAllVideo.filter((video) =>
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
        fetchVideos();
    }, [username, page])

    useEffect(() => {
        isFetching.current = true;
        setLoader(true)
        setPage(1)
        axios.get(`/videos/?channel=${username}&sortType=${sortType}`)
            .then((value) => {
                setTotalPages(value.data.data.totalPages)
                setVideos(value.data.data.channelsAllVideo)
            })
            .catch((error) => console.error(errorMessage(error)))
            .finally(() => {
                isFetching.current = false;
                setLoader(false)
            })
    }, [sortType, username])

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
        return (<div className='h-[80vh] flex items-center justify-center flex-col'>
            <VideoNotFound className="!h-max !pb-0" pText="This channel has yet to upload a video. Search another channel in order to find more videos." />
            {isChannelOwner && <NavLink to="/upload" className="flex justify-center mt-4 bg-[#ae7aff] px-4 py-2 rounded-md font-medium text-sm">Upload Video</NavLink>}
        </div>)
    }

    return (
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-x-4 gap-y-8 p-2 relative pt-12 mt-2 mb-5">
            <div className='absolute top-0 right-0 z-20 bg-background'>
                <Select onValueChange={(e) => setSortType(e)} defaultValue={sortType}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Latest</SelectItem>
                        <SelectItem value="asc">Oldest</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {videos ? videos.map((video, index) => {
                if (videos.length === index + 1) {
                    return (
                        <div key={video._id} ref={lastVideoElementRef} className="aspect-video rounded-xl">
                            <div className='relative mb-2 w-full pt-[56%]' aria-label='Thubmnail'>
                                <NavLink to={`/video/${video._id}`}>
                                    <div className="absolute inset-0">
                                        <img src={video.thumbnail} alt={`${video.title} uploaded by @${video.owner.username}`} className='w-full h-full object-cover rounded-md pointer-events-none' />
                                    </div>
                                    <span className="absolute bottom-1 right-1 inline-block rounded bg-black/100 text-white px-1.5 text-sm">{videoDuration(video.duration)}</span>
                                </NavLink>
                            </div>
                            <div className="flex gap-x-2 cursor-pointer">

                                <div className="cursor-pointer">
                                    <Avatar className='h-10 w-10 shrink-0'>
                                        <AvatarImage src={setAvatar(video.owner.avatar)} alt={`@${video.owner.username}`} className="object-cover" />
                                    </Avatar>
                                </div>

                                <div className="w-full">
                                    <NavLink to={`/video/${video._id}`} >
                                        <h6 className="mb-1 font-semibold max-h-16 line-clamp-2 text-lg whitespace-normal" title={video.title}>{video.title}</h6>
                                        <p className="flex text-sm text-secondary-foreground" title={`${formatNumbers(video.views)} views | uploaded ${timeAgo(video.createdAt)}`}>
                                            <span>{formatNumbers(video.views)} views </span>
                                            <span className=" before:content-['•'] before:px-2">{timeAgo(video.createdAt)}</span>
                                        </p>
                                    </NavLink>

                                    <span className='text-sm cursor-pointer text-secondary-foreground/70'>{`@${video.owner.username}`}</span>

                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div key={video._id} className="aspect-video rounded-xl">
                            <div className='relative mb-2 w-full pt-[56%]' aria-label='Thubmnail'>
                                <NavLink to={`/video/${video._id}`}>
                                    <div className="absolute inset-0" title={video.title}>
                                        <img src={video.thumbnail} alt={`${video.title} | uploaded by @${video.owner.username}`} className='w-full h-full object-cover rounded-md pointer-events-none' />
                                    </div>
                                    <span className="absolute bottom-1 right-1 inline-block rounded bg-black/100 text-white px-1.5 text-sm">{videoDuration(video.duration)}</span>
                                </NavLink>
                            </div>
                            <div className="flex gap-x-2 cursor-pointer">

                                <div className="cursor-pointer">
                                    <Avatar className='h-10 w-10 shrink-0'>
                                        <AvatarImage src={setAvatar(video.owner.avatar)} alt={`@${video.owner.username}`} className="object-cover" />
                                    </Avatar>
                                </div>

                                <div className="w-full">
                                    <NavLink to={`/video/${video._id}`} >
                                        <h6 className="mb-1 font-semibold max-h-16 line-clamp-2 text-lg whitespace-normal" title={video.title}>{video.title}</h6>
                                        <p className="flex text-sm text-secondary-foreground" title={`${formatNumbers(video.views)} views | uploaded ${timeAgo(video.createdAt)}`}>
                                            <span>{formatNumbers(video.views)} views </span>
                                            <span className=" before:content-['•'] before:px-2">{timeAgo(video.createdAt)}</span>
                                        </p>
                                    </NavLink>

                                    <span className='text-sm cursor-pointer text-secondary-foreground/70'>{`@${video.owner.username}`}</span>

                                </div>
                            </div>
                        </div>
                    )
                }
            }) : <h1>Some thing went wrong please refresh the page or else contact to the support</h1>}

            {videoLoader && (
                <>
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
                </>
            )}

        </div>
    )
}

export default ChannelVideo
