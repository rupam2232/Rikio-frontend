import { useEffect, useState, useCallback, useRef } from 'react'
import axios from '../utils/axiosInstance.js'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice.js'
import { NavLink } from 'react-router-dom'
import { Loader, LoaderCircle, Upload } from 'lucide-react'
import errorMessage from '../utils/errorMessage.js'
import formatNumbers from '../utils/formatNumber.js'
import NotFound from './NotFound.page.jsx'
import { Button, EditVideo } from '../components/index.js'
import toast from 'react-hot-toast'
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
import { Trash2, EditIcon, UserRoundCheck, ThumbsUp, UsersRound, SquarePlay } from 'lucide-react'

const Dashboard = () => {
    const [statsData, setStatsData] = useState(null);
    const [loader, setLoader] = useState(true);
    const [error, setError] = useState(null)
    const [toggleFetch, setToggleFetch] = useState(true)
    const [videoLoader, setVideoLoader] = useState(true)
    const [optionLoader, setOptionLoader] = useState(null)
    const [openEditPopup, setOpenEditPopup] = useState(false)
    const [editVideo, setEditVideo] = useState(null)
    const [videos, setVideos] = useState([])
    const [totalPages, setTotalPages] = useState(null)
    const [page, setPage] = useState(1)
    const isFetching = useRef(false);
    const observer = useRef();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.userData);

    useEffect(() => {
        setLoader(true)
        axios.get('/dashboard/stats')
            .then((res) => {
                setStatsData(res.data.data)
            })
            .catch((error) => {
                setError(errorMessage(error))
            })
            .finally(() => {
                setLoader(false)
            })
    }, [toggleFetch])



    useEffect(() => {
        if (totalPages ? page > totalPages : "" || isFetching.current === true) {
            setVideoLoader(false)
            return;
        }
        isFetching.current = true;

        if (videos.length === 0) {
            setVideoLoader(true)
            axios.get(`/dashboard/videos/`)
                .then((value) => {
                    setTotalPages(value.data.data.totalPages)
                    setVideos(value.data.data.videos)
                })
                .catch((error) => console.error(errorMessage(error)))
                .finally(() => setVideoLoader(false))

        } else {
            setVideoLoader(true)
            axios.get(`/dashboard/videos/?page=${page}`)
                .then((value) => {
                    setTotalPages(value.data.data.totalPages)
                    setVideos([
                        ...videos,
                        ...value.data.data.videos.filter((video) =>
                            !videos.some((v) =>
                                v._id === video._id
                            ))
                    ])
                })
                .catch((error) => console.error(errorMessage(error)))
                .finally(() => setVideoLoader(false))
        }
        isFetching.current = false;


    }, [page])


    const deleteVideo = (videoId) => {
        if (loader || optionLoader) {
            toast.error("Please wait and try again later", {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            return;
        }

        setOptionLoader(true)
        axios.delete(`/videos/${videoId}`)
            .then((res) => {
                if (res.data.data === true) {
                    setToggleFetch(!toggleFetch)
                    setVideos(videos.filter((video) => video._id !== videoId))
                    toast.success("Video deleted successfully", {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                } else {
                    toast.error("Something went wrong, please refresh the page", {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
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
                    console.error(errorMessage(error));
                }
            })
            .finally(() => {
                setOptionLoader(false)
            })
    }

    const handleStatusChange = (videoId, videoStatus) => {
        if (loader || optionLoader) {
            toast.error("Please wait and try again later", {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            return;
        }

        setOptionLoader(true)
        let toggleStatus = !videoStatus

        axios.patch(`/videos/toggle/publish/${videoId}`, { isPublished: toggleStatus })
            .then((res) => {
                if (res.data.data) {
                    videos.map((video) => {
                        if (video._id === videoId) {
                            video.isPublished = toggleStatus
                        }
                    })
                    toast.success(`Video is now ${toggleStatus ? "Public" : "Private"}`, {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                } else {
                    toast.error("Something went wrong, please refresh the page", {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
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
                    console.error(errorMessage(error));
                }
            })
            .finally(() => {
                setOptionLoader(false)
            })
    }

    const lastVideoElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [])

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
        <section className="flex w-screen sm:w-[97vw] md:w-[90vw] lg:w-full flex-col gap-y-6 px-4 py-8">
            {openEditPopup && <EditVideo setOpenEditPopup={setOpenEditPopup} videoDetails={editVideo} setVideoDetails={setEditVideo} />}
            <div className="flex flex-wrap justify-between gap-4 bg-background">
                <div className="block">
                    <h1 className="text-2xl font-bold flex flex-wrap gap-x-2">Welcome Back,<span>{user.fullName}</span></h1>
                    <p className="text-sm text-primary/70">Seamless Video Management, Elevated Results.</p>
                </div>
                <div className="block">
                    <NavLink to="/upload" className="flex justify-center items-center gap-2 mt-4 bg-[#ae7aff] px-4 py-2 rounded-md font-medium text-sm [&>svg]:size-4 [&>svg]:shrink-0"><Upload /> Upload Video</NavLink>
                </div>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-4">
                <div className="border border-zinc-400 rounded-md shadow-sm shadow-zinc-500 p-4">
                    <div className='flex items-center justify-between'>
                        <h6 >Total views</h6>
                        <UsersRound className='size-4 text-primary/80' />
                    </div>
                    <p className="text-3xl font-semibold">{formatNumbers(statsData.totalVideoViews)}</p>
                </div>
                <div className="border border-zinc-400 rounded-md shadow-sm shadow-zinc-500 p-4">
                    <div className='flex items-center justify-between'>
                        <h6>Total subscribers</h6>
                        <UserRoundCheck className='size-4 text-primary/80' />
                    </div>
                    <p className="text-3xl font-semibold">{formatNumbers(statsData.totalSubscribers)}</p>
                </div>
                <div className="border border-zinc-400 rounded-md shadow-sm shadow-zinc-500 p-4">
                    <div className='flex items-center justify-between'>
                        <h6>Total likes</h6>
                        <ThumbsUp className='size-4 text-primary/80' />
                    </div>
                    <p className="text-3xl font-semibold">{formatNumbers(statsData.totalVideoLikes)}</p>
                </div>
                <div className="border border-zinc-400 rounded-md shadow-sm shadow-zinc-500 p-4">
                    <div className='flex items-center justify-between'>
                        <h6>Total videos</h6>
                        <SquarePlay className='size-4 text-primary/80' />
                    </div>
                    <p className="text-3xl font-semibold">{formatNumbers(statsData.totalVideos)}</p>
                </div>
            </div>
            <div className='relative'>
                {optionLoader && (
                    <>
                        <div className='absolute z-[31] inset-0 flex items-start justify-center bg-background/70 bg-opacity-50'>
                            <p className='w-full mt-5 flex justify-center'> <Loader height="24px" width="24px" className="animate-spin fill-primary" /> </p>
                        </div>
                    </>
                )}
                <div className="w-full overflow-x-scroll lg:overflow-auto no-scrollbar shadow-sm shadow-zinc-500 border border-zinc-500 rounded-md">
                    <table className="w-full border-collapse my-1">
                        <thead className='w-full overflow-x-scroll lg:overflow-auto no-scrollbar'>
                            <tr>
                                <th className="p-4 border-b border-collapse border-zinc-500">Status</th>
                                <th className="p-4 border-b border-collapse border-zinc-500">Visibility</th>
                                <th className="p-4 border-b border-collapse border-zinc-500">Title</th>
                                <th className="p-4 border-b border-collapse border-zinc-500">Likes</th>
                                <th className="p-4 border-b text-nowrap border-collapse border-zinc-500">Date uploaded</th>
                                <th className="p-4 border-b border-collapse border-zinc-500">Options</th>
                            </tr>
                        </thead>
                        <tbody>

                            {videos.length !== 0 ? videos.map((video, index) => {

                                if (videos.length === index + 1) {
                                    return (

                                        <tr key={video._id} ref={lastVideoElementRef} className="group ">
                                            <td className="px-4 py-3 border-t border-collapse border-zinc-500">
                                                <div className="flex justify-center">
                                                    <label title={video.isPublished ? "On" : "Off"} htmlFor={`vid-pub-${video._id}`} className="relative inline-block w-12 cursor-pointer overflow-hidden">
                                                        <input type="checkbox" id={`vid-pub-${video._id}`} className="peer sr-only" checked={video.isPublished} onChange={() => handleStatusChange(video._id, video.isPublished)} />
                                                        <span className="inline-block h-6 w-full rounded-2xl bg-primary duration-200 after:absolute after:bottom-1 after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-background after:duration-200 peer-checked:bg-[#ae7aff] peer-checked:after:left-7"></span>
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 border-t border-collapse border-zinc-500">
                                                <div className="flex justify-center">
                                                    {video.isPublished ? <span title="Public" className="inline-block rounded-2xl border px-1.5 py-0.5 border-green-600 text-green-600">Public</span> :
                                                        <span title='Private' className="inline-block rounded-2xl border px-1.5 py-0.5 border-red-600 text-red-600">Private</span>}

                                                </div>
                                            </td>
                                            <td className="px-4 py-3 border-t border-collapse border-zinc-500">
                                                <NavLink title={video.title} className="flex items-center gap-4 max-w-xl" to={video.isPublished ? `/video/${video._id}` : `/prv/video/${video._id}`}>
                                                    <img className="w-10 rounded-sm aspect-square object-cover" src={video.thumbnail} alt={`${video.title} uploaded by @${user.username}`} />
                                                    <p className="font-semibold truncate">{video.title}</p>
                                                </NavLink>
                                            </td>
                                            <td className="px-4 py-3 border-t border-collapse border-zinc-500">
                                                <div className="flex justify-center gap-4">
                                                    <span title={`${formatNumbers(video.likes)}  Likes`} className="inline-block text-nowrap rounded-xl bg-green-200 px-1.5 py-0.5 text-green-700">{formatNumbers(video.likes)} Likes</span>
                                                    {/* <span className="inline-block rounded-xl bg-red-200 px-1.5 py-0.5 text-red-700">49 dislikes</span> */}
                                                </div>
                                            </td>
                                            <td title={`${new Date(video.createdAt).getDate()}th ${new Date(video.createdAt).toLocaleString('default', { month: 'long' })} ${new Date(video.createdAt).getFullYear()}`} className="px-4 py-3 border-t border-collapse border-zinc-500 text-center">{`${("0" + new Date(video.createdAt).getDate()).slice(-2)}/${("0" + (new Date(video.createdAt).getMonth() + 1)).slice(-2)}/${new Date(video.createdAt).getFullYear()}`}</td>
                                            <td className="px-4 py-3 border-t border-collapse border-zinc-500">

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild title='options' className="mx-auto">
                                                        <div className='flex cursor-pointer px-[15px] py-2 rounded-full transition-colors hover:bg-primary/30 flex-col gap-1 h-max w-max'>
                                                            <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
                                                            <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
                                                            <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
                                                        </div>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="min-w-min !z-30">
                                                        <DropdownMenuItem className="py-0 px-1 w-full">
                                                            <Button className="bg-transparent w-max h-min text-primary shadow-none hover:bg-transparent hover:text-primary" onClick={() => {
                                                                setOpenEditPopup(true)
                                                                setEditVideo(video)
                                                            }}>
                                                                <EditIcon />Edit
                                                            </Button>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <AlertDialog>
                                                            <AlertDialogTrigger className="py-0 px-0 w-max hover:bg-accent rounded-sm transition-colors ">
                                                                <div role="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-4 py-2 bg-transparent w-max h-min text-primary shadow-none hover:bg-transparent hover:text-primary text-red-600 hover:text-red-600" >
                                                                    {optionLoader ? <Loader className="animate-spin fill-primary relative left-5" /> : <><Trash2 />Delete</>}
                                                                </div>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete your video.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction className="text-red-600 bg-transparent shadow-none hover:bg-accent border border-input" onClick={() => deleteVideo(video._id)}>Delete</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    )
                                } else {
                                    return (
                                        <tr key={video._id} className="group ">
                                            <td className="px-4 py-3 border-t border-collapse border-zinc-500">
                                                <div className="flex justify-center">
                                                    <label title={video.isPublished ? "On" : "Off"} htmlFor={`vid-pub-${video._id}`} className="relative inline-block w-12 cursor-pointer overflow-hidden">
                                                        <input type="checkbox" id={`vid-pub-${video._id}`} className="peer sr-only" checked={video.isPublished} onChange={() => handleStatusChange(video._id, video.isPublished)} />
                                                        <span className="inline-block h-6 w-full rounded-2xl bg-primary duration-200 after:absolute after:bottom-1 after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-background after:duration-200 peer-checked:bg-[#ae7aff] peer-checked:after:left-7"></span>
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 border-t border-collapse border-zinc-500">
                                                <div className="flex justify-center">
                                                    {video.isPublished ? <span title="Public" className="inline-block rounded-2xl border px-1.5 py-0.5 border-green-600 text-green-600">Public</span> :
                                                        <span title='Private' className="inline-block rounded-2xl border px-1.5 py-0.5 border-red-600 text-red-600">Private</span>}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 border-t border-collapse border-zinc-500">
                                                <NavLink title={video.title} className="flex items-center gap-4 max-w-xl" to={video.isPublished ? `/video/${video._id}` : `/prv/video/${video._id}`}>
                                                    <img className="w-10 rounded-sm aspect-square object-cover" src={video.thumbnail} alt={`${video.title} uploaded by @${user.username}`} />
                                                    <p className="font-semibold truncate">{video.title}</p>
                                                </NavLink>
                                            </td>
                                            <td className="px-4 py-3 border-t border-collapse border-zinc-500">
                                                <div className="flex justify-center gap-4">
                                                    <span title={`${formatNumbers(video.likes)}  Likes`} className="inline-block text-nowrap rounded-xl bg-green-200 px-1.5 py-0.5 text-green-700">{formatNumbers(video.likes)} Likes</span>
                                                    {/* <span className="inline-block rounded-xl bg-red-200 px-1.5 py-0.5 text-red-700">49 dislikes</span> */}
                                                </div>
                                            </td>
                                            <td title={`${new Date(video.createdAt).getDate()}th ${new Date(video.createdAt).toLocaleString('default', { month: 'long' })} ${new Date(video.createdAt).getFullYear()}`} className="px-4 py-3 border-t border-collapse border-zinc-500 text-center">{`${("0" + new Date(video.createdAt).getDate()).slice(-2)}/${("0" + (new Date(video.createdAt).getMonth() + 1)).slice(-2)}/${new Date(video.createdAt).getFullYear()}`}</td>
                                            <td className="px-4 py-3 border-t border-collapse border-zinc-500">

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild title='options' className="mx-auto">
                                                        <div className='flex cursor-pointer px-[15px] py-2 rounded-full transition-colors hover:bg-primary/30 flex-col gap-1 h-max w-max'>
                                                            <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
                                                            <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
                                                            <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
                                                        </div>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="min-w-min !z-30">
                                                        <DropdownMenuItem className="py-0 px-1 w-full">
                                                            <Button className="bg-transparent w-max h-min text-primary shadow-none hover:bg-transparent hover:text-primary" onClick={() => {
                                                                setOpenEditPopup(true)
                                                                setEditVideo(video)
                                                            }}>
                                                                <EditIcon />Edit
                                                            </Button>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <AlertDialog>
                                                            <AlertDialogTrigger className="py-0 px-0 w-max hover:bg-accent rounded-sm transition-colors ">
                                                                <div role="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-4 py-2 bg-transparent w-max h-min text-primary shadow-none hover:bg-transparent hover:text-primary text-red-600 hover:text-red-600" >
                                                                    {optionLoader ? <Loader className="animate-spin fill-primary relative left-5" /> : <><Trash2 />Delete</>}
                                                                </div>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete your video.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction className="text-red-600 bg-transparent shadow-none hover:bg-accent border border-input" onClick={() => deleteVideo(video._id)}>Delete</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    )
                                }

                            })

                                : (
                                    <tr>

                                        <td colSpan="3"> <p className='mx-5 my-5 w-full text-primary/60'>No videos available to show</p> </td>

                                    </tr>
                                )}

                            {videoLoader && (
                                <tr className="relative h-7">
                                    <Loader className='animate-spin absolute top-1 right-1/2' />
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

export default Dashboard
