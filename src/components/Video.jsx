import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { timeAgo } from '../utils/timeAgo'
import { Input, Like, PlaylistBtn, SubscribeBtn, SubscribersBtn, Tick, Send, Button, Refresh, Loading } from "./index.js"
import { NavLink, useNavigate } from 'react-router-dom'
import { formatViews } from '../utils/views.js'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'
import setAvatar from '../utils/setAvatar.js'
import toast from "react-hot-toast"

const Video = () => {
    const [fullDesc, setFullDesc] = useState(false)
    const [fetch, setFetch] = useState(1)
    const [video, setVideo] = useState({})
    const [like, setLike] = useState({})
    const [sub, setSub] = useState([])
    const [comment, setComment] = useState({})
    const [postComment, setPostComment] = useState("")
    const [subscribed, setSubscribed] = useState(false)
    const [loader, setLoader] = useState(true)
    const [error, setError] = useState("")
    const [isCommentSubmitting, setIsCommentSubmitting] = useState(false)
    const { videoId } = useParams()
    const navigate = useNavigate()
    // console.log(comment)
    const toggleSubscribe = () => {
        axios.post(`/subscription/c/${video.owner._id}`)
            .then((value) => {
                if (value.data.message.toLowerCase() === "subscribed") {
                    setSubscribed(true)

                    axios.get(`/subscription/u/${video.owner._id}`)
                        .then((value) => {
                            setSub(value.data.data.subscribers);
                        })
                        .catch((error) => {
                            console.error(error.message);
                        });
                } else if (value.data.message.toLowerCase() === "unsubscribed") {
                    setSubscribed(false)

                    axios.get(`/subscription/u/${video.owner._id}`)
                        .then((value) => {
                            setSub(value.data.data.subscribers);
                        })
                        .catch((error) => {
                            console.error(error.message);
                        });
                } else {
                    setSubscribed(subscribed)
                }
            })
            .catch((error) => {
                if (error.status === 401) {
                    toast.error("You need to login first", {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                    navigate("/login")
                }
                console.error(errorMessage(error));
                setSubscribed(subscribed)
            })
    }

    console.log(comment)

    const addVideoComment = () => {
        setIsCommentSubmitting(true)
        axios.post(`/comment/v/${videoId}`, { content: postComment })
            .then((_) => {
                setPostComment("")
                axios.get(`/comment/v/${videoId}`)
                    .then((value) => {
                        setComment(value.data.data);
                    })
                    .catch((error) => {
                        console.error(error.message);
                    })
                    .finally(() => setIsCommentSubmitting(false))
            })
            .catch((error) => {
                if (error.status === 401) {
                    toast.error("You need to login first", {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                    navigate("/login")
                }
                console.error(errorMessage(error));
                setLike(like)
            })
            .finally(() => setIsCommentSubmitting(false))
    }

    const toggleLike = () => {
        axios.post(`/like/toggle/v/${videoId}`)
            .then((_) => {
                axios.get(`/videos/${videoId}`)
                    .then((value) => {
                        setLike(value.data.data.likes);
                    })
                    .catch((error) => {
                        console.error(errorMessage(error))
                    })
            })
            .catch((error) => {
                if (error.status === 401) {
                    toast.error("You need to login first", {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                    navigate("/login")
                }
                console.error(errorMessage(error));
                setLike(like)
            })
    }

    const handleEnter = (e) => {
        if ((e.key === "Enter" && e.nativeEvent.shiftKey !== true) && postComment !== "" && isCommentSubmitting !== true) {
            addVideoComment();
        }
    };

    useEffect(() => {
        setError("")
        axios.get(`/videos/${videoId}`)
            .then((value) => {
                setVideo(value.data.data.video);
                setLike(value.data.data.likes);

                axios.get(`/comment/v/${videoId}`)
                    .then((value) => {
                        setComment(value.data.data);
                    })
                    .catch((error) => {
                        console.error(error.message);
                    });

                axios.get(`/subscription/u/${value.data.data.video.owner._id}`)
                    .then((value) => {
                        setSub(value.data.data.subscribers);
                    })
                    .catch((error) => {
                        console.error(error.message);
                    });

                axios.get(`/subscription/i/${value.data.data.video.owner._id}`)
                    .then((value) => {
                        setSubscribed(value.data.data);
                    })
                    .catch((error) => {
                        console.error(error.message);
                    });
            })
            .catch((error) => {
                const htmlString = error?.response?.data;
                const match = htmlString?.match(/Error:.*?(?=<br>)/);
                match ? setError(match[0].slice(7)) : setError(error.message);
            })
            .finally(() => setLoader(false));
    }, [])

    if(loader){
    return (<div className='w-full pb-[70px] lg:ml-0 sm:ml-[70px] sm:pb-0 flex justify-center items-center'>
        <Loading className={`w-16 h-16`} left="-left-28" width="min-w-32" hieght="h-8"/>
    </div>)
    }

    if (error) {
        return (<div className='text-center w-full'>Opps Something went wrong please refresh the page or try again</div>)
    }

    return (
        <>
            <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0">
                <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
                    <div className="col-span-12 w-full">
                        <div className="relative mb-4 w-full pt-[56%]">
                            <div className="absolute inset-0">
                                <video
                                    className="h-full w-full"
                                    controls
                                    autoPlay
                                    poster={video.thumbnail}
                                >
                                    <source
                                        src={video.videoFile}
                                        type="video/mp4" />
                                </video>
                            </div>
                        </div>
                        <div className="mb-4 w-full rounded-lg border p-4 duration-200">
                            <div className="flex flex-wrap gap-y-2">
                                <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                                    <h1 className="text-lg font-bold">{video.title}</h1>
                                    <div className="flex text-sm text-gray-200">
                                        <p>{formatViews(video.views)} views </p>
                                        <p className=" before:content-['•'] before:px-2">{timeAgo(video.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                                    <div className="flex items-center justify-between gap-x-4 md:justify-end lg:justify-between xl:justify-end">
                                        <div className="flex overflow-hidden rounded-lg border">
                                            <button
                                                className="group/btn flex items-center gap-x-2 border-r border-gray-700 px-4 py-1.5 after:content-[attr(data-like)] hover:bg-white/10 "
                                                data-like={like.totalLikes}
                                                data-like-alt={like.totalLikes + 1} onClick={toggleLike}>
                                                <span className="flex w-5 items-center ">
                                                    {like.isLiked ? <span className="inline-block w-5 shrink-0 text-[#ae7aff]"> <Like /> </span> : <span className="inline-block w-5 shrink-0 "> <Like /> </span>}
                                                </span>
                                            </button>
                                            {/* dislike button */}
                                            {/* <button
                                                className="group/btn flex items-center gap-x-2 px-4 py-1.5 after:content-[attr(data-like)] hover:bg-white/10 focus:after:content-[attr(data-like-alt)]"
                                                data-like="20"
                                                data-like-alt="21">
                                                <span className="inline-block w-5 group-focus/btn:text-[#ae7aff]">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="currentColor"
                                                        aria-hidden="true">
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"></path>
                                                    </svg>
                                                </span>
                                            </button> */}
                                        </div>
                                        <div className="relative block">
                                            {/* playlist btn */}

                                            {/* <button className="peer flex items-center gap-x-2 rounded-lg bg-white px-4 py-1.5 text-black">
                                                <span className="inline-block w-5">
                                                    <PlaylistBtn />
                                                </span>
                                                Save
                                            </button>
                                            <div className="absolute right-0 top-full z-10 hidden w-64 overflow-hidden rounded-lg bg-[#121212] p-4 shadow shadow-slate-50/30 hover:block peer-focus:block">
                                                <h3 className="mb-4 text-center text-lg font-semibold">Save to playlist</h3>
                                                <ul className="mb-4">
                                                    <li className="mb-2 last:mb-0">
                                                        <label
                                                            className="group/label inline-flex cursor-pointer items-center gap-x-3"
                                                            for="Collections-checkbox">
                                                            <Input
                                                                type="checkbox"
                                                                className="peer hidden"
                                                                id="Collections-checkbox" />
                                                            <span
                                                                className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] border border-transparent bg-white text-white group-hover/label:border-[#ae7aff] peer-checked:border-[#ae7aff] peer-checked:text-[#ae7aff]">
                                                                <Tick />
                                                            </span>
                                                            Collections
                                                        </label>
                                                    </li>
                                                </ul>
                                                <div className="flex flex-col">
                                                    <label
                                                        for="playlist-name"
                                                        className="mb-1 inline-block cursor-pointer">
                                                        Name
                                                    </label>
                                                    <Input
                                                        className="w-full rounded-lg border border-transparent bg-white px-3 py-2 text-black outline-none focus:border-[#ae7aff]"
                                                        id="playlist-name"
                                                        placeholder="Enter playlist name" />
                                                    <button className="mx-auto mt-4 rounded-lg bg-[#ae7aff] px-4 py-2 text-black">Create new playlist</button>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-x-4 group cursor-pointer" onClick={() => navigate(`/@${video.owner.username}`)}>
                                    <div className="mt-2 h-12 w-12 shrink-0">
                                        <img
                                            src={setAvatar(video.owner.avatar)}
                                            className="h-full w-full rounded-full object-cover" />
                                    </div>
                                    <div className="block">
                                        <p className="text-gray-200 font-bold relative">
                                            <span className="absolute -top-8 hidden opacity-0 group-hover:opacity-100 group-hover:block transition-all bg-slate-600 text-white px-2 py-1 rounded-md text-xs">
                                                {`@${video.owner.username}`}
                                            </span>
                                            {video.owner.fullName} {video.owner.verified && <span> verified</span>}</p>
                                        <p className="text-sm text-gray-400">{formatViews(sub.length)} Subscribers</p>
                                    </div>
                                </div>
                                <div className="block">
                                    <button
                                        className="group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto" onClick={toggleSubscribe}>
                                        {subscribed ? <>
                                            <span className=" w-5 inline-block">
                                                <SubscribersBtn />
                                            </span>
                                            <span>Subscribed</span></> :
                                            <>
                                                <span className="inline-block w-5">
                                                    <SubscribeBtn />
                                                </span>
                                                <span>Subscribe</span>
                                            </>}
                                    </button>
                                </div>
                            </div>
                            <hr className="my-4 border-white" />
                            <div className={`text-sm cursor-pointer ${fullDesc ? "h-auto" : "h-5  line-clamp-1"}`} role="button" tabIndex="0" onClick={() => setFullDesc(!fullDesc)}>
                                <p>
                                    {video.description}
                                </p>
                            </div>
                        </div>
                        <button className="peer w-full rounded-lg border p-4 text-left duration-200 hover:bg-white/5 focus:bg-white/5 sm:hidden"><h6 className="font-semibold">{formatViews(comment.totalComments)} Comments ...</h6></button>
                        <div
                            className="fixed inset-x-0 top-full z-[60] h-[calc(100%-69px)] overflow-auto rounded-lg border bg-[#121212] p-4 duration-200 hover:top-[67px] peer-focus:top-[67px] sm:static sm:h-auto sm:max-h-[500px] lg:max-h-none">
                            <div className="block">
                                <h6 className="mb-4 font-semibold">{formatViews(comment.totalComments)} Comments</h6>
                                <div className='relative'>
                                    <textarea
                                        type="text"
                                        className="w-full resize-none h-auto max-h-20 rounded-lg border bg-transparent pl-2 pr-12 py-1 placeholder-white"
                                        placeholder="Add a Comment"
                                        value={postComment}
                                        autoComplete="off"
                                        onChange={(e)=> setPostComment(e.target.value)}
                                        onKeyDown={handleEnter}
                                        maxLength="900"
                                    />

                                    <Button title="send" className={`px-[5px] py-[5px] absolute rounded-md right-1 top-1 bg-slate-700 ${(postComment === "") ? "brightness-75" : "brightness-100"} hover:bg-slate-600 transition-colors`} disabled={(postComment === "") ? true : false} onClick={addVideoComment}>

                                        {isCommentSubmitting ? <Refresh height="24px" width="24px" fill="white" className={`animate-spin`}/> : <Send height="24px" width="24px" fill="white"  className={`relative`}/>}

                                    </Button>
                                </div>
                            </div>
                            <hr className="my-4 border-white" />

                            {comment.comments ? comment.comments.length !== 0 ? comment.comments.map((comment) => (<div key={comment._id} className="block">
                                <div className="flex gap-x-4 relative">
                                    <div className="mt-2 h-11 w-11 shrink-0">
                                        <img
                                            src={setAvatar(comment.ownerInfo.avatar)}
                                            alt={`@${comment.ownerInfo.username}`}
                                            className="h-full w-full rounded-full object-cover" />
                                    </div>
                                    <div className="block">

                                        {comment.isVideoOwner ? <div className="flex"> <p className="flex items-center text-gray-200 font-bold">
                                            {comment.ownerInfo.fullName} {comment.ownerInfo.verified && <span> verified</span>}
                                        </p>
                                            <span className="text-sm before:content-['•'] before:px-1">{timeAgo(comment.createdAt)}</span>
                                            {comment.isEdited && <span>(Edited)</span>}
                                            </div>
                                            : <p className="flex items-center text-gray-200">
                                                {comment.ownerInfo.fullName} {comment.ownerInfo.verified && <span> verified</span>}
                                                <span className="text-sm before:content-['•'] before:px-1">{timeAgo(comment.createdAt)}</span>
                                                {comment.isEdited && <span>(Edited)</span>}
                                            </p>}

                                        <p className="text-sm text-gray-200">@{comment.ownerInfo.username}</p>
                                        <p className="mt-3 text-sm whitespace-pre-wrap">{comment.content}</p>
                                    </div>

                                    {comment.isCommentOwner && <div className='flex cursor-pointer px-[15px] py-2 rounded-full transition-colors hover:bg-slate-700 flex-col gap-1 h-max w-max absolute right-2'>
                                        <span className='h-[3px] w-[3px] rounded-full bg-white'></span>
                                        <span className='h-[3px] w-[3px] rounded-full bg-white'></span>
                                        <span className='h-[3px] w-[3px] rounded-full bg-white'></span>
                                    </div>}

                                </div>
                                <hr className="my-4 border-white" />
                            </div>)) : <h1>No comments available</h1> : <p>Loading...</p>}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )



}

export default Video
