import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { timeAgo } from '../utils/timeAgo'
import { Like, Button, AccountHover, Comments, ParseContents, Video as VideoPlayer } from "../components/index.js"
import { useNavigate } from 'react-router-dom'
import formatNumbers from '../utils/formatNumber.js'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'
import setAvatar from '../utils/setAvatar.js'
import toast from "react-hot-toast"
import { BadgeCheck, UserRoundCheck, UserRoundPlus, LoaderCircle } from 'lucide-react'
import { AvatarImage, Avatar } from '@/components/ui/avatar.jsx'
import { useDispatch } from 'react-redux'
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

const Video = () => {
    const [fullDesc, setFullDesc] = useState(false)
    const [video, setVideo] = useState({})
    const [like, setLike] = useState({})
    const [sub, setSub] = useState(0)
    const [allComment, setAllComment] = useState({})
    const [subscribed, setSubscribed] = useState(false)
    const [loader, setLoader] = useState(true)
    const [error, setError] = useState("")
    const { videoId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const toggleSubscribe = (ownerId) => {

        axios.post(`/subscription/c/${ownerId}`)
            .then((value) => {
                if (value.data.message.toLowerCase() === "subscribed") {
                    if (ownerId === video.owner._id) {
                        setSubscribed(true)
                        axios.get(`/subscription/u/${ownerId}`)
                            .then((value) => {
                                setSub(value.data.data.subscribers.length);
                                let commentData = [...allComment.comments]
                                let updatedComment = commentData.map((coment) => {
                                    if (coment.ownerInfo._id === video.owner._id) {
                                        coment.isSubscribed = true
                                        coment.subscribers = value.data.data.subscribers.length
                                    }
                                    return coment
                                })
                                setAllComment({ ...allComment, comments: updatedComment })
                            })
                            .catch((error) => {
                                console.error(error.message);
                            });
                    } else {
                        setSubscribed(subscribed)
                        let commentData = [...allComment.comments]
                        let updatedComment = commentData.map((coment) => {
                            if (coment.ownerInfo._id === ownerId) {
                                coment.isSubscribed = true
                                coment.subscribers = coment.subscribers + 1
                            }
                            return coment
                        })
                        setAllComment({ ...allComment, comments: updatedComment })
                    }
                } else if (value.data.message.toLowerCase() === "unsubscribed") {
                    if (ownerId === video.owner._id) {
                        setSubscribed(false)
                        axios.get(`/subscription/u/${ownerId}`)
                            .then((value) => {
                                setSub(value.data.data.subscribers.length);
                                let commentData = [...allComment.comments]
                                let updatedComment = commentData.map((coment) => {
                                    if (coment.ownerInfo._id === video.owner._id) {
                                        coment.isSubscribed = false
                                        coment.subscribers = value.data.data.subscribers.length
                                    }
                                    return coment
                                })
                                setAllComment({ ...allComment, comments: updatedComment })
                            })
                            .catch((error) => {
                                console.error(error.message);
                            });
                    } else {
                        setSubscribed(subscribed)
                        let commentData = [...allComment.comments]
                        let updatedComment = commentData.map((coment) => {
                            if (coment.ownerInfo._id === ownerId) {
                                coment.isSubscribed = false
                                coment.subscribers = coment.subscribers - 1
                            }
                            return coment
                        })
                        setAllComment({ ...allComment, comments: updatedComment })
                    }
                } else {
                    setSubscribed(subscribed)
                    setAllComment(allComment)
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
                setSubscribed(subscribed)
            })
    }

    const toggleLike = () => {
        axios.post(`/like/toggle/v/${videoId}`)
            .then((res) => {

                if (res.data.message.trim().toLowerCase() === "liked") {
                    setLike({ _id: video._id, totalLikes: like.totalLikes + 1, isLiked: true })
                } else if (res.data.message.trim().toLowerCase() === "like removed") {
                    setLike({ _id: video._id, totalLikes: like.totalLikes - 1, isLiked: false })
                } else {
                    setLike(like)
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
                setLike(like)
            })
    }

    useEffect(() => {
        setError("")
        axios.get(`/videos/${videoId}`)
            .then((value) => {
                setVideo(value.data.data.video);
                setLike(value.data.data.likes);

                axios.get(`/subscription/u/${value.data.data.video.owner._id}`)
                    .then((value) => {
                        setSub(value.data.data.subscribers.length);
                    })
                    .catch((error) => {
                        console.error(error.message);
                    });

                axios.get(`/subscription/i/${value.data.data.video.owner._id}`)
                    .then((value) => {
                        setSubscribed(value.data.data);
                    })
                    .catch((error) => {
                        console.error(error.message);
                    });
            })
            .catch((error) => {
                const htmlString = error?.response?.data;
                const match = htmlString?.match(/Error:.*?(?=<br>)/);
                match ? setError(match[0].slice(7)) : setError(error.message);
            })
            .finally(() => setLoader(false));
    }, [])

    if (loader) {
        return (<div className='w-full h-full flex justify-center items-center'>
            <LoaderCircle className="w-16 h-16 animate-spin" />
        </div>)
    }

    if (error) {
        return (<div className='content-center text-center w-full h-full'>{error}</div>)
    }

    return (
        <>
            <section className="w-full ">
                <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
                    <div className="col-span-12 w-full">
                        <div className="mb-4 w-full flex justify-center items-center rounded-lg border border-primary/30">
                            <div className="aspect-video w-full lg:w-3/4 2xl:w-2/4 h-full rounded-lg">
                                <VideoPlayer
                                    autoplay={true}
                                    poster={video.thumbnail}
                                    src={video.videoFile}
                                />
                            </div>
                        </div>
                        <div className="mb-4 w-full rounded-lg border border-primary/30 p-4 duration-200">
                            <div className="flex flex-wrap gap-y-2">
                                <div className="w-full">
                                    <h1 className="text-lg line-clamp-2 font-bold" title={video.title}>{video.title}</h1>
                                    <div className="flex text-sm w-max text-sidebar-foreground/95" title={`${formatNumbers(video.views)} views | uploaded ${timeAgo(video.createdAt)}`}>
                                        <p>{formatNumbers(video.views)} views </p>
                                        <p className=" before:content-['•'] before:px-2">{timeAgo(video.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="flex items-center justify-between gap-x-4">
                                        <div className="flex">
                                            <Button
                                                className="flex items-center border font-medium  border-primary/50 shadow-none gap-x-2 border-r bg-border text-primary hover:bg-primary/20 after:content-[attr(data-like)] xs:[&_svg]:size-5 [&_svg]:size-4 text-sm xs:text-base"
                                                data-like={formatNumbers(like.totalLikes)} onClick={toggleLike}>
                                                <span className="inline-block">
                                                    {like.isLiked ? <Like className='fill-[#ae7aff] text-border' /> : <Like className='fill-transparent' />}
                                                </span>
                                            </Button>
                                            {/* dislike button */}
                                            {/* <button
                                            className="group/btn flex items-center gap-x-2 px-4 py-1.5 after:content-[attr(data-like)] hover:bg-white/10 focus:after:content-[attr(data-like-alt)]"
                                            data-like="20"
                                            data-like-alt="21">
                                            <span className="inline-block w-5 group-focus/btn:text-[#ae7aff]">
                                            </span>
                                        </button> */}
                                        </div>
                                        <div className="relative block">
                                            {/* playlist btn */}

                                            {/* <button className="peer flex items-center gap-x-2 rounded-lg bg-white px-4 py-1.5 text-black">
                                            <span className="inline-block w-5">
                                                <PlaylistBtn />
                                            </span>
                                            Save
                                        </button>
                                        <div className="absolute right-0 top-full z-10 hidden w-64 overflow-hidden rounded-lg bg-[#121212] p-4 shadow shadow-slate-50/30 hover:block peer-focus:block">
                                            <h3 className="mb-4 text-center text-lg font-semibold">Save to playlist</h3>
                                            <ul className="mb-4">
                                                <li className="mb-2 last:mb-0">
                                                    <label
                                                        className="group/label inline-flex cursor-pointer items-center gap-x-3"
                                                        for="Collections-checkbox">
                                                        <Input
                                                            type="checkbox"
                                                            className="peer hidden"
                                                            id="Collections-checkbox" />
                                                        <span
                                                            className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] border border-transparent bg-white text-white group-hover/label:border-[#ae7aff] peer-checked:border-[#ae7aff] peer-checked:text-[#ae7aff]">
                                                            <Tick />
                                                        </span>
                                                        Collections
                                                    </label>
                                                </li>
                                            </ul>
                                            <div className="flex flex-col">
                                                <label
                                                    for="playlist-name"
                                                    className="mb-1 inline-block cursor-pointer">
                                                    Name
                                                </label>
                                                <Input
                                                    className="w-full rounded-lg border border-transparent bg-white px-3 py-2 text-black outline-none focus:border-[#ae7aff]"
                                                    id="playlist-name"
                                                    placeholder="Enter playlist name" />
                                                <button className="mx-auto mt-4 rounded-lg bg-[#ae7aff] px-4 py-2 text-black">Create new playlist</button>
                                            </div>
                                        </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-y-3 items-center justify-between">
                                <AccountHover user={{ ...video.owner, isSubscribed: subscribed, subscribers: sub }} toggleSubscribe={toggleSubscribe}>
                                    <div className="flex items-center gap-x-4 group cursor-pointer" onClick={() => navigate(`/@${video.owner.username}`)}>
                                        <Avatar className='h-12 w-12'>
                                            <AvatarImage src={setAvatar(video.owner.avatar)} className="object-cover" />
                                        </Avatar>
                                        <div className="block">
                                            <p className="font-bold relative">
                                                {video.owner.fullName}{video.owner.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                                    <BadgeCheck title="verified" className='w-5 h-5 fill-blue-600 text-background inline-block ' />
                                                </span>}</p>
                                            <p className="text-sm text-sidebar-foreground/95">{formatNumbers(sub)} Subscribers</p>
                                        </div>
                                    </div>
                                </AccountHover>
                                <div className="block">

                                    {subscribed ?
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
                                                    <AlertDialogTitle>Unsubscribe {video.owner.fullName}?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently remove you from {video.owner.fullName}'s subscribers list.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction className="text-red-600 bg-transparent shadow-none hover:bg-accent border border-input" onClick={() => toggleSubscribe(video.owner._id)}>Unsubscribe</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog> :
                                        <Button
                                            className="gap-0 py-0 px-0 xs:py-2 xs:px-4 group flex w-auto items-center hover:bg-[#b689ff] bg-[#ae7aff] text-center text-primary" onClick={() => toggleSubscribe(video.owner._id)}>
                                            <span className="hidden xs:inline-block w-5">
                                                <UserRoundPlus />
                                            </span>
                                            <span className='w-20 text-xs xs:text-sm'>Subscribe</span>
                                        </Button>
                                    }

                                </div>
                            </div>
                            <hr className="my-4 border-primary" />
                            <div className={`relative`} role="button" tabIndex="0" onClick={() => setFullDesc(!fullDesc)}>
                                <p className={`relative text-sm cursor-pointer break-words break-all whitespace-pre-wrap transition-all ${fullDesc ? "h-auto" : " line-clamp-3 "}`}>
                                    {video.description && <ParseContents content={video.description} />}
                                </p>

                                {/* <span className={`absolute bottom-0 right-0 p-2 bg-gradient-to-t from-background to-transparent w-full h-4 ${fullDesc && "hidden"}`}></span> */}

                                <div className={`${video.description && video?.tags && "mt-3"} ${fullDesc ? 'block' : 'hidden'}`}>
                                    {video?.tags && video.tags.map((tag, index) => ( <span key={index} className="inline-block px-2 py-1 bg-primary/20 text-primary text-xs rounded-md mr-2">{tag}</span>))}
                                </div>
                            </div>
                        </div>
                        < Comments parentContentId={videoId} toggleSubscribe={toggleSubscribe} allComment={allComment} setAllComment={setAllComment} />
                    </div>
                </div>
            </section>
        </>
    )



}

export default Video
