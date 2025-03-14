import { useState, useEffect } from 'react'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'
import formatNumbers from '../utils/formatNumber.js'
import setAvatar from '../utils/setAvatar.js'
import { useNavigate } from 'react-router-dom'
import { LoaderCircle, BadgeCheck, UserRoundPlus, UserRoundCheck } from 'lucide-react';
import { AvatarImage, Avatar } from '@/components/ui/avatar.jsx'
import { AccountHover, Button } from '../components/index.js'
import toast from 'react-hot-toast'
import { logout } from '../store/authSlice.js'
import { useDispatch } from 'react-redux'
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

const Subscribed = () => {
    const [subscribedChannels, setSubscribedChannels] = useState(null)
    const [loader, setLoader] = useState(true)
    const [error, setError] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch()

    useEffect(() => {
        setLoader(true)
        setError(false)
        axios.get('/subscription')
            .then((res) => {
                let subscribed = res.data.data.subscribed.map((sub) => {
                    return {
                        ...sub,
                        isSubscribed: true
                    }
                })
                setSubscribedChannels({ ...res.data.data, subscribed })
            })
            .catch((error) => {
                console.error(errorMessage(error))
                setError(true)
            })
            .finally(() => setLoader(false))
    }, [])

    const toggleSubscribe = (channelId) => {
        axios.post(`/subscription/c/${channelId}`)
            .then((value) => {
                if (value.data.message.toLowerCase() === "unsubscribed") {
                    let subscribed = subscribedChannels.subscribed.map((sub) => {
                        if (sub._id === channelId) {
                            return {
                                ...sub,
                                subscribers: sub.subscribers - 1,
                                isSubscribed: false
                            }
                        } else {
                            return {
                                ...sub
                            }
                        }
                    })
                    setSubscribedChannels({ ...subscribedChannels, subscribed })
                } else if (value.data.message.toLowerCase() === "subscribed") {
                    let subscribed = subscribedChannels.subscribed.map((sub) => {
                        if (sub._id === channelId) {
                            return {
                                ...sub,
                                subscribers: sub.subscribers + 1,
                                isSubscribed: true
                            }
                        } else {
                            return {
                                ...sub
                            }
                        }
                    })
                    setSubscribedChannels({ ...subscribedChannels, subscribed })

                } else {
                    setSubscribedChannels(subscribedChannels)
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
                toast.error(errorMessage(error), {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
                console.error(errorMessage(error));
            })
    }

    if (loader) {
        return (<div className='w-full h-full flex justify-center items-center'>
            <LoaderCircle className="w-16 h-16 animate-spin" />
        </div>)
    }

    if (error) {
        return (
            <section className='h-[80vh] flex items-center justify-center flex-col p-2 sm:p-0'>
                <p className='text-center'>Something went wrong. Please refresh the page and try again.</p>
            </section>
        )
    }

    if (subscribedChannels && subscribedChannels.subscribed.length === 0) {
        return (
            <section className='h-[80vh] flex items-center justify-center flex-col'>
                <div className='mb-2 px-2 py-2 w-auto  text-[#AE7AFF] bg-[#E4D3FF] rounded-full'>
                    <UserRoundCheck className='size-7' />
                </div>
                <h3 className='font-bold mb-2'>No subscribed channels</h3>
                <p>You haven't subscribed to any channel</p>
            </section>
        )
    }

    return (
        <section className="w-full p-4 pt-0 mb-10">
            <div className="w-full mt-4 px-4">
                <h1 className="font-medium text-2xl flex items-center gap-2"><span><UserRoundCheck className='size-4'/></span>Subscribed Channels</h1>
                <p className='text-sm text-primary/80'>Channels you have subscribed.</p>
            </div>
            <hr className="my-4 border-primary" />
            <div className=' flex flex-col gap-8 flex-wrap lg:px-14'>
                {subscribedChannels && subscribedChannels.subscribed.map((channel) => (
                    <div className='w-full flex justify-between items-center' key={channel._id}>
                        <AccountHover user={channel} toggleSubscribe={toggleSubscribe}>
                            <div className="flex flex-row items-center gap-x-4 cursor-pointer" onClick={() => navigate(`/@${channel.username}`)}>
                                <Avatar className='h-12 w-12'>
                                    <AvatarImage src={setAvatar(channel.avatar)} alt={`@${channel.username}`} className="object-cover" />
                                </Avatar>
                                <div className="block">
                                    <div className="font-bold relative flex">
                                        <p className='break-words break-all whitespace-pre-wrap min-w-0 max-w-[8rem] sm:max-w-[10rem] md:max-w-[15rem] lg:max-w-[20rem] line-clamp-1'>{channel.fullName}</p>
                                        {channel.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                            <BadgeCheck title="verified" className='w-5 h-5 fill-blue-600 text-background inline-block ' />
                                        </span>}</div>
                                    <p className="text-sm text-sidebar-foreground/95">{formatNumbers(channel.subscribers)} Subscribers</p>
                                </div>
                            </div>
                        </AccountHover>
                        {channel.isSubscribed ?
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
                                        <AlertDialogTitle>Unsubscribe {channel.fullName}?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently remove you from {channel.fullName}'s subscribers list.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction className="text-red-600 bg-transparent shadow-none hover:bg-accent border border-input" onClick={() => toggleSubscribe(channel._id)}>Unsubscribe</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog> :
                            <Button className="gap-0 py-2 px-4 group flex w-auto items-center hover:bg-[#b689ff] bg-[#ae7aff] text-center text-primary" onClick={() => toggleSubscribe(channel._id)}>
                                <span className="hidden xs:inline-block w-5">
                                    <UserRoundPlus />
                                </span>
                                <span className='w-20 text-xs xs:text-sm'>Subscribe</span>
                            </Button>
                        }
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Subscribed
