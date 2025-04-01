import { useState, useEffect, useCallback, useRef } from 'react'
import formatNumbers from '../utils/formatNumber.js'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'
import setAvatar from '../utils/setAvatar.js'
import { timeAgo } from '../utils/timeAgo.js'
import { BadgeCheck, SendHorizonal, Loader } from 'lucide-react'
import { Button, CommentOptions, AccountHover, ParseContents, ArrowBack } from "./index.js"
import { useNavigate } from 'react-router-dom'
import { useIsMobile } from "../hooks/use-mobile.jsx"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice.js'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const Comments = ({
    parentContentId,
    toggleSubscribe,
    allComment,
    setAllComment,
    commentType,
    isVideoPublic = true
}) => {
    const [commentLoader, setCommentLoader] = useState(false)
    const [postComment, setPostComment] = useState("")
    const [isCommentSubmitting, setIsCommentSubmitting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editingComment, setEditingComment] = useState({})
    const [page, setPage] = useState(1)
    const [showSingleComment, setShowSingleComment] = useState(null)
    const [sortType, setSortType] = useState("desc")
    const [showComment, setShowComment] = useState(true)
    const observer = useRef()
    const textArea = useRef()
    const isFetching = useRef(false);
    const singleComment = useRef();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isMobile = useIsMobile()
    const isUserLoggedin = useSelector((state) => state.auth.status)

    const handleCommentPost = () => {
        if (!isUserLoggedin) {
            toast.error("You need to login first", {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            navigate("/login")
            return;
        }
        setIsCommentSubmitting(true)
        if (!isEditing) {
            axios.post(`/comment/${commentType}/${parentContentId}`, { content: postComment })
                .then((_) => {
                    setPostComment("")
                    axios.get(`/comment/${commentType}/${parentContentId}?sortType=${sortType}`)
                        .then((value) => {
                            setAllComment(value.data.data);
                        })
                        .catch((error) => {
                            console.error(errorMessage(error));
                        })
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
                })
                .finally(() => setIsCommentSubmitting(false))
        } else {
            axios.patch(`/comment/c/${editingComment._id}`, { content: postComment })
                .then((_) => {
                    setIsEditing(false)
                    if (!showSingleComment) {
                        axios.get(`/comment/${commentType}/${parentContentId}?sortType=${sortType}`)
                            .then((value) => {
                                setAllComment(value.data.data);
                            })
                            .catch((error) => {
                                console.error(errorMessage(error));
                            })
                    } else {
                        setShowSingleComment({ ...showSingleComment, content: postComment })
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
                })
                .finally(() => {
                    setIsCommentSubmitting(false)
                    setPostComment("")
                })
        }
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setPostComment("")
    }

    const showFullComment = (comment) => {
        setShowSingleComment(comment)
    }

    const closeFullComment = () => {
        let singleCommentId = showSingleComment._id
        setShowSingleComment(null)
        setIsEditing(false)
        setPostComment("")
        setTimeout(() => {
            const targetElement = document.getElementById(`${singleCommentId}`)
            targetElement.scrollIntoView({ behavior: "smooth", block: "center" })
        }, [100])


    }


    const lastCommentElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [])

    useEffect(() => {
        const fetchComments = () => {

            if (page > allComment?.totalPages || isFetching.current === true) {
                setCommentLoader(false)
                return;
            }

            if (allComment?.comments) {
                setCommentLoader(true)
                isFetching.current = true;
                axios.get(`/comment/${commentType}/${parentContentId}?page=${page}&sortType=${sortType}`)
                    .then((res) => {
                        setAllComment({
                            ...allComment, comments: [...allComment.comments,
                            ...res.data.data.comments.filter(
                                (newComment) =>
                                    !allComment.comments.some(
                                        (existingComment) => existingComment._id === newComment._id
                                    )
                            ),]
                        })
                    })
                    .catch((error) => {
                        console.error(errorMessage(error));
                    })
                    .finally(() => {
                        isFetching.current = false;
                        setCommentLoader(false)
                    })
            }
        }
        fetchComments();

    }, [page])

    const fetchFirstCommentSet = useCallback(() => {
        isFetching.current = true;
        setCommentLoader(true)
        setShowComment(false)
        setPage(1)
        axios.get(`/comment/${commentType}/${parentContentId}?sortType=${sortType}`)
            .then((res) => {
                setAllComment(res.data.data)
            })
            .catch((error) => console.error(errorMessage(error)))
            .finally(() => {
                isFetching.current = false;
                setCommentLoader(false)
                setShowComment(true)
            })
    }, [sortType])

    useEffect(() => {
        fetchFirstCommentSet()
    }, [sortType])


    if (showSingleComment) {
        return (
            <>

                <div
                    className="bg-background border-primary/30 rounded-lg border p-4 duration-200">
                    <div className="block">
                        <div className='flex gap-4 items-center mb-4 '>
                            <button type='button' className="border-primary/30 rounded-lg px-4 py-2 border text-primary" onClick={() => {
                                closeFullComment()
                            }}>
                                <ArrowBack height="20px" width="20px" className={`relative left-1 fill-primary`} />
                            </button>
                            <h6 className="font-semibold">{`${showSingleComment.ownerInfo.fullName}'s comment`}</h6>
                        </div>
                    </div>
                    <div>
                        <div className="block">
                            <div className="flex xs:flex-row flex-col gap-x-4 relative">

                                <AccountHover user={{ ...showSingleComment.ownerInfo, isSubscribed: showSingleComment.isSubscribed, subscribers: showSingleComment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                    <div onClick={() => navigate(`/@${showSingleComment.ownerInfo.username}`)} className="flex h-11 w-11 shrink-0 cursor-pointer">
                                        <img
                                            src={setAvatar(showSingleComment.ownerInfo.avatar)}
                                            alt={`@${showSingleComment.ownerInfo.username}`}
                                            className="w-full h-full rounded-full object-cover" />
                                    </div>
                                </AccountHover>
                                <div className="block w-full">

                                    <div className="flex items-center">
                                        <AccountHover user={{ ...showSingleComment.ownerInfo, isSubscribed: showSingleComment.isSubscribed, subscribers: showSingleComment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                            <div onClick={() => navigate(`/@${showSingleComment.ownerInfo.username}`)} className={`flex items-center cursor-pointer ${(showSingleComment?.isVideoOwner || showSingleComment?.isTweetOwner) ? "bg-primary text-background font-bold rounded-md px-2" : ""}`}>
                                                {showSingleComment.ownerInfo.fullName} {showSingleComment.ownerInfo.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                                    <BadgeCheck title="verified" className={`w-5 h-5 fill-blue-600 inline-block ${(showSingleComment?.isVideoOwner || showSingleComment?.isTweetOwner) ? "text-primary" : "text-background"}`} />
                                                </span>}
                                            </div>
                                        </AccountHover>

                                        <span className="text-sm flex items-center before:content-['•'] before:px-1">{timeAgo(showSingleComment.createdAt)}</span>
                                        {showSingleComment.isEdited && <span className='text-sm ml-2'>(Edited)</span>}
                                    </div>
                                    <AccountHover user={{ ...showSingleComment.ownerInfo, isSubscribed: showSingleComment.isSubscribed, subscribers: showSingleComment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                        <div onClick={() => navigate(`/@${showSingleComment.ownerInfo.username}`)} className="text-sm w-min text-sidebar-foreground/85 cursor-pointer">@{showSingleComment.ownerInfo.username}</div>
                                    </AccountHover>

                                    <p ref={singleComment} className="mt-3 text-sm break-words break-all whitespace-pre-wrap w-full cursor-pointer" onClick={closeFullComment}>
                                        <ParseContents content={showSingleComment.content} />
                                    </p>
                                </div>
                            </div>
                            <hr className="my-4 border-primary" />
                        </div>
                    </div>
                </div>
            </>
        )
    } else {

        if (isMobile) {
            return (
                <div className="p-4 rounded-lg border border-primary/30 mb-3">

                    <div className="block">
                        <h6 className="mb-4 font-semibold">{formatNumbers(allComment.totalComments)} Comments</h6>
                    </div>
                    {isVideoPublic && <div className='relative'>
                        <textarea
                            aria-hidden="false"
                            rows="4"
                            name="comment"
                            type="text"
                            className="w-full resize-none border bg-transparent p-2 scroll-smooth scroll-m-0 text-sm border-zinc-500 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Add a Comment"
                            value={postComment}
                            autoComplete="off"
                            onChange={(e) => setPostComment(e.target.value)}
                            maxLength="900"
                            ref={textArea}
                        ></textarea>
                        <div className='flex items-center gap-3'>
                            <Button title="send" disabled={(postComment === "") || (postComment === editingComment?.content) ? true : false} onClick={handleCommentPost}>

                                {isCommentSubmitting ? <Loader height="24px" width="24px" className=
                                    "animate-spin fill-primary" /> : <SendHorizonal height="24px" width="24px" fill="primary" className="relative fill-primary" />}

                            </Button>
                            {isEditing && <Button title="cancel" onClick={handleCancelEdit}>
                                Cancel
                            </Button>}
                        </div>
                    </div>}
                    <hr className="mt-4 mb-2 border-primary" />
                    <div className={`relative ${(allComment.comments && allComment.comments.length !== 0)
                        ? "pt-10" : "pt-2"}`}>
                        <div className={`top-0 right-0 z-10 bg-background ${(allComment.comments && allComment.comments.length !== 0) ? "absolute" : "hidden"}`}>
                            <Select onValueChange={(e) => setSortType(e)} defaultValue={sortType}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="desc">Latest</SelectItem>
                                    <SelectItem value="asc">Oldest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {!showComment && (
                            <>
                                <div className='absolute z-[15] inset-0 flex items-start justify-center bg-background/70 bg-opacity-50'>
                                    <p className='w-full mt-10 flex justify-center'> <Loader height="24px" width="24px" className="animate-spin fill-primary" /> </p>
                                </div>
                            </>
                        )}

                        {allComment.comments ? allComment.comments.length !== 0 ? allComment.comments.map((comment, index) => {

                            if (allComment.comments.length === index + 1) {
                                return (
                                    <div key={comment._id} ref={lastCommentElementRef} className="block" id={comment._id}>
                                        <div className="flex xs:flex-row flex-col gap-x-4 relative">

                                            <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className="flex h-11 w-11 shrink-0 cursor-pointer">
                                                    <img
                                                        src={setAvatar(comment.ownerInfo.avatar)}
                                                        alt={`@${comment.ownerInfo.username}`}
                                                        className="w-full h-full rounded-full object-cover" />
                                                </div>
                                            </AccountHover>
                                            <div className="block w-full">

                                                <div className="flex items-center">
                                                    <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                        <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className={`flex items-center cursor-pointer ${(comment?.isVideoOwner || comment?.isTweetOwner) ? "bg-primary text-background font-bold rounded-md px-2 mt-1" : ""}`}>
                                                            {comment.ownerInfo.fullName} {comment.ownerInfo.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                                                <BadgeCheck title="verified" className={`w-5 h-5 fill-blue-600 inline-block ${(comment?.isVideoOwner || comment?.isTweetOwner) ? "text-primary" : "text-background"} `} />
                                                            </span>}
                                                        </div>
                                                    </AccountHover>

                                                    <span className="text-sm flex items-center before:content-['•'] before:px-1">{timeAgo(comment.createdAt)}</span>
                                                    {comment.isEdited && <span className='text-sm ml-2'>(Edited)</span>}
                                                </div>
                                                <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                    <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className="text-sm w-min text-sidebar-foreground/85 cursor-pointer">@{comment.ownerInfo.username}</div>
                                                </AccountHover>

                                                <p className="mt-3 text-sm break-words break-all whitespace-pre-wrap line-clamp-5 w-full cursor-pointer" onClick={() => showFullComment(comment)}>
                                                    <ParseContents content={comment.content} />
                                                </p>
                                            </div>

                                            {(comment.isCommentOwner && isVideoPublic) && < CommentOptions sortType={sortType} commentType={commentType} textarea={textArea} currentComment={comment} setEditingComment={setEditingComment} setIsEditing={setIsEditing} setPostComment={setPostComment} parentContentId={parentContentId} setAllComment={setAllComment} />}

                                        </div>
                                        <hr className="my-4 border-primary" />
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={comment._id} className="block" id={comment._id}>
                                        <div className="flex xs:flex-row flex-col gap-x-4 relative">

                                            <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className="flex h-11 w-11 shrink-0 cursor-pointer">
                                                    <img
                                                        src={setAvatar(comment.ownerInfo.avatar)}
                                                        alt={`@${comment.ownerInfo.username}`}
                                                        className="w-full h-full rounded-full object-cover" />
                                                </div>
                                            </AccountHover>
                                            <div className="block w-full">

                                                <div className="flex items-center">
                                                    <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                        <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className={`flex items-center cursor-pointer ${(comment?.isVideoOwner || comment?.isTweetOwner) ? "bg-primary text-background font-bold rounded-md px-2 mt-1" : ""}`}>
                                                            {comment.ownerInfo.fullName} {comment.ownerInfo.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                                                <BadgeCheck title="verified" className={`w-5 h-5 fill-blue-600 inline-block ${(comment?.isVideoOwner || comment?.isTweetOwner) ? "text-primary" : " text-background"} `} />
                                                            </span>}
                                                        </div>
                                                    </AccountHover>

                                                    <span className="text-sm flex items-center before:content-['•'] before:px-1">{timeAgo(comment.createdAt)}</span>
                                                    {comment.isEdited && <span className='text-sm ml-2'>(Edited)</span>}
                                                </div>
                                                <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                    <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className="text-sm w-min text-sidebar-foreground/85 cursor-pointer">@{comment.ownerInfo.username}</div>
                                                </AccountHover>

                                                <p className="mt-3 text-sm break-words break-all whitespace-pre-wrap line-clamp-5 w-full cursor-pointer" onClick={() => showFullComment(comment)}>
                                                    <ParseContents content={comment.content} />
                                                </p>
                                            </div>

                                            {(comment.isCommentOwner && isVideoPublic) && < CommentOptions sortType={sortType} commentType={commentType} textarea={textArea} currentComment={comment} setEditingComment={setEditingComment} setIsEditing={setIsEditing} setPostComment={setPostComment} parentContentId={parentContentId} setAllComment={setAllComment} />}

                                        </div>
                                        <hr className="my-4 border-primary" />
                                    </div>
                                )
                            }
                        }) : <h1>No comments available</h1> : <p className={`${!commentLoader ? "block" : "hidden"} w-full mb-3 flex justify-center`}>Something went wrong please try to refresh the page</p>}
                        {commentLoader && <p className='w-full flex justify-center'> <Loader height="24px" width="24px" className="animate-spin fill-primary" /> </p>
                        }

                    </div>
                </div>

            )
        } else {
            return (
                <>
                    <div className="bg-background border-primary/30 rounded-lg border p-4 duration-200 mb-3">
                        <div className="block">
                            <h6 className="mb-4 font-semibold">{formatNumbers(allComment.totalComments)} Comments</h6>
                            {isVideoPublic && <div className='relative'>
                                <textarea
                                    aria-hidden="false"
                                    rows="4"
                                    name="comment"
                                    type="text"
                                    className="w-full resize-none border bg-transparent p-2 scroll-smooth scroll-m-0 text-sm border-zinc-500 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Add a Comment"
                                    value={postComment}
                                    autoComplete="off"
                                    onChange={(e) => setPostComment(e.target.value)}
                                    maxLength="900"
                                    ref={textArea}
                                ></textarea>
                                <div className='flex items-center gap-3'>
                                    <Button title="send" disabled={(postComment === "") || (postComment === editingComment?.content) ? true : false} onClick={handleCommentPost}>

                                        {isCommentSubmitting ? <Loader height="24px" width="24px" className=
                                            "animate-spin fill-primary" /> : <SendHorizonal height="24px" width="24px" fill="primary" className="relative fill-primary" />}

                                    </Button>
                                    {isEditing && <Button title="Cancel" onClick={handleCancelEdit}>
                                        Cancel
                                    </Button>}
                                </div>
                            </div>}
                        </div>
                        <hr className="mt-4 mb-2 border-primary" />
                        <div className={`relative ${(allComment.comments && allComment.comments.length !== 0)
                            ? "pt-10" : "pt-2"}`}>
                            <div className={`top-0 right-0 z-10 bg-background ${(allComment.comments && allComment.comments.length !== 0) ? "absolute" : "hidden"}`}>
                                <Select onValueChange={(e) => setSortType(e)} defaultValue={sortType}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Sort" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="desc">Latest</SelectItem>
                                        <SelectItem value="asc">Oldest</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {!showComment && (
                                <>
                                    <div className='absolute z-[15] inset-0 flex items-start justify-center bg-background/70 bg-opacity-50'>
                                        <p className='w-full mt-10 flex justify-center'> <Loader height="24px" width="24px" className="animate-spin fill-primary" /> </p>
                                    </div>
                                </>
                            )}

                            {allComment.comments ? allComment.comments.length !== 0 ? allComment.comments.map((comment, index) => {

                                if (allComment.comments.length === index + 1) {
                                    return (
                                        <div key={comment._id} ref={lastCommentElementRef} className="block" id={comment._id}>
                                            <div className="flex xs:flex-row flex-col gap-x-4 relative">

                                                <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                    <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className="flex h-11 w-11 shrink-0 cursor-pointer">
                                                        <img
                                                            src={setAvatar(comment.ownerInfo.avatar)}
                                                            alt={`@${comment.ownerInfo.username}`}
                                                            className="w-full h-full rounded-full object-cover" />
                                                    </div>
                                                </AccountHover>
                                                <div className="block w-full">

                                                    <div className="flex items-center">
                                                        <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                            <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className={`flex items-center cursor-pointer ${(comment?.isVideoOwner || comment?.isTweetOwner) ? "bg-primary text-background font-bold rounded-md px-2" : ""}`}>
                                                                {comment.ownerInfo.fullName} {comment.ownerInfo.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                                                    <BadgeCheck title="verified" className={`w-5 h-5 fill-blue-600 inline-block ${(comment?.isVideoOwner || comment?.isTweetOwner) ? "text-primary" : "text-background"}`} />
                                                                </span>}
                                                            </div>
                                                        </AccountHover>

                                                        <span className="text-sm flex items-center before:content-['•'] before:px-1">{timeAgo(comment.createdAt)}</span>
                                                        {comment.isEdited && <span className='text-sm ml-2'>(Edited)</span>}
                                                    </div>
                                                    <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                        <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className="text-sm w-min text-sidebar-foreground/85 cursor-pointer">@{comment.ownerInfo.username}</div>
                                                    </AccountHover>

                                                    <p className="mt-3 text-sm break-words break-all whitespace-pre-wrap pr-10 line-clamp-5 w-full cursor-pointer" onClick={() => showFullComment(comment)}>
                                                        <ParseContents content={comment.content} />
                                                    </p>
                                                </div>

                                                {(comment.isCommentOwner && isVideoPublic) && < CommentOptions sortType={sortType} commentType={commentType} textarea={textArea} currentComment={comment} setEditingComment={setEditingComment} setIsEditing={setIsEditing} setPostComment={setPostComment} parentContentId={parentContentId} setAllComment={setAllComment} />}

                                            </div>
                                            <hr className="my-4 border-primary" />
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div key={comment._id} className="block" id={comment._id}>
                                            <div className="flex xs:flex-row flex-col gap-x-4 relative">

                                                <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                    <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className="flex h-11 w-11 shrink-0 cursor-pointer">
                                                        <img
                                                            src={setAvatar(comment.ownerInfo.avatar)}
                                                            alt={`@${comment.ownerInfo.username}`}
                                                            className="w-full h-full rounded-full object-cover" />
                                                    </div>
                                                </AccountHover>
                                                <div className="w-full block">

                                                    <div className="flex items-center">
                                                        <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                            <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className={`flex items-center cursor-pointer ${(comment?.isVideoOwner || comment?.isTweetOwner) ? "bg-primary text-background font-bold rounded-md px-2" : ""}`}>
                                                                {comment.ownerInfo.fullName} {comment.ownerInfo.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                                                    <BadgeCheck title="verified" className={`w-5 h-5 fill-blue-600 ${(comment?.isVideoOwner || comment?.isTweetOwner) ? "text-primary" : "text-background"} inline-block `} />
                                                                </span>}
                                                            </div>
                                                        </AccountHover>

                                                        <span className="text-sm flex items-center before:content-['•'] before:px-1">{timeAgo(comment.createdAt)}</span>
                                                        {comment.isEdited && <span className='text-sm ml-2'>(Edited)</span>}
                                                    </div>
                                                    <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                        <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className="text-sm w-min text-sidebar-foreground/85 cursor-pointer">@{comment.ownerInfo.username}</div>
                                                    </AccountHover>

                                                    <p className="mt-3 text-sm break-words break-all whitespace-pre-wrap pr-10 line-clamp-5 cursor-pointer w-full" onClick={() => showFullComment(comment)}>
                                                        <ParseContents content={comment.content} />
                                                    </p>
                                                </div>

                                                {(comment.isCommentOwner && isVideoPublic) && < CommentOptions sortType={sortType} commentType={commentType} textarea={textArea} currentComment={comment} setEditingComment={setEditingComment} setIsEditing={setIsEditing} setPostComment={setPostComment} parentContentId={parentContentId} setAllComment={setAllComment} />}

                                            </div>
                                            <hr className="my-4 border-primary" />
                                        </div>
                                    )
                                }
                            }) : <h1>No comments available</h1> : <p className={`${!commentLoader ? "block" : "hidden"} w-full mb-3 flex justify-center`}>Something went wrong please try to refresh the page</p>}
                            {commentLoader && <p className='w-full flex justify-center'> <Loader height="24px" width="24px" className="animate-spin fill-primary" /> </p>
                            }

                        </div>
                    </div>
                </>
            )
        }

    }

}

export default Comments
