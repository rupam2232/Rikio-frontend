import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'
import formatNumbers from '../utils/formatNumber.js'
import setAvatar from '../utils/setAvatar.js'
import { timeAgo } from '../utils/timeAgo.js'
import { videoDuration } from '../utils/videoDuration.js'
import { AccountHover } from '../components/index.js'
import { NavLink, useNavigate } from 'react-router-dom'
import { Play, LoaderCircle, LockKeyholeIcon, Earth } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice.js'
import toast from 'react-hot-toast'
import NotFound from './NotFound.page.jsx'

const PlaylistVideo = () => {
    const [playlistData, setPlaylistData] = useState(null)
    const [loader, setLoader] = useState(true)
    const [error, setError] = useState(null)
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    useEffect(() => {
        setLoader(true)
        setError(null)
        axios.get(`/playlist/${playlistId}`)
            .then((res) => {
                setPlaylistData(res.data.data)
            })
            .catch((error) => {
                console.log(errorMessage(error))
                setError(errorMessage(error))
            })
            .finally(() => setLoader(false))
    }, [playlistId])

    const toggleSubscribe = (userId) => {

        axios.post(`/subscription/c/${userId}`)
            .then((value) => {
                if (value.data.message.toLowerCase() === "subscribed") {
                    if (userId === playlistData.owner._id) {
                        let updatedPlayelistData = { ...playlistData.owner, isSubscribed: true, subscribersCount: playlistData.owner.subscribersCount + 1 }
                        console.log("updatedPlayelistData")
                        setPlaylistData(null)
                        console.log("updatedPlayelistData2")

                        // setPlaylistData({ ...playlistData, owner: { ...playlistData.owner, subscribersCount: playlistData.owner.subscribersCount + 1 } })
                    }

                    let videos = [...playlistData.videos]

                    let updatedVideo = videos.map((video) => {
                        if (video.owner._id === userId) {
                            video.owner.isSubscribed = true
                            video.owner.subscribersCount = video.owner.subscribersCount + 1
                        }
                        return video
                    })
                    setPlaylistData({ ...playlistData, videos: updatedVideo })
                } else if (value.data.message.toLowerCase() === "unsubscribed") {
                    if (userId === playlistData.owner._id) {
                        let updatedPlayelistData = { ...playlistData.owner, isSubscribed: false, subscribersCount: playlistData.owner.subscribersCount - 1 }
                        console.log(updatedPlayelistData)
                        setPlaylistData({ ...playlistData, owner: updatedPlayelistData })
                        // setPlaylistData({ ...playlistData, owner: { ...playlistData.owner, subscribersCount: playlistData.owner.subscribersCount - 1 } })
                    }

                    let videoData = [...playlistData.videos]

                    let updatedVideo = videoData.map((video) => {
                        if (video.owner._id === userId) {
                            video.owner.isSubscribed = false
                            video.owner.subscribersCount = video.owner.subscribersCount - 1
                        }
                        return video
                    })
                    setPlaylistData({ ...playlistData, videos: updatedVideo })
                } else {
                    setPlaylistData(playlistData)
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
                setPlaylistData(playlistData)
            })
    }

    console.log(playlistData)

    if (loader) return (
        <div className='w-full h-[80vh] flex justify-center items-center'>
            <LoaderCircle className="w-16 h-16 animate-spin" />
        </div>
    )

    if (error) {
        return (
            <NotFound>
                <p className='px-3 text-center'>{error.replaceAll("&#39;", "'")}</p>
            </NotFound>
        )
    }

    if (playlistData) return (
        <section className="w-full">
            <div className="flex flex-wrap gap-x-4 gap-y-10 p-4 xl:flex-nowrap">
                <div className="w-full shrink-0 sm:max-w-md xl:max-w-sm">
                    <div className="relative mb-2 w-full pt-[56%] group">
                        <div className="absolute inset-0">
                            {playlistData.videos.length > 0 ? <img src={playlistData.videos[0].thumbnail} alt={`${playlistData.playlistName} | by @${playlistData.owner.username}`} className="h-full w-full rounded-md" />
                                :
                                <div className='bg-gray-400 h-full w-full rounded-md flex items-center justify-center'> <Play className='group-hover:text-background' /> </div>}

                            <div className="absolute inset-x-0 bottom-0">
                                <div className="relative bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                                    <div className="relative z-[1]">
                                        <p className="flex justify-between">
                                            <span className="inline-block">Playlist</span>
                                            <span className="inline-block">{`${formatNumbers(playlistData.videos.length)} videos`}</span>
                                        </p>
                                        <p className="text-sm text-gray-200">{`${formatNumbers(playlistData.totalViews)} Views · ${timeAgo(playlistData.createdAt)}`}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <div>
                            <h6 className="mb-1 font-semibold">{playlistData.playlistName}</h6>
                            <p className="flex text-sm text-primary/60">{playlistData.description}</p>
                        </div>
                        {playlistData.isPlaylistOwner &&(playlistData.isPublic ? <span title="Public"><Earth className='size-4 sm:mr-2 cursor-pointer'/></span> : <span title="Private"><LockKeyholeIcon className='size-4 sm:mr-2 cursor-pointer'/></span>)}
                    </div>
                    <div className="mt-6 flex items-center gap-x-3">
                        <AccountHover user={{ ...playlistData.owner, subscribers: playlistData.owner.subscribersCount, isSubscribed: playlistData.owner.isSubscribed }} toggleSubscribe={toggleSubscribe}>
                            <div onClick={() => navigate(`/@${playlistData.owner.username}`)} className="h-16 w-16 shrink-0 cursor-pointer">
                                <img src={setAvatar(playlistData.owner.avatar)} alt={`@${playlistData.owner.username}`} className="h-full w-full rounded-full object-cover" />
                            </div>
                        </AccountHover>
                        <div className="w-full">
                            <AccountHover user={{ ...playlistData.owner, subscribers: playlistData.owner.subscribersCount, isSubscribed: playlistData.owner.isSubscribed }} toggleSubscribe={toggleSubscribe}>
                                <h6 className="font-semibold cursor-pointer w-max" onClick={() => navigate(`/@${playlistData.owner.username}`)}>{playlistData.owner.fullName}</h6>
                                <p className="text-sm text-primary/60 cursor-pointer w-max" onClick={() => navigate(`/@${playlistData.owner.username}`)}>{`${formatNumbers(playlistData.owner.subscribersCount)} Subscribers`}</p>
                            </AccountHover>
                        </div>
                    </div>
                </div>
                <div className="flex w-full flex-col gap-y-4">

                    {playlistData.videos.length > 0 ?
                        playlistData.videos.map((video) => {
                            return (
                                <div key={video._id} className="sm:border border-zinc-500 rounded-md">
                                    <div className="w-full max-w-3xl gap-x-4 sm:flex">
                                        <div className="relative mb-2 w-full sm:mb-0 sm:w-5/12">
                                            <div className="w-full pt-[56%]" aria-label='Thubmnail'>
                                                <NavLink to={`/video/${video._id}`} title={video.title} className="absolute inset-0">
                                                    <img src={video.thumbnail} alt={`${video.title} | uploaded by @${video.owner.username}`} className="h-full w-full object-cover rounded-md" />
                                                </NavLink>
                                                <span className="absolute bottom-1 right-1 inline-block rounded bg-black/100 text-white px-1.5 text-sm">{videoDuration(video.duration)}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-x-2 px-2 sm:w-7/12 sm:px-0">
                                            <AccountHover user={{ ...video.owner, subscribers: video.owner.subscribersCount, isSubscribed: video.owner.isSubscribed }} toggleSubscribe={toggleSubscribe}>
                                                <div onClick={() => navigate(`/@${video.owner.username}`)} className="h-10 w-10 shrink-0 sm:hidden cursor-pointer">
                                                    <img src={video.owner.avatar} alt={`@${video.owner.username}`} className="h-full w-full rounded-full object-cover" />
                                                </div>
                                            </AccountHover>
                                            <div className="w-full">
                                                <NavLink to={`/video/${video._id}`}>
                                                    <h6 className="mb-1 sm:mt-1 font-semibold sm:max-w-[75%]" title={video.title}>{video.title}</h6>
                                                    <p className="flex text-sm text-primary/90 sm:mt-3" title={`${formatNumbers(video.views)} Views | uploaded ${timeAgo(video.createdAt)}`}>{`${formatNumbers(video.views)} Views • ${timeAgo(video.createdAt)}`}</p>
                                                </NavLink>
                                                <div className="flex items-center sm:gap-x-4">
                                                    <AccountHover user={{ ...video.owner, subscribers: video.owner.subscribersCount, isSubscribed: video.owner.isSubscribed }} toggleSubscribe={toggleSubscribe}>
                                                        <div className="mt-2 hidden h-10 w-10 shrink-0 sm:block cursor-pointer" onClick={() => navigate(`/@${video.owner.username}`)}>
                                                            <img src={setAvatar(video.owner.avatar)} alt={`@${video.owner.username}`} className="h-full w-full rounded-full object-cover" />
                                                        </div>
                                                    </AccountHover>

                                                    <AccountHover user={{ ...video.owner, subscribers: video.owner.subscribersCount, isSubscribed: video.owner.isSubscribed }} toggleSubscribe={toggleSubscribe}>
                                                        <p className="text-sm mt-1 mb-3 sm:mb-0 sm:mt-0 text-primary/80 sm:text-primary/90 sm:font-medium cursor-pointer" onClick={() => navigate(`/@${video.owner.username}`)}>{`@${video.owner.username}`}</p>
                                                    </AccountHover>
                                                    <NavLink to={`/video/${video._id}`} className="block w-full h-max">
                                                        <p className='invisible h-max'>a</p></NavLink>
                                                </div>
                                                <NavLink to={`/video/${video._id}`} className="hidden sm:block w-full h-1/3"></NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })

                        :
                        <div>
                            <p>This playlist don't have any video to show</p>
                        </div>
                    }
                </div>
            </div>



        </section>
    )
}

export default PlaylistVideo
