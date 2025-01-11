import React from 'react'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { NavLink } from 'react-router-dom'
import { BadgeCheck, Calendar} from 'lucide-react'
import { AvatarImage, Avatar } from '@/components/ui/avatar.jsx'
import formatNumbers from '../utils/formatNumber.js'
import joinedAt from '../utils/joinedAt.js'
import setAvatar from '../utils/setAvatar.js'
import { Button } from './index.js'

const AccountHover = ({user, toggleSubscribe, children}) => {
    return (
        <HoverCard>
            <HoverCardTrigger className='w-max inline-block'>
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
                        {user.isSubscribed ? <Button onClick={() => toggleSubscribe(user._id)} data-subscribed="Subscribed" data-unsubscribe="Unsubscribe" className={`w-28 hover:bg-[#b689ff] bg-[#ae7aff] transition-colors text-primary hover:text-red-600 hover:after:content-[attr(data-unsubscribe)] after:content-[attr(data-subscribed)]`} /> : <Button onClick={() => toggleSubscribe(user._id)} className='w-28 hover:bg-[#b689ff] bg-[#ae7aff] text-primary'>Subscribe</Button>}
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
