import { useState, useEffect, useCallback, useRef } from 'react'
import formatNumbers from '../utils/formatNumber.js'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'
import setAvatar from '../utils/setAvatar.js'
import { BadgeCheck, SendHorizonal, Loader } from 'lucide-react'
import { Button, CommentOptions, AccountHover } from "./index.js"
import { timeAgo } from '../utils/timeAgo.js'
import { useNavigate } from 'react-router-dom'
import { useIsMobile } from "../hooks/use-mobile.jsx"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerOverlay,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

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
    const navigate = useNavigate()

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

    const handleEnter = (e) => {
        if ((e.key === "Enter" && !e.nativeEvent.shiftKey) && postComment && !isCommentSubmitting) {
            handleVideoComment();
        }
    };

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
        setCommentLoader(true)
        if (page > allComment?.totalPages) {
            setCommentLoader(false)
            return;
        }

        axios.get(`/comment/v/${parentContentId}?page=${page}&sortType=desc`)
            .then((res) => {
                if (allComment.comments) {
                    setCommentLoader(false)
                    setAllComment({ ...allComment, comments: [...allComment.comments, ...res.data.data.comments] })
                } else {
                    setCommentLoader(false)
                    setAllComment(res.data.data)
                }
            })
            .catch((error) => {
                setCommentLoader(false)
                console.error(error.message);
            });

    }, [page])

    const [open, setOpen] = useState(false);
    // const isMobile = useIsMobile(); 

    if (isMobile) {
        return (
            <Drawer shouldScaleBackground={false} modal={false} >
                <DrawerTrigger className="peer w-full border-primary/30 rounded-lg border p-4 text-left text-primary duration-200">
                    <h6 className="font-semibold">{formatNumbers(allComment.totalComments)} Comments ...</h6>
                </DrawerTrigger>
                <DrawerContent className="pointer-events-auto">
                    {/* <DrawerHeader>
                        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                        <DrawerDescription>This action cannot be undone.</DrawerDescription>
                    </DrawerHeader> */}

                    <div
                        className="p-4 max-h-[150px] overflow-x-auto">
                        <div className="block">
                            <h6 className="mb-4 font-semibold">{formatNumbers(allComment.totalComments)} Comments</h6>
                        </div>
                        <hr className="my-4 border-white" />
                        <div className='overflow-y-auto max-h-[75.7%]'>

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

                                                    <p className="mt-3 text-sm whitespace-pre-wrap line-clamp-5">{comment.content}</p>
                                                </div>

                                                {comment.isCommentOwner && < CommentOptions textarea={textArea} currentComment={comment} editingComment={setEditingComment} isEditing={setIsEditing} setComment={setPostComment} parentContentId={parentContentId} setAllComment={setAllComment} />}

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

                                                    <p className="mt-3 text-sm whitespace-pre-wrap line-clamp-5">{comment.content}</p>
                                                </div>

                                                {comment.isCommentOwner && < CommentOptions textarea={textArea} currentComment={comment} editingComment={setEditingComment} isEditing={setIsEditing} setComment={setPostComment} parentContentId={parentContentId} setAllComment={setAllComment} />}

                                            </div>
                                            <hr className="my-4 border-primary" />
                                        </div>
                                    )
                                }
                            }) : <h1>No comments available</h1> : <p className='w-full mb-3 flex justify-center'>Something went wrong please try to refresh the page</p>}
                            {commentLoader && <p className='w-full flex justify-center'> <Loader height="24px" width="24px" className="animate-spin fill-primary" /> </p>
                            }

                        </div>
                        
                        <div className='sticky bottom-0'>
                                <textarea
                                    type="text"
                                    className="w-full resize-none h-auto max-h-20 rounded-lg border bg-transparent border-primary/90 p-2 scroll-smooth scroll-m-0 placeholder-primary"
                                    placeholder="Add a Comment"
                                    value={postComment}
                                    autoComplete="off"
                                    onChange={(e) => setPostComment(e.target.value)}
                                    onKeyDown={handleEnter}
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


                    {/* <DrawerFooter>
                        <Button>Submit</Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter> */}
                </DrawerContent>
            </Drawer>
        )
    }


    return (
        <>
            <button type='button' className="peer w-full border-primary/30 rounded-lg border p-4 text-left text-primary duration-200 sm:hidden"><h6 className="font-semibold">{formatNumbers(allComment.totalComments)} Comments ...</h6></button>
            <div
                className="fixed bg-background border-primary/30 inset-x-0 top-full z-[60] h-[calc(100%-69px)] overflow-auto rounded-lg border p-4 duration-200 hover:top-[67px] peer-focus:top-[67px] sm:static sm:h-auto sm:max-h-[500px] lg:max-h-none">
                <div className="block">
                    <h6 className="mb-4 font-semibold">{formatNumbers(allComment.totalComments)} Comments</h6>
                    <div className='relative'>
                        <textarea
                            type="text"
                            className="w-full resize-none h-auto max-h-20 rounded-lg border bg-transparent border-primary/90 p-2 scroll-smooth scroll-m-0 placeholder-primary"
                            placeholder="Add a Comment"
                            value={postComment}
                            autoComplete="off"
                            onChange={(e) => setPostComment(e.target.value)}
                            onKeyDown={handleEnter}
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
                <hr className="my-4 border-white" />
                <div className='overflow-y-auto max-h-[75.7%]'>

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

                                            <p className="mt-3 text-sm whitespace-pre-wrap line-clamp-5">{comment.content}</p>
                                        </div>

                                        {comment.isCommentOwner && < CommentOptions textarea={textArea} currentComment={comment} editingComment={setEditingComment} isEditing={setIsEditing} setComment={setPostComment} parentContentId={parentContentId} setAllComment={setAllComment} />}

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

                                            <p className="mt-3 text-sm whitespace-pre-wrap line-clamp-5">{comment.content}</p>
                                        </div>

                                        {comment.isCommentOwner && < CommentOptions textarea={textArea} currentComment={comment} editingComment={setEditingComment} isEditing={setIsEditing} setComment={setPostComment} parentContentId={parentContentId} setAllComment={setAllComment} />}

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

export default Comments
