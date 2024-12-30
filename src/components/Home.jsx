import React, { useState, useEffect } from 'react'
import axios from '../utils/axiosInstance.js'
import { timeAgo } from '../utils/timeAgo.js'
import { videoDuration } from '../utils/videoDuration.js'
import { formatViews } from '../utils/views.js'
import { NavLink, useSearchParams } from 'react-router-dom'
import { VideoNotFound } from './index.js'

const Home = () => {
    const [videos, setVideos] = useState([])
    const [loader, setLoader] = useState(true)
    const [searchParams] = useSearchParams()

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const channel = searchParams.get("channel");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");
    const sortType = searchParams.get("sortType");

    useEffect(() => {
        axios.get(`/videos`)
            .then((value) => setVideos(value.data.data.videos))
            .catch((error) => console.error(error))
            .finally(() => setLoader(false))

    }, [])

    if (loader === true) {
        return (<h2>Loading...</h2>)
    }
    if (videos.length === 0) {
        return (
            <VideoNotFound />
        )
    }


    return (
        <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
            <div className='grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4'>

                {videos ? videos.map((video) => (
                    <div key={video._id} className="w-full" title={`${video.title} @${video.owner.username}`}>
                        <div className='relative mb-2 w-full pt-[56%]' aria-label='Thubmnail'>
                            <NavLink to={`video/${video._id}`}>
                                <div className="absolute inset-0">
                                    <img src={video.thumbnail} alt="thumbnail" className='w-full h-full object-cover' />
                                </div>
                                <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">{videoDuration(video.duration)}</span>
                            </NavLink>
                        </div>
                        <div className="flex gap-x-2">
                            <NavLink to={`@${video.owner.username}`} className="h-10 w-10 shrink-0">
                                <img src={video.owner.avatar} alt={video.owner.fullName} className="h-full w-full rounded-full object-cover" />
                            </NavLink>
                            <div className="w-full">
                                <NavLink to={`video/${video._id}`} >
                                    <h6 className="mb-1 font-semibold max-h-16 line-clamp-2 text-lg whitespace-normal">{video.title}</h6>
                                    <p className="flex text-sm text-gray-200">
                                        <span>{formatViews(video.views)} views </span>
                                        <span className=" before:content-['•'] before:px-2">{timeAgo(video.createdAt)}</span>
                                    </p>
                                </NavLink>
                                <NavLink to={`@${video.owner.username}`} className="text-sm text-gray-200">
                                    <p className="relative group inline-block">
                                        <span className="absolute -top-10 hidden opacity-0 group-hover:opacity-100 group-hover:block transition-all bg-slate-600 text-white px-2 py-1 rounded-md text-xs">
                                        {`@${video.owner.username}`}
                                        </span>
                                        {video.owner.fullName}
                                        {video.owner.verified && <span> verified</span>}
                                    </p>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                )) : <h1>Some thing went wrong please refresh the page or else contact to the support</h1>}

            </div>
        </section>
    )
}

export default Home
