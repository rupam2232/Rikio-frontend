import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import axios from '../utils/axiosInstance.js'
import NotFound from './NotFound.page.jsx'
import errorMessage from '../utils/errorMessage.js'
import setAvatar from '../utils/setAvatar.js'
import formatNumbers from '../utils/formatNumber.js'
import toast from "react-hot-toast"
import { useSelector, useDispatch } from 'react-redux'
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
import { Button, ChannelAbout, ChannelPlaylist, ChannelVideo } from '../components/index.js'
import { BadgeCheck, UserRoundCheck, UserRoundPlus, LoaderCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Channel = ({ username, pageName }) => {
    const [channelData, setChannelData] = useState(null)
    const [isSubscribed, setIsSubscribed] = useState(null)
    const [loader, setLoader] = useState(true)
    const [error, setError] = useState(null)
    const loggedInUser = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {

        const fetchChannelData = async () => {
            setLoader(true)
            setError(null)
            try {
                const response = await axios.get(`/users/c/${username}`)
                setChannelData(response.data.data)
                setIsSubscribed(response.data.data.isSubscribed)
            } catch (error) {
                setError(errorMessage(error))
                console.error(errorMessage(error))
            } finally {
                setLoader(false)
            }
        }
        fetchChannelData()
        
    }, [username])

    const toggleSubscribe = (ownerId) => {
        axios.post(`/subscription/c/${ownerId}`)
            .then((value) => {
                if (value.data.message.toLowerCase() === "subscribed") {
                    setIsSubscribed(true)
                    axios.get(`/subscription/u/${ownerId}`)
                        .then((value) => {
                            setChannelData({ ...channelData, subscribersCount: value.data.data.subscribers.length });
                        })
                        .catch((error) => {
                            console.error(error.message);
                        });
                } else if (value.data.message.toLowerCase() === "unsubscribed") {
                    setIsSubscribed(false)
                    axios.get(`/subscription/u/${ownerId}`)
                        .then((value) => {
                            setChannelData({ ...channelData, subscribersCount: value.data.data.subscribers.length });
                        })
                        .catch((error) => {
                            console.error(error.message);
                        });
                } else {
                    setChannelData(channelData)
                    setIsSubscribed(isSubscribed)
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
                setChannelData(channelData)
            })
    }

    if (loader) return (
        <div className='w-full h-full flex justify-center items-center'>
            <LoaderCircle className="w-16 h-16 animate-spin" />
        </div>
    )
    if (error) return (
        <NotFound>
            <p className='px-3 text-center'>{error}</p>
        </NotFound>
    )

    return (
        <section className="w-full">
            <div className="relative min-h-[150px] w-full pt-[16.28%]">
                <div className="absolute inset-0 overflow-hidden">
                    {channelData.coverImage ?
                        <img src={channelData.coverImage} className='object-cover' alt="cover-photo" />
                        :
                        <div className='w-full h-full bg-gray-400'>
                        </div>}
                </div>
            </div>
            <div className="px-4 pb-4">
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 pb-4 pt-6 md:px-10">
                    <span className="relative mx-auto sm:mx-0 -mt-24 sm:-mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2">
                        <img src={setAvatar(channelData.avatar)} alt={`@${channelData.username}`} className="h-full object-cover w-full" />
                    </span>
                    <div className='flex items-center justify-between flex-1'>
                        <div className="sm:mr-auto sm:inline-block">
                            <h1 className="font-bold text-2xl">{channelData.fullName}{channelData.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                <BadgeCheck title="verified" className='w-5 h-5 fill-blue-600 text-background inline-block ' />
                            </span>}</h1>
                            <p className="text-sm ">@{channelData.username}</p>
                            <p className="text-sm mt-1"><span className='font-bold mr-2'>{formatNumbers(channelData.subscribersCount)}</span>Subscribers</p>
                        </div>
                        <div className="sm:inline-block">
                            <div className="inline-flex min-w-[145px] justify-end">
                                {loggedInUser && isSubscribed ?
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
                                                <AlertDialogTitle>Unsubscribe {channelData.fullName}?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently remove you from {channelData.fullName}'s subscribers list.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction className="text-red-600 bg-transparent shadow-none hover:bg-accent border border-input" onClick={() => toggleSubscribe(channelData._id)}>Unsubscribe</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog> :
                                    <Button
                                        className="gap-0 py-0 px-0 xs:py-2 xs:px-4 group flex w-auto items-center hover:bg-[#b689ff] bg-[#ae7aff] text-center text-primary" onClick={() => toggleSubscribe(channelData._id)}>
                                        <span className="hidden xs:inline-block w-5">
                                            <UserRoundPlus />
                                        </span>
                                        <span className='w-20 text-xs xs:text-sm'>Subscribe</span>
                                    </Button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <ul className="no-scrollbar overflow-x-scroll sticky top-16 sm:top-20 md:top-14 z-[30] flex flex-row gap-x-0 md:gap-x-2 border-b border-zinc-500 bg-background py-2 backdrop-blur-[12px] supports-[backdrop-filter]:bg-background/70">
                    <li className="w-full">
                        <NavLink to={`/@${channelData.username}/videos`} className={`${!pageName && "active"} w-full rounded-sm block text-center border-b-2 border-transparent px-3 py-1.5`}>Videos</NavLink>
                    </li>
                    <li className="w-full">
                        <NavLink to={`/@${channelData.username}/playlist`} className="w-full rounded-sm block text-center border-b-2 border-transparent px-3 py-1.5">Playlist</NavLink>
                    </li>
                    <li className="w-full">
                        <NavLink to={`/@${channelData.username}/tweets`} className="w-full rounded-sm block text-center border-b-2 border-transparent px-3 py-1.5">Tweets</NavLink>
                    </li>
                    <li className="w-full">
                        <NavLink to={`/@${channelData.username}/about`} className="w-full rounded-sm block text-center border-b-2 border-transparent px-3 py-1.5">About</NavLink>
                    </li>
                </ul>

                {
                    (pageName === 'videos' || !pageName) &&(
                        <ChannelVideo username={username} isChannelOwner={channelData.isChannelOwner}/>
                    )
                }

                {
                    (pageName === 'playlist' ) &&(
                        <ChannelPlaylist userId={channelData._id} username={username} isChannelOwner={channelData.isChannelOwner}/>
                    )
                }

                {
                    (pageName === "about") && (
                        <ChannelAbout channelData={channelData} />
                    )
                }
            </div>
        </section>
    )
}

export default Channel
