import React from 'react'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { NavLink } from 'react-router-dom'
import { BadgeCheck, Calendar } from 'lucide-react'
import { AvatarImage, Avatar } from '@/components/ui/avatar.jsx'
import formatNumbers from '../utils/formatNumber.js'
import joinedAt from '../utils/joinedAt.js'
import setAvatar from '../utils/setAvatar.js'
import { Button } from './index.js'
import { useSelector } from 'react-redux'
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

const AccountHover = ({ user, toggleSubscribe, children,className="" }) => {
  const loggedInUser = useSelector((state) => state.auth.userData);
    return (
        <HoverCard>
            <HoverCardTrigger className={`w-max h-max inline-block ${className}`}>
                {children}
            </HoverCardTrigger>
            <HoverCardContent>
                <div className='w-full flex flex-col gap-x-2 cursor-auto'>
                    <div className="w-full flex justify-between items-center">
                        <NavLink className="w-min" to={`/@${user.username}`}>
                            <Avatar className='h-12 w-12'>
                                <AvatarImage src={setAvatar(user.avatar)}
                                    alt={`@${user.username}`} className="object-cover" />
                            </Avatar>
                        </NavLink>

                        {loggedInUser && user.isSubscribed ?
                            <AlertDialog>
                                <AlertDialogTrigger className="py-0 px-0 w-max hover:bg-accent rounded-sm transition-colors ">
                                    <div role='button' data-subscribed="Subscribed" data-unsubscribe="Unsubscribe" className="gap-0 w-28 rounded-md py-2 px-4 group flex items-center hover:bg-[#b689ff] bg-[#ae7aff] text-center text-primary justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:after:content-[attr(data-unsubscribe)] after:content-[attr(data-subscribed)] hover:text-red-600" />
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Unsubscribe {user.fullName}?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently remove you from {user.fullName}'s subscribers list.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction className="text-red-600 bg-transparent shadow-none hover:bg-accent border border-input" onClick={() => toggleSubscribe(user._id)}>Unsubscribe</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            : <Button onClick={() => toggleSubscribe(user._id)} className='w-28 hover:bg-[#b689ff] bg-[#ae7aff] text-primary'>Subscribe</Button>}
                    </div>
                    <div>
                        <h3 className='font-bold'>
                            <NavLink className="hover:underline" to={`/@${user.username}`}>{user.fullName}</NavLink> {user.verified &&
                                <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                    <BadgeCheck title="verified" className='w-5 h-5 fill-blue-600 text-background inline-block ' />
                                </span>
                            }</h3>
                        <p className='text-sm'>
                            <NavLink to={`/@${user.username}`}>
                                {`@${user.username}`}
                            </NavLink>
                        </p>
                        <p className='text-sm mt-2 line-clamp-3 whitespace-normal'>{user?.bio}</p>
                        <p className='text-sidebar-foreground/70 text-sm mt-2'>
                            <span className='text-primary font-bold mr-3'>
                                {`${formatNumbers(user.subscribers)}`}
                            </span>
                            Subscribers
                        </p>
                        <p className='text-sm mt-2'>
                            <Calendar className='w-4 h-4 mr-3 inline-block ' />
                            <span className='text-sidebar-foreground/70'>Joined {joinedAt(user.createdAt)} </span>
                        </p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default AccountHover
