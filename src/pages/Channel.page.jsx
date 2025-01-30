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
import { Button } from '../components/index.js'
import { BadgeCheck, UserRoundCheck, UserRoundPlus, LoaderCircle } from 'lucide-react'

const Channel = ({ username }) => {
    const [channelData, setChannelData] = useState(null)
    const [isSubscribed, setIsSubscribed] = useState(null)
    const [loader, setLoader] = useState(true)
    const [error, setError] = useState(null)
    const loggedInUser = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch()

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

    if (loader) return <h1>Loading...</h1>
    if (error) return (
        <NotFound>
            <p className='px-3 text-center'>{error}</p>
        </NotFound>
    )
    console.log(channelData)
    // return (
    //     <section className='w-full'>
    //         <div className='flex items-center justify-between px-4 py-2'>
    //             <div className='flex items-center'>
    //                 <div className='w-16 h-16 rounded-full bg-gray-300'></div>
    //                 <div className='ml-4'>
    //                     <h2 className='text-lg font-bold'>{channelData?.username}</h2>
    //                     <p className='text-sm text-gray-500'>{channelData?.subscribers} subscribers</p>
    //                 </div>
    //             </div>
    //             <div>
    //                 <button className='px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded'>Subscribe</button>
    //             </div>
    //         </div>
    //         <div className='flex items-center justify-between px-4 py-2'>
    //             {/* <div>
    //                 <NavLink to={`/@${channelData?.username}`} style={isActive =>({
    //                     color: isActive && "rgb(239 68 68 / 1)",
    //                     fontWeight: isActive && "600"
    //                 })} >Home</NavLink>
    //                 <NavLink to={`/@${channelData?.username}/videos`} className={`font-semibold text-red-500`}>Videos</NavLink>
    //                 <NavLink to={`/@${channelData?.username}/playlists`} activeClassName='font-semibold text-red-500'>Playlists</NavLink>
    //                 <NavLink to={`/@${channelData?.username}/channels`} activeClassName='font-semibold text-red-500'>Channels</NavLink>
    //                 <NavLink to={`/@${channelData?.username}/about`} activeClassName='font-semibold text-red-500'>About</NavLink>
    //             </div> */}
    //             <div>
    //                 <button className='px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded'>Subscribe</button>
    //             </div>
    //         </div>
    //     </section>
    // )

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
                <div className="flex flex-wrap gap-4 pb-4 pt-6 md:px-10">
                    <span className="relative mx-auto sm:mx-0 -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2">
                        <img src={setAvatar(channelData.avatar)} alt="Avatar" className="h-full object-cover w-full" />
                    </span>
                    <div className="mr-auto inline-block">
                        <h1 className="font-bold text-2xl">{channelData.fullName}{channelData.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                            <BadgeCheck title="verified" className='w-5 h-5 fill-blue-600 text-background inline-block ' />
                        </span>}</h1>
                        <p className="text-sm ">@{channelData.username}</p>
                        <p className="text-sm mt-1"><span className='font-bold mr-2'>{formatNumbers(channelData.subscribersCount)}</span>Subscribers</p>
                    </div>
                    <div className="inline-block">
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
                <ul className="no-scrollbar sticky top-14 z-[2] flex flex-row gap-x-0 md:gap-x-2 overflow-auto border-b-2 border-zinc-500 bg-background py-2">
                    <li className="w-full">
                        <button className="w-full border-b-2 border-transparent px-3 py-1.5">Videos</button>
                    </li>
                    <li className="w-full">
                        <button className="w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]">Playlist</button>
                    </li>
                    <li className="w-full">
                        <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Tweets</button>
                    </li>
                    <li className="w-full">
                        <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Subscribed</button>
                    </li>
                </ul>
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 pt-2">
                    <div className="w-full">
                        <div className="relative mb-2 w-full pt-[56%]">
                            <div className="absolute inset-0">
                                <img src="https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1260&amp;h=750&amp;dpr=1" alt="JavaScript Fundamentals: Variables and Data Types" className="h-full w-full" />
                            </div>
                            <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">20:45</span>
                        </div>
                        <h6 className="mb-1 font-semibold">JavaScript Fundamentals: Variables and Data Types</h6>
                        <p className="flex text-sm text-gray-200">10.3k&nbsp;Views · 44 minutes ago</p>
                    </div>
                    <div className="w-full">
                        <div className="relative mb-2 w-full pt-[56%]">
                            <div className="absolute inset-0">
                                <img src="https://images.pexels.com/photos/2519817/pexels-photo-2519817.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1260&amp;h=750&amp;dpr=1" alt="Getting Started with Express.js" className="h-full w-full" />
                            </div>
                            <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">22:18</span>
                        </div>
                        <h6 className="mb-1 font-semibold">Getting Started with Express.js</h6>
                        <p className="flex text-sm text-gray-200">11.k&nbsp;Views · 5 hours ago</p>
                    </div>
                    <div className="w-full">
                        <div className="relative mb-2 w-full pt-[56%]">
                            <div className="absolute inset-0">
                                <img src="https://images.pexels.com/photos/1739849/pexels-photo-1739849.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1260&amp;h=750&amp;dpr=1" alt="Building a RESTful API with Node.js and Express" className="h-full w-full" />
                            </div>
                            <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">24:33</span>
                        </div>
                        <h6 className="mb-1 font-semibold">Building a RESTful API with Node.js and Express</h6>
                        <p className="flex text-sm text-gray-200">14.5k&nbsp;Views · 7 hours ago</p>
                    </div>
                    <div className="w-full">
                        <div className="relative mb-2 w-full pt-[56%]"><div className="absolute inset-0">
                            <img src="https://images.pexels.com/photos/1739854/pexels-photo-1739854.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1260&amp;h=750&amp;dpr=1" alt="Introduction to React Native" className="h-full w-full" />
                        </div>
                            <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">19:58</span>
                        </div>
                        <h6 className="mb-1 font-semibold">Introduction to React Native</h6>
                        <p className="flex text-sm text-gray-200">10.9k&nbsp;Views · 8 hours ago</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Channel
