import { useEffect, useState, useRef } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import axios from '../utils/axiosInstance.js'
import toast from 'react-hot-toast'
import errorMessage from '../utils/errorMessage.js'
import NotFound from './NotFound.page.jsx'
import { BadgeCheck, EditIcon, LoaderCircle, Trash2 } from 'lucide-react'
import { Button, Like, ParseContents, AccountHover, Comments } from '../components/index.js'
import formatNumbers from '../utils/formatNumber.js'
import setAvatar from '../utils/setAvatar.js'
import { timeAgo } from '../utils/timeAgo.js'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice.js'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useIsMobile } from '@/hooks/use-mobile.jsx'

const Tweet = () => {
    const { tweetId } = useParams()
    const [loader, setLoader] = useState(true)
    const [optionLoader, setOptionLoader] = useState(false)
    const [tweet, setTweet] = useState(null)
    const [allComment, setAllComment] = useState({})
    const [error, setError] = useState("")
    const isUserLoggedin = useSelector((state) => state.auth.status)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isMobile = useIsMobile()

    useEffect(() => {
        setLoader(true)
        axios.get(`/tweet/t/${tweetId}`)
            .then((res) => {
                setTweet(res.data.data)
            })
            .catch((err) => {
                console.error(errorMessage(err))
                setError(errorMessage(err))
            })
            .finally(() => {
                setLoader(false)
            })
    }, [tweetId])

    const toggleSubscribe = (ownerId) => {
        if (!isUserLoggedin) {
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
                    if (ownerId === tweet.ownerDetails._id) {
                        setTweet({
                            ...tweet, ownerDetails: {
                                ...tweet.ownerDetails,
                                isSubscribed: true,
                                subscribers: tweet.ownerDetails.subscribers + 1
                            }
                        })
                    }
                    let commentData = [...allComment.comments]
                    let updatedComment = commentData.map((coment) => {
                        if (coment.ownerInfo._id === ownerId) {
                            coment.isSubscribed = true
                            coment.subscribers = coment.subscribers + 1
                        }
                        return coment
                    })
                    setAllComment({ ...allComment, comments: updatedComment })
                } else if (value.data.message.toLowerCase() === "unsubscribed") {
                    if (ownerId === tweet.ownerDetails._id) {
                        setTweet({
                            ...tweet, ownerDetails: {
                                ...tweet.ownerDetails,
                                isSubscribed: false,
                                subscribers: tweet.ownerDetails.subscribers - 1
                            }
                        })
                    }
                    let commentData = [...allComment.comments]
                    let updatedComment = commentData.map((coment) => {
                        if (coment.ownerInfo._id === ownerId) {
                            coment.isSubscribed = false
                            coment.subscribers = coment.subscribers - 1
                        }
                        return coment
                    })
                    setAllComment({ ...allComment, comments: updatedComment })
                } else {
                    setTweet(tweet)
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

    const toggleLike = (tweetId) => {
        if (!isUserLoggedin) {
            toast.error("You need to login first", {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            navigate("/login")
            return;
        }
        setTweet({ ...tweet, isLiked: !tweet.isLiked })
        axios.post(`/like/toggle/t/${tweetId}`)
            .then((res) => {
                if (res.data.data) {
                    setTweet({ ...tweet, isLiked: res.data.data, totalLikes: tweet.totalLikes + 1 })
                } else {
                    setTweet({ ...tweet, isLiked: res.data.data, totalLikes: tweet.totalLikes - 1 })
                }
            })
            .catch((err) => {
                console.error(errorMessage(err))
                if (err.status === 401) {
                    toast.error("You need to login first", {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                    dispatch(logout())
                    navigate("/login")
                } else {
                    toast.error(errorMessage(err), {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                }
            })
    }

    if (loader) {
        return (<section className='w-full h-full flex justify-center items-center'>
            <LoaderCircle className="w-16 h-16 animate-spin" />
        </section>)
    }

    if (error) {
        return (<NotFound><p className='text-center'>{error}</p></NotFound>)
    }

    return (
        <section className='p-4'>
            <div className='p-4 mb-2 rounded-md border border-primary/30'>
                <div className='flex justify-between'>
                    <div className='flex items-center'>
                        <AccountHover user={tweet.ownerDetails} toggleSubscribe={toggleSubscribe}>
                            <div className='flex items-center cursor-pointer' onClick={() => navigate(`/@${tweet.ownerDetails.username}`)}>
                                <img src={setAvatar(tweet.ownerDetails.avatar)} alt={`@${tweet.ownerDetails.username}`} className='w-10 h-10 rounded-full' />
                                <div className='ml-2 font-bold relative flex items-center'>
                                    <h3 className='break-words break-all whitespace-pre-wrap min-w-0 max-w-[8rem] sm:max-w-[10rem] md:max-w-[15rem] lg:max-w-[20rem] line-clamp-1'>{tweet.ownerDetails.fullName}</h3>
                                    {tweet.ownerDetails.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                        <BadgeCheck className='w-5 h-5 fill-blue-600 text-background inline-block ' />
                                    </span>}
                                </div>
                            </div>
                        </AccountHover>
                        <p className="text-xs flex items-center before:content-['•'] before:px-1">{timeAgo(tweet.createdAt)}</p>
                    </div>
                </div>
                <div className='py-2 block'>
                    {tweet.content.textContent && <p><ParseContents content={tweet.content.textContent} /></p>}
                </div>
                <div className='w-full'>
                    {tweet.content.image.length > 0 && <Carousel className="max-w-xs mx-auto md:ml-10">
                        <CarouselContent>
                            {tweet.content.image.map((img, index) => {
                                return (
                                    <CarouselItem key={index}>
                                        <div className='p-1 w-full h-full flex items-center justify-center border border-primary/30 rounded-md bg-card relative'>
                                            {tweet.content.image.length > 1 && <span className='absolute top-3 right-3 text-sm bg-primary/70 text-background px-2 rounded-md'>{`${index + 1}/${tweet.content.image.length}`}</span>}
                                            <img src={img} alt={index + 1} className='rounded-md w-full' />
                                        </div>
                                    </CarouselItem>
                                )
                            })}
                        </CarouselContent>
                        {(tweet.content.image.length > 1 && !isMobile) && <>
                            <CarouselPrevious />
                            <CarouselNext /> </>}
                    </Carousel>}
                </div>
                <div className='mt-4'>
                    <Button className="flex items-center border font-medium  border-primary/50 shadow-none gap-x-2 border-r bg-border text-primary hover:bg-primary/20 after:content-[attr(data-like)] xs:[&_svg]:size-5 [&_svg]:size-4 text-sm xs:text-base"
                        data-like={formatNumbers(tweet.totalLikes)} onClick={() => toggleLike(tweet._id)}>
                        <span className="inline-block">
                            {tweet.isLiked ? <Like className='fill-[#ae7aff] text-border' /> : <Like className='fill-transparent' />}
                        </span>
                    </Button>
                </div>
            </div>
            < Comments parentContentId={tweetId} toggleSubscribe={toggleSubscribe} allComment={allComment} setAllComment={setAllComment} commentType="t" />
        </section>
    )
}

export default Tweet
