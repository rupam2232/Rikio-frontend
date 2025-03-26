import { useState, useEffect } from 'react'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'
import setAvatar from '../utils/setAvatar.js'
import { LoaderCircle, PencilLine } from 'lucide-react'
import { timeAgo } from '../utils/timeAgo.js'
import { useSelector } from 'react-redux'
import { Button, ParseContents } from './index.js'

const ChannelTweets = ({ channelData }) => {
    const [tweetInput, setTweetInput] = useState("")
    const [tweets, setTweets] = useState(null)
    const [loader, setLoader] = useState(true)
    const [error, setError] = useState(null)
    const isUserLoggedin = useSelector((state) => state.auth.status)

    useEffect(() => {
        setLoader(true)
        axios.get(`/tweet/${channelData._id}`)
            .then((res) => {
                console.log(res.data.data)
                setTweets(res.data.data)
            })
            .catch((err) => {
                console.error(errorMessage(err))
                setError(errorMessage(err))
            })
            .finally(() => {
                setLoader(false)
            })
    }, [])

    if (loader) {
        return <div className='w-full h-[80vh] flex justify-center items-center'>
            <LoaderCircle className="w-16 h-16 animate-spin" />
        </div>
    }

    if (tweets?.length === 0) {
        return (
            <div className='h-[80vh] flex items-center justify-center flex-col'>
                <div className='mb-2 px-2 py-2 w-auto  text-[#AE7AFF] bg-[#E4D3FF] rounded-full'>
                    <PencilLine className='size-7' />
                </div>
                <h3 className='font-bold mb-2'>No tweet available</h3>
                <p>There are no tweet posted on this channel.</p>
            </div>
        )
    }
    console.log(channelData)
    return (
        <div className='p-2 mt-2 mb-5'>
            {(channelData.isChannelOwner && isUserLoggedin) && <div className='mb-6'>
                <textarea rows="4" placeholder='Write a tweet' value={tweetInput} maxLength="400" onChange={(e)=> setTweetInput(e.target.value)} className='w-full bg-transparent border-zinc-500 border rounded-md resize-none p-3' />
                    <p>{tweetInput.length}/400</p>
                <Button className='mt-2'>Tweet</Button>
            </div>}
            {tweets.length > 0 && tweets.map((tweet) => {
                return (
                    <div key={tweet._id} className='p-2 mb-2 rounded-md shadow-md'>
                        <div className='flex items-center gap-3'>
                            <div className='flex items-center'>
                                <img src={setAvatar(channelData.avatar)} alt={`@${channelData.username}`} className='w-10 h-10 rounded-full' />
                                <div className='ml-2'>
                                    <h3 className='font-bold'>{channelData.username}</h3>
                                    <p className='text-xs'>{channelData.fullname}</p>
                                </div>
                            </div>
                            <p className='text-xs'>{timeAgo(tweet.createdAt)}</p>
                        </div>
                        <div className='mt-2'>
                            <p><ParseContents content={tweet.content.textContent} /></p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ChannelTweets
