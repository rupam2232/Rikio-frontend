import { useState, useEffect, useCallback, useRef } from 'react'
import formatNumbers from '../utils/formatNumber.js'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'
import setAvatar from '../utils/setAvatar.js'
import { timeAgo } from '../utils/timeAgo.js'
import { BadgeCheck, SendHorizonal, Loader } from 'lucide-react'
import { Button, CommentOptions, AccountHover, ParseContents } from "./index.js"
import { useNavigate } from 'react-router-dom'
import { useIsMobile } from "../hooks/use-mobile.jsx"
import toast from "react-hot-toast"
import { useDispatch } from 'react-redux'
import { logout } from '../store/authSlice.js'

const Comments = ({
    parentContentId,
    toggleSubscribe,
    allComment,
    setAllComment
}) => {
    const [commentLoader, setCommentLoader] = useState(false)
    const [postComment, setPostComment] = useState("")
    const [isCommentSubmitting, setIsCommentSubmitting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editingComment, setEditingComment] = useState({})
    const [page, setPage] = useState(1)
    const observer = useRef()
    const textArea = useRef()
    const isFetching = useRef(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const isMobile = useIsMobile()

    const handleVideoComment = () => {
        setIsCommentSubmitting(true)
        if (!isEditing) {
            axios.post(`/comment/v/${parentContentId}`, { content: postComment })
                .then((_) => {
                    setPostComment("")
                    axios.get(`/comment/v/${parentContentId}`)
                        .then((value) => {
                            setAllComment(value.data.data);
                        })
                        .catch((error) => {
                            console.error(error.message);
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
                    setPostComment("")
                    setIsEditing(false)
                    axios.get(`/comment/v/${parentContentId}`)
                        .then((value) => {
                            setAllComment(value.data.data);
                        })
                        .catch((error) => {
                            console.error(error.message);
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
        }
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setPostComment("")
    }

    // const handleEnter = (e) => {
    //     if ((e.key === "Enter" && !e.nativeEvent.shiftKey) && postComment && !isCommentSubmitting) {
    //         handleVideoComment();
    //     }
    // };

    const lastBookElementRef = useCallback(node => {
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
            setCommentLoader(true)
            
            isFetching.current = true;
            axios.get(`/comment/v/${parentContentId}?page=${page}&sortType=desc`)
                .then((res) => {
                    if (allComment.comments) {
                        setAllComment({
                            ...allComment, comments: [...allComment.comments,
                            ...res.data.data.comments.filter(
                                (newComment) =>
                                    !allComment.comments.some(
                                        (existingComment) => existingComment._id === newComment._id
                                    )
                            ),]
                        })
                    } else {
                        setAllComment(res.data.data)
                    }
                })
                .catch((error) => {
                    console.error(error.message);
                })
                .finally(() => {
                    isFetching.current = false;
                    setCommentLoader(false)
                })
        }
        fetchComments();

    }, [page])

    if (isMobile) {
        return (
            <div
                className="p-4 rounded-lg border border-primary/30">

                <div className="block">
                    <h6 className="mb-4 font-semibold">{formatNumbers(allComment.totalComments)} Comments</h6>
                </div>
                <div className='relative'>
                    <textarea
                        aria-hidden="false"
                        type="text"
                        className="w-full resize-none h-28 rounded-lg border bg-transparent border-primary/90 p-2 scroll-smooth scroll-m-0 placeholder-primary"
                        placeholder="Add a Comment"
                        value={postComment}
                        autoComplete="off"
                        onChange={(e) => setPostComment(e.target.value)}
                        maxLength="900"
                        ref={textArea}
                    />
                    <div className='flex items-center gap-3'>
                        <Button title="send" disabled={(postComment === "") || (postComment === editingComment?.content) ? true : false} onClick={handleVideoComment}>

                            {isCommentSubmitting ? <Loader height="24px" width="24px" className=
                                "animate-spin fill-primary" /> : <SendHorizonal height="24px" width="24px" fill="primary" className="relative fill-primary" />}

                        </Button>
                        {isEditing && <Button title="cancel" onClick={handleCancelEdit}>
                            cancel
                        </Button>}
                    </div>
                </div>
                <hr className="my-4 border-primary" />
                <div className=''>

                    {allComment.comments ? allComment.comments.length !== 0 ? allComment.comments.map((comment, index) => {

                        if (allComment.comments.length === index + 1) {
                            return (
                                <div key={comment._id} ref={lastBookElementRef} className="block">
                                    <div className="flex xs:flex-row flex-col gap-x-4 relative">

                                        <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                            <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className="flex h-11 w-11 shrink-0 cursor-pointer">
                                                <img
                                                    src={setAvatar(comment.ownerInfo.avatar)}
                                                    alt={`@${comment.ownerInfo.username}`}
                                                    className="w-full h-full rounded-full object-cover" />
                                            </div>
                                        </AccountHover>
                                        <div className="block">

                                            <div className="flex items-center">
                                                <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                    <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className={`flex items-center cursor-pointer ${comment.isVideoOwner ? "font-bold" : ""}`}>
                                                        {comment.ownerInfo.fullName} {comment.ownerInfo.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                                            <BadgeCheck title="verified" className='w-5 h-5 fill-blue-600 text-background inline-block ' />
                                                        </span>}
                                                    </div>
                                                </AccountHover>

                                                <span className="text-sm flex items-center before:content-['•'] before:px-1">{timeAgo(comment.createdAt)}</span>
                                                {comment.isEdited && <span className='text-sm ml-2'>(Edited)</span>}
                                            </div>
                                            <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className="text-sm w-min text-sidebar-foreground/85 cursor-pointer">@{comment.ownerInfo.username}</div>
                                            </AccountHover>

                                            <p className="mt-3 text-sm break-words break-all whitespace-pre-wrap line-clamp-5">
                                                <ParseContents content={comment.content} />
                                            </p>
                                        </div>

                                        {comment.isCommentOwner && < CommentOptions textarea={textArea} currentComment={comment} setEditingComment={setEditingComment} setIsEditing={setIsEditing} setPostComment={setPostComment} parentContentId={parentContentId} setAllComment={setAllComment} />}

                                    </div>
                                    <hr className="my-4 border-primary" />
                                </div>
                            )
                        } else {
                            return (
                                <div key={comment._id} className="block">
                                    <div className="flex xs:flex-row flex-col gap-x-4 relative">

                                        <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                            <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className="flex h-11 w-11 shrink-0 cursor-pointer">
                                                <img
                                                    src={setAvatar(comment.ownerInfo.avatar)}
                                                    alt={`@${comment.ownerInfo.username}`}
                                                    className="w-full h-full rounded-full object-cover" />
                                            </div>
                                        </AccountHover>
                                        <div className="block">

                                            <div className="flex items-center">
                                                <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                    <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className={`flex items-center cursor-pointer ${comment.isVideoOwner ? "font-bold" : ""}`}>
                                                        {comment.ownerInfo.fullName} {comment.ownerInfo.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                                            <BadgeCheck title="verified" className='w-5 h-5 fill-blue-600 text-background inline-block ' />
                                                        </span>}
                                                    </div>
                                                </AccountHover>

                                                <span className="text-sm flex items-center before:content-['•'] before:px-1">{timeAgo(comment.createdAt)}</span>
                                                {comment.isEdited && <span className='text-sm ml-2'>(Edited)</span>}
                                            </div>
                                            <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className="text-sm w-min text-sidebar-foreground/85 cursor-pointer">@{comment.ownerInfo.username}</div>
                                            </AccountHover>

                                            <p className="mt-3 text-sm break-words break-all whitespace-pre-wrap line-clamp-5">
                                                <ParseContents content={comment.content} />
                                            </p>
                                        </div>

                                        {comment.isCommentOwner && < CommentOptions textarea={textArea} currentComment={comment} setEditingComment={setEditingComment} setIsEditing={setIsEditing} setPostComment={setPostComment} parentContentId={parentContentId} setAllComment={setAllComment} />}

                                    </div>
                                    <hr className="my-4 border-primary" />
                                </div>
                            )
                        }
                    }) : <h1>No comments available</h1> : <p className='w-full mb-3 flex justify-center'>Something went wrong please try to refresh the page</p>}
                    {commentLoader && <p className='w-full flex justify-center'> <Loader height="24px" width="24px" className="animate-spin fill-primary" /> </p>
                    }

                </div>
            </div>

        )
    } else {
        return (
            <>
                <button type='button' className="w-full border-primary/30 rounded-lg border p-4 text-left text-primary duration-200 hidden"><h6 className="font-semibold">{formatNumbers(allComment.totalComments)} Comments ...</h6></button>
                <div
                    className="bg-background border-primary/30 rounded-lg border p-4 duration-200">
                    <div className="block">
                        <h6 className="mb-4 font-semibold">{formatNumbers(allComment.totalComments)} Comments</h6>
                        <div className='relative'>
                            <textarea
                                aria-hidden="false"
                                type="text"
                                className="w-full resize-none h-auto max-h-20 rounded-lg border bg-transparent border-primary/90 p-2 scroll-smooth scroll-m-0 placeholder-primary"
                                placeholder="Add a Comment"
                                value={postComment}
                                autoComplete="off"
                                onChange={(e) => setPostComment(e.target.value)}
                                maxLength="900"
                                ref={textArea}
                            />
                            <div className='flex items-center gap-3'>
                                <Button title="send" disabled={(postComment === "") || (postComment === editingComment?.content) ? true : false} onClick={handleVideoComment}>

                                    {isCommentSubmitting ? <Loader height="24px" width="24px" className=
                                        "animate-spin fill-primary" /> : <SendHorizonal height="24px" width="24px" fill="primary" className="relative fill-primary" />}

                                </Button>
                                {isEditing && <Button title="cancel" onClick={handleCancelEdit}>
                                    cancel
                                </Button>}
                            </div>
                        </div>
                    </div>
                    <hr className="my-4 border-primary" />
                    <div>

                        {allComment.comments ? allComment.comments.length !== 0 ? allComment.comments.map((comment, index) => {

                            if (allComment.comments.length === index + 1) {
                                return (
                                    <div key={comment._id} ref={lastBookElementRef} className="block">
                                        <div className="flex xs:flex-row flex-col gap-x-4 relative">

                                            <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className="flex h-11 w-11 shrink-0 cursor-pointer">
                                                    <img
                                                        src={setAvatar(comment.ownerInfo.avatar)}
                                                        alt={`@${comment.ownerInfo.username}`}
                                                        className="w-full h-full rounded-full object-cover" />
                                                </div>
                                            </AccountHover>
                                            <div className="block">

                                                <div className="flex items-center">
                                                    <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                        <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className={`flex items-center cursor-pointer ${comment.isVideoOwner ? "font-bold" : ""}`}>
                                                            {comment.ownerInfo.fullName} {comment.ownerInfo.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                                                <BadgeCheck title="verified" className='w-5 h-5 fill-blue-600 text-background inline-block ' />
                                                            </span>}
                                                        </div>
                                                    </AccountHover>

                                                    <span className="text-sm flex items-center before:content-['•'] before:px-1">{timeAgo(comment.createdAt)}</span>
                                                    {comment.isEdited && <span className='text-sm ml-2'>(Edited)</span>}
                                                </div>
                                                <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                    <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className="text-sm w-min text-sidebar-foreground/85 cursor-pointer">@{comment.ownerInfo.username}</div>
                                                </AccountHover>

                                                <p className="mt-3 text-sm break-words break-all whitespace-pre-wrap line-clamp-5">
                                                    <ParseContents content={comment.content} />
                                                </p>
                                            </div>

                                            {comment.isCommentOwner && < CommentOptions textarea={textArea} currentComment={comment} setEditingComment={setEditingComment} setIsEditing={setIsEditing} setPostComment={setPostComment} parentContentId={parentContentId} setAllComment={setAllComment} />}

                                        </div>
                                        <hr className="my-4 border-primary" />
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={comment._id} className="block">
                                        <div className="flex xs:flex-row flex-col gap-x-4 relative">

                                            <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className="flex h-11 w-11 shrink-0 cursor-pointer">
                                                    <img
                                                        src={setAvatar(comment.ownerInfo.avatar)}
                                                        alt={`@${comment.ownerInfo.username}`}
                                                        className="w-full h-full rounded-full object-cover" />
                                                </div>
                                            </AccountHover>
                                            <div className="block">

                                                <div className="flex items-center">
                                                    <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                        <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className={`flex items-center cursor-pointer ${comment.isVideoOwner ? "font-bold" : ""}`}>
                                                            {comment.ownerInfo.fullName} {comment.ownerInfo.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                                                <BadgeCheck title="verified" className='w-5 h-5 fill-blue-600 text-background inline-block ' />
                                                            </span>}
                                                        </div>
                                                    </AccountHover>

                                                    <span className="text-sm flex items-center before:content-['•'] before:px-1">{timeAgo(comment.createdAt)}</span>
                                                    {comment.isEdited && <span className='text-sm ml-2'>(Edited)</span>}
                                                </div>
                                                <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                    <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className="text-sm w-min text-sidebar-foreground/85 cursor-pointer">@{comment.ownerInfo.username}</div>
                                                </AccountHover>

                                                <p className="mt-3 text-sm break-words break-all whitespace-pre-wrap line-clamp-5">
                                                    <ParseContents content={comment.content} />
                                                </p>
                                            </div>

                                            {comment.isCommentOwner && < CommentOptions textarea={textArea} currentComment={comment} setEditingComment={setEditingComment} setIsEditing={setIsEditing} setPostComment={setPostComment} parentContentId={parentContentId} setAllComment={setAllComment} />}

                                        </div>
                                        <hr className="my-4 border-primary" />
                                    </div>
                                )
                            }
                        }) : <h1>No comments available</h1> : <p className='w-full mb-3 flex justify-center'>Something went wrong please try to refresh the page</p>}
                        {commentLoader && <p className='w-full flex justify-center'> <Loader height="24px" width="24px" className="animate-spin fill-primary" /> </p>
                        }

                    </div>
                </div>
            </>
        )
    }

}

export default Comments
