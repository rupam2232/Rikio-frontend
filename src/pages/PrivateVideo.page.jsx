import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { timeAgo } from '../utils/timeAgo'
import { Like, Button, AccountHover, Comments, ParseContents, Video as VideoPlayer } from "../components/index.js"
import { useNavigate } from 'react-router-dom'
import formatNumbers from '../utils/formatNumber.js'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'
import setAvatar from '../utils/setAvatar.js'
import toast from "react-hot-toast"
import NotFound from './NotFound.page.jsx'
import { BadgeCheck, UserRoundCheck, UserRoundPlus, LoaderCircle, X } from 'lucide-react'
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

const PrivateVideo = () => {
    const [fullDesc, setFullDesc] = useState(false)
    const [video, setVideo] = useState({})
    const [like, setLike] = useState({})
    const [sub, setSub] = useState(0)
    const [allComment, setAllComment] = useState({})
    const [subscribed, setSubscribed] = useState(false)
    const [loader, setLoader] = useState(true)
    const [error, setError] = useState("")
    const [openPopup, setOpenPopup] = useState(true)
    const [isDescOverflowing, setIsDescOverflowing] = useState(false);
    const { videoId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const loggedInUser = useSelector((state) => state.auth.userData);
    const descriptionRef = useRef(null);

    const toggleSubscribe = (ownerId) => {
        if (!loggedInUser) {
            toast.error("You need to login first", {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            navigate("/login")
            return;
        }

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
                } else {
                    toast.error(errorMessage(error), {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                }
                console.error(errorMessage(error));
            })
    }

    useEffect(() => {
        if (descriptionRef.current) {
            const lineHeight = parseFloat(getComputedStyle(descriptionRef.current).lineHeight);
            const maxHeight = lineHeight * 3;
            setIsDescOverflowing(descriptionRef.current.scrollHeight > maxHeight);
        }
    }, [video?.description, fullDesc]);

    useEffect(() => {
        setError("")
        axios.get(`/videos/private/${videoId}`)
            .then((value) => {
                setVideo(value.data.data.video);
                setLike(value.data.data.likes);

                axios.get(`/subscription/u/${value.data.data.video.owner._id}`)
                    .then((value) => {
                        setSub(value.data.data.subscribers.length);
                    })
                    .catch((error) => {
                        console.error(errorMessage(error));
                    });

                axios.get(`/subscription/i/${value.data.data.video.owner._id}`)
                    .then((value) => {
                        setSubscribed(value.data.data);
                    })
                    .catch((error) => {
                        console.error(errorMessage(error));
                    });
            })
            .catch((error) => {
                setError(errorMessage(error))
            })
            .finally(() => setLoader(false));
    }, [videoId])

    if (loader) {
        return (<section className='w-full h-full flex justify-center items-center'>
            <LoaderCircle className="w-16 h-16 animate-spin" />
        </section>)
    }

    if (error) {
        return (<NotFound><p className='text-center'>{error}</p></NotFound>)
    }

    return (
        <>
            <section className="w-full">
                {openPopup && <div className='fixed z-[50] inset-0 flex items-center justify-center bg-black bg-opacity-70 overflow-y-auto no-scrollbar max-h-screen'>
                    
                    <div className="w-full mx-3 sm:mx-0 sm:w-1/2 lg:w-1/3 max-h-screen bg-background p-6  rounded ring-1 ring-primary/30 overflow-y-auto no-scrollbar">
                        <div className="flex items-center justify-between">
                            <h2 className="text-md font-bold text-xl text-center flex-1">⚠️This video is private</h2>
                            <button title='close' onClick={() => setOpenPopup(false)}><X /></button>
                        </div>
                        <hr className="my-2 border-primary/40" />
                        <div>
                            <p className='text-primary/90'>what it means ?</p>
                            <ul className='text-sm text-primary/70 list-disc list-outside ml-6'>
                                <li>Only you can see this video.</li>
                                <li>You cannot like or unlike this video.</li>
                                <li>You cannot update, delete or post a new comment.</li>
                                <li>The views count will not increase</li>
                            </ul>
                        </div>
                    </div>
                </div>}
                <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
                    <div className="col-span-12 w-full">
                        <div className="mb-4 w-full flex justify-center items-center rounded-lg border border-primary/30">
                            <div className="aspect-video w-full lg:w-3/4 2xl:w-2/4 h-full rounded-lg">
                                <VideoPlayer
                                    autoplay={false}
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
                                                className="flex items-center border font-medium  border-primary/50 shadow-none gap-x-2 bg-border text-primary hover:bg-primary/20 after:content-[attr(data-like)] xs:[&_svg]:size-5 [&_svg]:size-4 text-sm xs:text-base"
                                                data-like={formatNumbers(like.totalLikes)}>
                                                <span className="inline-block">
                                                    {like.isLiked ? <Like className='fill-[#ae7aff] text-border' /> : <Like className='fill-transparent' />}
                                                </span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 w-full flex justify-between items-center">
                                <AccountHover user={{ ...video.owner, isSubscribed: subscribed, subscribers: sub }} toggleSubscribe={toggleSubscribe}>
                                    <div className="flex flex-row items-center gap-x-4 cursor-pointer" onClick={() => navigate(`/@${video.owner.username}`)}>
                                        <Avatar className='h-12 w-12'>
                                            <AvatarImage src={setAvatar(video.owner.avatar)} alt={`@${video.owner.username}`} className="object-cover" />
                                        </Avatar>
                                        <div className="block">
                                            <div className="font-bold relative flex">
                                                <p className="break-words break-all whitespace-pre-wrap min-w-0 max-w-[8rem] sm:max-w-[10rem] md:max-w-[15rem] lg:max-w-[20rem] line-clamp-1">{video.owner.fullName}</p>
                                                {video.owner.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                                    <BadgeCheck className='w-5 h-5 fill-blue-600 text-background inline-block ' />
                                                </span>}
                                            </div>
                                            <p className="text-sm text-sidebar-foreground/95">{formatNumbers(sub)} Subscribers</p>
                                        </div>
                                    </div>
                                </AccountHover>
                                <div className="block">

                                    {loggedInUser && subscribed ?
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
                                            className="gap-0 py-2 px-4 group flex w-auto items-center hover:bg-[#b689ff] bg-[#ae7aff] text-center text-primary" onClick={() => toggleSubscribe(video.owner._id)}>
                                            <span className="hidden xs:inline-block w-5">
                                                <UserRoundPlus />
                                            </span>
                                            <span className='w-20 text-xs xs:text-sm'>Subscribe</span>
                                        </Button>
                                    }
                                </div>
                            </div>
                            <hr className="my-4 border-primary" />

                            <div ref={descriptionRef} className={`w-full relative cursor-pointer text-sm break-words break-all whitespace-pre-wrap transition-all ${isDescOverflowing && fullDesc ? "h-full" : "line-clamp-3"}`} onClick={() => setFullDesc(!fullDesc)}>
                                {video.description && <p className='relative'>{<ParseContents content={video.description} />}</p>}
                                <div className={`block ${video.description && "pt-4"}`}>
                                    {video?.tags && video.tags.map((tag, index) => (<span key={index} className="inline-block px-2 py-1 bg-primary/20 text-primary text-xs rounded-md mr-2">{tag}</span>))}
                                </div>
                                {isDescOverflowing && <span className={`font-bold block bottom-0 right-0 ${fullDesc ? "pt-4" : "absolute w-full bg-background"}`}>{fullDesc ? "Show Less" : "...more"}</span>}
                            </div>

                            <div className={`relative`} role="button" tabIndex="0" onClick={() => setFullDesc(!fullDesc)}>
                            </div>
                        </div>
                        < Comments parentContentId={videoId} toggleSubscribe={toggleSubscribe} allComment={allComment} setAllComment={setAllComment} commentType="v" isVideoPublic={false} />
                    </div>
                </div>
            </section>
        </>
    )



}

export default PrivateVideo
