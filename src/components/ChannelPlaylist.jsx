import { useEffect, useState } from 'react'
import axios from '../utils/axiosInstance.js';
import errorMessage from '../utils/errorMessage.js';
import formatNumbers from '../utils/formatNumber.js'
import { FolderClosed } from 'lucide-react';

const ChannelPlaylist = ({ userId, isChannelOwner }) => {
    const [playlist, setPlaylist] = useState(null);
    const [error, setError] = useState(false);
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        setLoader(true);
        setError(false)
        axios.get(`/playlist/channel/${userId}`)
            .then((res) => {
                setPlaylist(res.data.data)
            })
            .catch((error) => {
                console.error(errorMessage(error))
                setError(true)
            })
            .finally(() => setLoader(true))
    }, [userId])
    console.log(playlist?.length)

    if (error) {
        return (
            <div className='h-[80vh] flex items-center justify-center flex-col'>
               <p>Something went wrong. Please refresh the page and try again.</p>
            </div>
        )
    }
    if (playlist?.length === 0) {
        return (
            <div className='h-[80vh] flex items-center justify-center flex-col'>
                <FolderClosed className='mb-2 px-2 py-2 w-auto size-10 text-[#AE7AFF] bg-[#E4D3FF] rounded-full'/>
                <h3 className='font-bold mb-2'>No playlist created</h3>
                <p>There are no playlist created on this channel.</p>
            </div>
        )
    }
    return (
        <div>
            
        </div>
    )
}

export default ChannelPlaylist
