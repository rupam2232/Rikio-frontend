import { useEffect, useState, useCallback, useRef } from 'react'
import axios from '../utils/axiosInstance.js'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from '../store/authSlice.js'
import { NavLink } from 'react-router-dom'
import { Loader, LoaderCircle } from 'lucide-react'
import errorMessage from '../utils/errorMessage.js'
import formatNumbers from '../utils/formatNumber.js'
import NotFound from './NotFound.page.jsx'

const Dashboard = () => {
    const [statsData, setStatsData] = useState(null);
    const [loader, setLoader] = useState(true);
    const [error, setError] = useState(null)
    const [videoLoader, setVideoLoader] = useState(true)
    const [videos, setVideos] = useState([])
    const [totalPages, setTotalPages] = useState(null)
    const [page, setPage] = useState(1)
    const isFetching = useRef(false);
    const observer = useRef();

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
    }, [])

    useEffect(() => {
        if ((totalPages && page > totalPages) || isFetching.current === true) {
            setVideoLoader(false)
            return;
        }
        isFetching.current = true;
        if (videos.length === 0) {
            setVideoLoader(true)
            axios.get(`/dashboard/videos/`)
                .then((value) => {
                    console.log(value.data)
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
        <section className="flex w-full flex-col gap-y-6 px-4 py-8">
            <div className="flex flex-wrap justify-between gap-4">
                <div className="block">
                    <h1 className="text-2xl font-bold flex flex-wrap gap-x-2">Welcome Back,<span>{user.fullName}</span></h1>
                    <p className="text-sm text-primary/70">Seamless Video Management, Elevated Results.</p>
                </div>
                <div className="block">
                    <NavLink to="/upload" className="flex justify-center mt-4 bg-[#ae7aff] px-4 py-2 rounded-md font-medium text-sm">Upload Video</NavLink>
                </div>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-4">
                <div className="border border-zinc-400 rounded-md shadow-sm shadow-zinc-500 p-4">
                    <h6 >Total views</h6>
                    <p className="text-3xl font-semibold">{formatNumbers(statsData.totalVideoViews)}</p>
                </div>
                <div className="border border-zinc-400 rounded-md shadow-sm shadow-zinc-500 p-4">
                    <h6>Total subscribers</h6>
                    <p className="text-3xl font-semibold">{formatNumbers(statsData.totalSubscribers)}</p>
                </div>
                <div className="border border-zinc-400 rounded-md shadow-sm shadow-zinc-500 p-4">
                    <h6>Total likes</h6>
                    <p className="text-3xl font-semibold">{formatNumbers(statsData.totalVideoLikes)}</p>
                </div>
                <div className="border border-zinc-400 rounded-md shadow-sm shadow-zinc-500 p-4">
                    <h6>Total videos</h6>
                    <p className="text-3xl font-semibold">{formatNumbers(statsData.totalVideos)}</p>
                </div>
            </div>
            <div className="w-full shadow-sm shadow-zinc-500 border border-zinc-500 rounded-md">
                <table className="w-full  border-collapse my-1">
                    <thead className='sticky top-16 sm:top-20 md:top-14 z-[30] bg-background'>
                        <tr>
                            <th className="p-4 border-b border-collapse border-zinc-500">Status</th>
                            <th className="p-4 border-b border-collapse border-zinc-500">Status</th>
                            <th className="p-4 border-b border-collapse border-zinc-500">Uploaded</th>
                            <th className="p-4 border-b border-collapse border-zinc-500">Rating</th>
                            <th className="p-4 border-b border-collapse border-zinc-500">Date uploaded</th>
                            <th className="p-4 border-b border-collapse border-zinc-500"></th>
                        </tr>
                    </thead>
                    <tbody>

                        {videos.length !== 0 ? videos.map((video, index) => {

                            if (videos.length === index + 1) {
                                return (
                                    <tr key={video._id} ref={lastVideoElementRef} className="group border">
                                        <td className="px-4 py-3 border-t border-collapse border-zinc-500">
                                            <div className="flex justify-center">
                                                <label htmlFor="vid-pub-1" className="relative inline-block w-12 cursor-pointer overflow-hidden">
                                                    <input type="checkbox" id="vid-pub-1" className="peer sr-only" checked={video.isPublished} />
                                                    <span className="inline-block h-6 w-full rounded-2xl bg-gray-200 duration-200 after:absolute after:bottom-1 after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-black after:duration-200 peer-checked:bg-[#ae7aff] peer-checked:after:left-7"></span>
                                                </label>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-t border-collapse border-zinc-500">
                                            <div className="flex justify-center">
                                                {video.isPublished ? <span className="inline-block rounded-2xl border px-1.5 py-0.5 border-green-600 text-green-600">Public</span> :
                                                    <span className="inline-block rounded-2xl border px-1.5 py-0.5 border-red-600 text-red-600">Private</span>}

                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-t border-collapse border-zinc-500">
                                            <NavLink className="flex items-center gap-4" to={video.isPublished ? `/video/${video._id}` : `/private/video/${video._id}`}>
                                                <img className="w-10 rounded-sm aspect-square object-cover" src={video.thumbnail} alt={`${video.title} uploaded by @${user.username}`} />
                                                <p className="font-semibold truncate">{video.title}</p>
                                            </NavLink>
                                        </td>
                                        <td className="px-4 py-3 border-t border-collapse border-zinc-500">
                                            <div className="flex justify-center gap-4">
                                                <span className="inline-block rounded-xl bg-green-200 px-1.5 py-0.5 text-green-700">{formatNumbers(video.likes)} likes</span>
                                                {/* <span className="inline-block rounded-xl bg-red-200 px-1.5 py-0.5 text-red-700">49 dislikes</span> */}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-t border-collapse border-zinc-500 text-center">{`${video.createdAt.split("T")[0].replaceAll("-", "/")}`}</td>
                                        <td className="px-4 py-3 border-t border-collapse border-zinc-500">
                                            <div className="flex gap-4">
                                                <button className="h-5 w-5 hover:text-[#ae7aff]">
                                                </button>
                                                <button className="h-5 w-5 hover:text-[#ae7aff]"></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            } else {
                                return (
                                    <tr key={video._id} className="group border">
                                        <td className="px-4 py-3 border-t border-collapse border-zinc-500">
                                            <div className="flex justify-center">
                                                <label htmlFor="vid-pub-1" className="relative inline-block w-12 cursor-pointer overflow-hidden">
                                                    <input type="checkbox" id="vid-pub-1" className="peer sr-only" checked={video.isPublished} />
                                                    <span className="inline-block h-6 w-full rounded-2xl bg-gray-200 duration-200 after:absolute after:bottom-1 after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-black after:duration-200 peer-checked:bg-[#ae7aff] peer-checked:after:left-7"></span>
                                                </label>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-t border-collapse border-zinc-500">
                                            <div className="flex justify-center">
                                                {video.isPublished ? <span className="inline-block rounded-2xl border px-1.5 py-0.5 border-green-600 text-green-600">Public</span> :
                                                    <span className="inline-block rounded-2xl border px-1.5 py-0.5 border-red-600 text-red-600">Private</span>}

                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-t border-collapse border-zinc-500">
                                            <NavLink className="flex items-center gap-4" to={video.isPublished ? `/video/${video._id}` : `/prv/video/${video._id}`}>
                                                <img className="w-10 rounded-sm aspect-square object-cover" src={video.thumbnail} alt={`${video.title} uploaded by @${user.username}`} />
                                                <p className="font-semibold truncate">{video.title}</p>
                                            </NavLink>
                                        </td>
                                        <td className="px-4 py-3 border-t border-collapse border-zinc-500">
                                            <div className="flex justify-center gap-4">
                                                <span className="inline-block rounded-xl bg-green-200 px-1.5 py-0.5 text-green-700">{formatNumbers(video.likes)} likes</span>
                                                {/* <span className="inline-block rounded-xl bg-red-200 px-1.5 py-0.5 text-red-700">49 dislikes</span> */}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-t border-collapse border-zinc-500 text-center">{`${video.createdAt.split("T")[0].replaceAll("-", "/")}`}</td>
                                        <td className="px-4 py-3 border-t border-collapse border-zinc-500">
                                            <div className="flex gap-4">
                                                <button className="h-5 w-5 hover:text-[#ae7aff]">
                                                </button>
                                                <button className="h-5 w-5 hover:text-[#ae7aff]"></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }

                        })

                            : (
                                <p className='mx-5 my-5 w-full text-primary/60'>No videos available to show</p>
                            )}

                        {videoLoader && (
                            <tr className="relative h-7">
                                {/* <div className='w-full '> */}
                                    <Loader className='animate-spin absolute top-1 right-1/2' />
                                {/* </div> */}
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default Dashboard
