import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import NotFound from './NotFound.page.jsx'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'
import formatNumbers from '../utils/formatNumber.js'
import setAvatar from '../utils/setAvatar.js'
import { timeAgo } from '../utils/timeAgo.js'
import { videoDuration } from '../utils/videoDuration.js'
import { AccountHover, Button } from '../components/index.js'
import { LoaderCircle, BadgeCheck, UserRoundPlus, UserRoundCheck } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { AvatarImage, Avatar } from '@/components/ui/avatar.jsx'
import { useNavigate } from 'react-router-dom'
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

const SearchResult = () => {
    const [searchResult, setSearchResult] = useState({})
    const [searchResultError, setSearchResultError] = useState(null)
    const [loader, setLoader] = useState(true)
    const [searchParams] = useSearchParams({})
    const query = searchParams.get('query')
    const navigate = useNavigate()

    useEffect(() => {
        if (!query) return;
        setLoader(true)
        axios.get(`/videos/?search=${query}`)
            .then((res) => {
                setSearchResult(res.data)
                console.log(res.data)
            })
            .catch((err) => {
                console.error(errorMessage(err))
                setSearchResultError(errorMessage(err))
            })
            .finally(() => {
                setLoader(false)
            })
    }, [query])

    const toggleSubscribe = (owner) => {
        const newSearchResult = { ...searchResult }
        const newVideos = newSearchResult.data.videos.map((video) => {
            if (video.owner._id === owner._id) {
                return { ...video, owner: { ...video.owner, isSubscribed: !owner.isSubscribed } }
            }
            return video
        })
        newSearchResult.data.videos = newVideos
        setSearchResult(newSearchResult)
    }

    if (!query) {
        return <NotFound>
            <p>Please Search something to access this page.</p>
        </NotFound>
    }

    if (loader) {
        return (<section className='w-full h-full flex justify-center items-center'>
            <LoaderCircle className="w-16 h-16 animate-spin" />
        </section>)
    }

    if (searchResultError) {
        return <NotFound>
            <p>{searchResultError}</p>
        </NotFound>
    }

    return (
        <section className='w-full pb-16'>
            <h2 className='text-2xl font-semibold text-primary/80 mb-4 md:mx-auto md:w-11/12'>{searchResult.message}</h2>

                {searchResult.data.users && searchResult.data.users.length > 0 && <>
                <h3 className='text-xl font-semibold text-primary/90 md:mx-auto md:w-11/12'>Channels</h3>
                <hr className='mt-3 mb-5 border-primary/50 mx-6' />
                </>}
            <div className="flex w-full flex-col gap-y-2 md:mx-auto md:w-11/12 lg:w-10/12 xl:w-9/12 ">

                {searchResult.data.users && searchResult.data.users.map((user) => {
                    return (<div key={user.channel._id} className='space-y-1 mb-6'>
                    <div className='w-full flex justify-between items-center hover:bg-accent p-2 rounded-md'>
                        <div className='flex-1 cursor-pointer' onClick={() => navigate(`/@${user.channel.username}`)}>
                        <AccountHover user={user.channel} toggleSubscribe={toggleSubscribe}>
                            <div className="flex flex-row items-center gap-x-4">
                                <Avatar className='h-12 w-12'>
                                    <AvatarImage src={setAvatar(user.channel.avatar)} alt={`@${user.channel.username}`} className="object-cover" />
                                </Avatar>
                                <div className="block">
                                    <div className="font-bold relative flex">
                                        <p className='break-words break-all whitespace-pre-wrap min-w-0 max-w-[8rem] sm:max-w-[10rem] md:max-w-[15rem] lg:max-w-[20rem] line-clamp-1'>{user.channel.fullName}</p>
                                        {user.channel.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                            <BadgeCheck title="verified" className='w-5 h-5 fill-blue-600 text-background inline-block ' />
                                        </span>}</div>
                                    <p className="text-sm text-sidebar-foreground/95">{formatNumbers(user.channel.subscribers)} Subscribers</p>
                                </div>
                            </div>
                        </AccountHover>
                        </div>
                        {user.channel.isSubscribed ?
                            <AlertDialog>
                                <AlertDialogTrigger className="py-0 px-0 w-max hover:bg-accent rounded-sm transition-colors ">
                                    <div role='button' className="gap-0 rounded-md py-2 px-4 group flex w-auto items-center hover:bg-[#b689ff] bg-[#ae7aff] text-center text-primary justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                                        <span className=" w-5 hidden xs:inline-block group-hover:text-red-600">
                                            <UserRoundCheck />
                                        </span>
                                        <span data-subscribed="Subscribed" data-unsubscribe="Unsubscribe" className='w-20 after:text-sm group-hover:after:content-[attr(data-unsubscribe)] after:content-[attr(data-subscribed)] group-hover:text-red-600'></span>
                                    </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Unsubscribe {user.channel.fullName}?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently remove you from {user.channel.fullName}'s subscribers list.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction className="text-red-600 bg-transparent shadow-none hover:bg-accent border border-input" onClick={() => toggleSubscribe(user.channel._id)}>Unsubscribe</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog> :
                            <Button className="gap-0 py-2 px-4 group flex w-auto items-center hover:bg-[#b689ff] bg-[#ae7aff] text-center text-primary" onClick={() => toggleSubscribe(user.channel._id)}>
                                <span className="hidden xs:inline-block w-5">
                                    <UserRoundPlus />
                                </span>
                                <span className='w-20 text-xs xs:text-sm'>Subscribe</span>
                            </Button>
                        }
                    </div>

                    <div>
                        {user.videos.length > 0 && user.videos.map((video) => {
                            return (<div key={video._id} className="sm:border border-zinc-500 rounded-md shadow-md">
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
                            </div>)
                        })}
                    </div>
                    </div>)
                })}
            </div>

                {searchResult.data.videos && searchResult.data.videos.length > 0 && <>
                <h3 className='text-xl font-semibold text-primary/90 md:mx-auto md:w-11/12'>Videos</h3>
                <hr className='mt-3 mb-5 border-primary/50 mx-6' />
                </>}
            <div className="flex w-full flex-col gap-y-4 md:mx-auto md:w-11/12 lg:w-10/12 xl:w-9/12 ">
                {searchResult.data.videos && searchResult.data.videos.map((video) => {
                    return (<div key={video._id} className="sm:border border-zinc-500 rounded-md shadow-md">
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
                    </div>)
                })}
            </div>
        </section>
    )
}

export default SearchResult
