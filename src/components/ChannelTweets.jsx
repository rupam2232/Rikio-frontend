import { useState, useEffect, useRef, useCallback } from 'react'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'
import setAvatar from '../utils/setAvatar.js'
import formatNumbers from '../utils/formatNumber.js'
import toast from 'react-hot-toast'
import { EditIcon, ImagePlus, Loader, LoaderCircle, MessageSquareTextIcon, PencilLine, Trash2 } from 'lucide-react'
import { timeAgo } from '../utils/timeAgo.js'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Like, ParseContents } from './index.js'
import { logout } from '../store/authSlice.js'
import { useNavigate, NavLink } from 'react-router-dom'
import { useIsMobile } from '@/hooks/use-mobile.jsx'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const ChannelTweets = ({ channelData }) => {
    const [tweetInput, setTweetInput] = useState("")
    const [tweets, setTweets] = useState([])
    const [isTweetEditing, setIsTweetEditing] = useState(false)
    const [editingTweet, setEditingTweet] = useState(null)
    const [editingTweetImages, setEditingTweetImages] = useState([])
    const [refetchTweets, setRefetchTweets] = useState(false)
    const [loader, setLoader] = useState(true)
    const [tweetLoader, setTweetLoader] = useState(false)
    const [totalPages, setTotalPages] = useState(null)
    const [page, setPage] = useState(1)
    const [sortType, setSortType] = useState("desc")
    const [error, setError] = useState(null)
    const [pageLoader, setPageLoader] = useState(false)
    const [optionLoader, setOptionLoader] = useState(false)
    const [isTextAreaFocused, setIsTextAreaFocused] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [diableSubmitBtn, setDiableSubmitBtn] = useState(true)
    const MAX_IMAGES = 4;
    const isUserLoggedin = useSelector((state) => state.auth.status)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const textAreaRef = useRef()
    const isFetching = useRef(false);
    const observer = useRef();
    const isMobile = useIsMobile();

    useEffect(() => {
        setLoader(true)
        axios.get(`/tweet/${channelData._id}/?&sortType=${sortType}`)
            .then((res) => {
                setTweets(res.data.data.tweets)
                setTotalPages(res.data.data.totalPages)
                setPage(1)
            })
            .catch((err) => {
                console.error(errorMessage(err))
                toast.error(errorMessage(err), {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
            })
            .finally(() => {
                setLoader(false)
            })
    }, [refetchTweets, sortType])

    useEffect(() => {
        if ((totalPages && page > totalPages) || page <= 1 || isFetching.current === true || tweets.length === 0) {
            return;
        }
        isFetching.current = true;
        setPageLoader(true)
        axios.get(`/tweet/${channelData._id}/?page=${page}&sortType=${sortType}`)
            .then((res) => {
                setTweets([...tweets, ...res.data.data.tweets.filter((twet) =>
                    !tweets.some((t) =>
                        t._id === twet._id
                    ))])
                setTotalPages(res.data.data.totalPages)
            })
            .catch((err) => {
                console.error(errorMessage(err))
                toast.error(errorMessage(err), {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
            })
            .finally(() => {
                isFetching.current = false;
                setPageLoader(false)
            })
    }, [page])

    const postTweet = (e) => {
        e.preventDefault();
        setError("")
        if (!isUserLoggedin) {
            toast.error("You need to login first", {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            navigate("/login")
            return;
        }
        if (tweetLoader) return;
        if (diableSubmitBtn) {
            toast.error("Please make correct changes to preceed", {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            return;
        }
        if (isTweetEditing) {
            if (tweetInput.trim() === "" && selectedImages.length === 0 && editingTweet.content.image.length === 0) {
                toast.error("Please enter some input to tweet", {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
                return;
            }

            if (tweetInput.length > 400) {
                toast.error("Please write the tweet under 400 words", {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
                return;
            }
            setTweetLoader(true)

            const formData = new FormData();
            selectedImages.forEach((image) => {
                formData.append('images', image);
            });

            formData.append('textContent', tweetInput.trim());

            editingTweet.content.image.forEach(img => {
                formData.append('allImage', img)
            });

            axios.patch(`/tweet/${editingTweet._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then((res) => {
                    setRefetchTweets(!refetchTweets)
                    toast.success(res.data.message, {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                    setSelectedImages([])
                    setTweetInput("")
                    setIsTweetEditing(false)
                })
                .catch((err) => {
                    console.error(errorMessage(err))
                    if (err.status === 401) {
                        toast.error("You need to login first", {
                            style: { color: "#ffffff", backgroundColor: "#333333" },
                            position: "top-center"
                        })
                        dispatch(logout())
                        navigate("/login")
                    } else {
                        toast.error(errorMessage(err), {
                            style: { color: "#ffffff", backgroundColor: "#333333" },
                            position: "top-center"
                        })
                    }
                })
                .finally(() => {
                    setTweetLoader(false)
                })

        } else {
            if (tweetInput.trim() === "" && selectedImages.length === 0) {
                toast.error("Please enter some input to tweet", {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
                return;
            }
            if (tweetInput.length > 400) {
                toast.error("Please write the tweet under 400 words", {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
                return;
            }

            setTweetLoader(true)

            const formData = new FormData();
            selectedImages.forEach((image) => {
                formData.append('images', image);
            });
            formData.append('textContent', tweetInput.trim());

            axios.post("/tweet", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then((res) => {
                    setRefetchTweets(!refetchTweets)
                    toast.success(res.data.message, {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                    setSelectedImages([])
                    setTweetInput("")
                })
                .catch((err) => {
                    console.error(errorMessage(err))
                    if (err.status === 401) {
                        toast.error("You need to login first", {
                            style: { color: "#ffffff", backgroundColor: "#333333" },
                            position: "top-center"
                        })
                        dispatch(logout())
                        navigate("/login")
                    } else {
                        toast.error(errorMessage(err), {
                            style: { color: "#ffffff", backgroundColor: "#333333" },
                            position: "top-center"
                        })
                    }
                })
                .finally(() => {
                    setTweetLoader(false)
                })

        }
    }

    const toggleLike = (tweetId) => {
        if (!isUserLoggedin) {
            toast.error("You need to login first", {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            navigate("/login")
            return;
        }
        setTweets((prevTweets) => {
            return prevTweets.map((tweet) => {
                if (tweet._id === tweetId) {
                    return { ...tweet, isLiked: !tweet.isLiked }
                }
                return tweet
            })
        })
        axios.post(`/like/toggle/t/${tweetId}`)
            .then((res) => {
                if (res.data.data) {
                    setTweets((prevTweets) => {
                        return prevTweets.map((tweet) => {
                            if (tweet._id === tweetId) {
                                return { ...tweet, isLiked: res.data.data, totalLikes: tweet.totalLikes + 1 }
                            }
                            return tweet
                        })
                    })
                } else {
                    setTweets((prevTweets) => {
                        return prevTweets.map((tweet) => {
                            if (tweet._id === tweetId) {
                                return { ...tweet, isLiked: res.data.data, totalLikes: tweet.totalLikes - 1 }
                            }
                            return tweet
                        })
                    })
                }
            })
            .catch((err) => {
                console.error(errorMessage(err))
                if (err.status === 401) {
                    toast.error("You need to login first", {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                    dispatch(logout())
                    navigate("/login")
                } else {
                    toast.error(errorMessage(err), {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                }
            })
    }

    const deleteTweet = (tweetId) => {
        if (!isUserLoggedin) {
            toast.error("You need to login first", {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            navigate("/login")
            return;
        }
        setOptionLoader(true)
        axios.delete(`/tweet/${tweetId}`)
            .then((res) => {
                setRefetchTweets(!refetchTweets)
                toast.success(res.data.message, {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
            })
            .catch((err) => {
                console.error(errorMessage(err))
                if (err.status === 401) {
                    toast.error("You need to login first", {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                    dispatch(logout())
                    navigate("/login")
                } else {
                    toast.error(errorMessage(err), {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                }
            })
            .finally(() => {
                setOptionLoader(false)
            })
    }

    const editTweet = (tweet) => {
        setSelectedImages([])
        setEditingTweet(tweet)
        setEditingTweetImages(tweet.content.image)
        setIsTweetEditing(true)
        setTweetInput(tweet.content.textContent ? tweet.content.textContent : "")
        setTimeout(() => {
            if (textAreaRef.current) textAreaRef.current.focus();
        }, 500);
    }

    const handleCancelEditing = () => {
        setSelectedImages([])
        setEditingTweet(null)
        setIsTweetEditing(false)
        setEditingTweetImages([])
        setTweetInput("")
    }

    const handleImageChange = (event) => {
        const files = [...event.target.files];
        const imageArray = [];
        setError("")

        for (let i = 0; i < files.length; i++) {
            if (files[i].size > 1024 * 1024) {
                setError(`File "${files[i].name}" exceeds 1MB.`);
            } else {
                imageArray.push(files[i]);
            }
        }

        if (selectedImages.length + imageArray.length > MAX_IMAGES) {
            setError(`You can only upload a maximum of ${MAX_IMAGES} images.`);
            return;
        }

        if (isTweetEditing && editingTweet.content?.image.length + selectedImages.length + imageArray.length > MAX_IMAGES) {
            setError(`You can only upload a maximum of ${MAX_IMAGES} images.`)
            return;
        }

        setSelectedImages([...selectedImages, ...imageArray]);
    };

    const handleRemoveImage = (indexToRemove) => {
        setError("")
        setSelectedImages(selectedImages.filter((_, index) => index !== indexToRemove));
    };

    const handleRemoveEditingImage = (indexToRemove) => {
        setError("")
        setEditingTweet({ ...editingTweet, content: { ...editingTweet.content, image: editingTweet.content.image.filter((_, index) => index !== indexToRemove) } })
    }

    const lastTweetElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [])

    useEffect(() => {
        let editingTweetText = editingTweet?.content.textContent ? editingTweet.content.textContent.trim() : ""
        if (tweetLoader) {
            setDiableSubmitBtn(true);
        } else {
            if (isTweetEditing) {
                if (tweetInput.trim() === "" && selectedImages.length === 0 && editingTweet.content.image.length === 0) {
                    setDiableSubmitBtn(true);
                } else if ((tweetInput.trim() === editingTweetText) && editingTweetImages.every((img, index) => img === editingTweet.content.image[index]) && selectedImages.length === 0) {
                    setDiableSubmitBtn(true);
                } else {
                    setDiableSubmitBtn(false);
                }
            } else {
                if (tweetInput.trim() === "" && selectedImages.length === 0) {
                    setDiableSubmitBtn(true);
                } else {
                    setDiableSubmitBtn(false);
                }
            }
        }
    }, [isTweetEditing, tweetInput, selectedImages, tweetLoader, editingTweet, editingTweetImages])

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

    return (
        <div className='p-2 mt-2 mb-5 relative pt-12'>
            <div className='absolute top-0 right-0 z-20 bg-background'>
                <Select onValueChange={(e) => setSortType(e)} defaultValue={sortType}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                        <>
                            <SelectItem value="desc">Latest</SelectItem>
                            <SelectItem value="asc">Oldest</SelectItem>
                        </>
                    </SelectContent>
                </Select>
            </div>
            {(channelData.isChannelOwner && isUserLoggedin) && <form className='mb-6' onSubmit={(e) => postTweet(e)}>
                <div className={`border-zinc-500 border rounded-md ${isTextAreaFocused ? 'ring-1 ring-primary' : ''}`}>
                    <textarea rows="3" placeholder='Write a tweet' value={tweetInput} ref={textAreaRef} maxLength="400" onChange={(e) => setTweetInput(e.target.value)} onFocus={() => setIsTextAreaFocused(true)} onBlur={() => setIsTextAreaFocused(false)} className='bg-transparent w-full rounded-md resize-none p-3 outline-none border-none' />
                    <div>
                        <label htmlFor="pictures" title='upload image' className='ml-2 cursor-pointer inline-block px-2 py-2 rounded-md self-center hover:bg-accent'><ImagePlus className='size-5' /></label>
                        <input type="file" onChange={handleImageChange} name="pictures[]" id="pictures" accept='image/*' multiple className='hidden' />
                    </div>
                </div>
                <p className='text-sm text-primary/80'>{tweetInput.length}/400</p>
                {error && <p className='text-red-500 text-sm transition-opacity'>{error}</p>}
                <div className="flex flex-wrap">
                    {isTweetEditing && editingTweet.content?.image.map((image, index) => (
                        <div key={index} className="m-2 relative">
                            <img
                                src={image}
                                alt={`Selected Image ${index}`}
                                className="max-w-[150px] max-h-[150px]"
                            />
                            <button type='button'
                                onClick={() => handleRemoveEditingImage(index)}
                                className="absolute top-0 right-0 px-2 py-0 bg-red-500 text-white border-none cursor-pointer"
                            >
                                X
                            </button>
                        </div>
                    ))}
                    {selectedImages.map((image, index) => (
                        <div key={index} className="m-2 relative">
                            <img
                                src={URL.createObjectURL(image)}
                                alt={`Selected Image ${index}`}
                                className="max-w-[150px] max-h-[150px]"
                            />
                            <button type='button'
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-0 right-0 px-2 py-0 bg-red-500 text-white border-none cursor-pointer"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>

                <Button type="submit" className='mt-2' disabled={diableSubmitBtn}>{tweetLoader ? <Loader className='animate-spin' /> : isTweetEditing ? "Update" : "Tweet"}</Button>

                {isTweetEditing && <Button className="ml-3" title="Cancel" type="button" onClick={handleCancelEditing}>Cancel</Button>}

                <hr className='border-zinc-500 mt-3' />


            </form>}
            {tweets.length > 0 && tweets.map((tweet, index) => {
                if (tweets.length === index + 1) {
                    return (
                        <div key={tweet._id} ref={lastTweetElementRef} className='p-2 mb-2 rounded-md'>
                            <div className='flex justify-between'>
                                <div className='flex items-center gap-3'>
                                    <div className='flex items-center'>
                                        <img src={setAvatar(channelData.avatar)} alt={`@${channelData.username}`} className='w-10 h-10 rounded-full' />
                                        <div className='ml-2'>
                                            <h3 className='font-bold'>{channelData.fullName}</h3>
                                        </div>
                                    </div>
                                    <p className='text-xs'>{timeAgo(tweet.createdAt)}</p>
                                </div>
                                {(tweet.isTweetOwner && isUserLoggedin) && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild title='options'>
                                            <div className='flex cursor-pointer px-[15px] py-2 rounded-full transition-colors hover:bg-primary/30 flex-col gap-1 h-max w-max'>
                                                <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
                                                <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
                                                <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className={`min-w-min !z-30 ${optionLoader ? "!pointer-events-none opacity-70" : "pointer-events-auto"}`}>
                                            <DropdownMenuItem className="py-0 px-1 w-full">
                                                <Button className="bg-transparent w-max h-min text-primary shadow-none hover:bg-transparent hover:text-primary" onClick={() => editTweet(tweet)}>
                                                    <EditIcon />Edit
                                                </Button>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <AlertDialog>
                                                <AlertDialogTrigger className="py-0 px-0 w-max hover:bg-accent rounded-sm transition-colors ">
                                                    <div role="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-4 py-2 bg-transparent w-max h-min text-primary shadow-none hover:bg-transparent hover:text-primary text-red-600 hover:text-red-600" >
                                                        <Trash2 />Delete
                                                    </div>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete this tweet.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction className="text-red-600 bg-transparent shadow-none hover:bg-accent border border-input" onClick={() => deleteTweet(tweet._id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                            <NavLink className='py-2 block' to={`/tweet/${tweet._id}`}>
                                <div>
                                    {tweet.content.textContent && <p><ParseContents content={tweet.content.textContent} /></p>}
                                </div>
                            </NavLink>
                            <div className='w-full'>
                                {tweet.content.image.length > 0 && <Carousel className="max-w-xs mx-auto md:ml-10">
                                    <CarouselContent>
                                        {tweet.content.image.map((img, index) => {
                                            return (
                                                <CarouselItem key={index}>
                                                    <div className='p-1 w-full h-full flex items-center justify-center border border-primary/30 rounded-md bg-card relative'>
                                                        {tweet.content.image.length > 1 && <span className='absolute top-3 right-3 text-sm bg-primary/70 text-background px-2 rounded-md'>{`${index + 1}/${tweet.content.image.length}`}</span>}
                                                        <img src={img} alt={index + 1} className='rounded-md w-full' />
                                                    </div>
                                                </CarouselItem>
                                            )
                                        })}
                                    </CarouselContent>
                                    {(tweet.content.image.length > 1 && !isMobile) && <>
                                        <CarouselPrevious />
                                        <CarouselNext /> </>}
                                </Carousel>}
                            </div>
                            <div className='mt-4 flex items-center gap-4'>
                                <Button className="flex items-center border font-medium  border-primary/50 shadow-none gap-x-2 border-r bg-border text-primary hover:bg-primary/20 after:content-[attr(data-like)] xs:[&_svg]:size-5 [&_svg]:size-4 text-sm xs:text-base" data-like={formatNumbers(tweet.totalLikes)} onClick={() => toggleLike(tweet._id)}>
                                    <span className="inline-block">
                                        {tweet.isLiked ? <Like className='fill-[#ae7aff] text-border' /> : <Like className='fill-transparent' />}
                                    </span>
                                </Button>
                                
                                <Button className="flex items-center border font-medium  border-primary/50 shadow-none gap-x-2 border-r bg-border text-primary hover:bg-primary/20 after:content-[attr(data-like)] xs:[&_svg]:size-5 [&_svg]:size-4 text-sm xs:text-base" data-like={formatNumbers(tweet.totalComments)} onClick={() => navigate(`/tweet/${tweet._id}`)}>
                                    <span className="inline-block">
                                        <MessageSquareTextIcon />
                                        {/* {tweet.isLiked ? <Like className='fill-[#ae7aff] text-border' /> : <Like className='fill-transparent' />} */}
                                    </span>
                                </Button>
                            </div>
                            <hr className='border-zinc-500 mt-5' />
                        </div>
                    )
                } else {
                    return (
                        <div key={tweet._id} className='p-2 mb-2 rounded-md'>
                            <div className='flex justify-between'>
                                <div className='flex items-center gap-3'>
                                    <div className='flex items-center'>
                                        <img src={setAvatar(channelData.avatar)} alt={`@${channelData.username}`} className='w-10 h-10 rounded-full' />
                                        <div className='ml-2'>
                                            <h3 className='font-bold'>{channelData.fullName}</h3>
                                        </div>
                                    </div>
                                    <p className='text-xs'>{timeAgo(tweet.createdAt)}</p>
                                </div>
                                {(tweet.isTweetOwner && isUserLoggedin) && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild title='options'>
                                            <div className='flex cursor-pointer px-[15px] py-2 rounded-full transition-colors hover:bg-primary/30 flex-col gap-1 h-max w-max'>
                                                <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
                                                <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
                                                <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className={`min-w-min !z-30 ${optionLoader ? "!pointer-events-none opacity-70" : "pointer-events-auto"}`}>
                                            <DropdownMenuItem className="py-0 px-1 w-full">
                                                <Button className="bg-transparent w-max h-min text-primary shadow-none hover:bg-transparent hover:text-primary" onClick={() => editTweet(tweet)}>
                                                    <EditIcon />Edit
                                                </Button>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <AlertDialog>
                                                <AlertDialogTrigger className="py-0 px-0 w-max hover:bg-accent rounded-sm transition-colors ">
                                                    <div role="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-4 py-2 bg-transparent w-max h-min text-primary shadow-none hover:bg-transparent hover:text-primary text-red-600 hover:text-red-600" >
                                                        <Trash2 />Delete
                                                    </div>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete this tweet.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction className="text-red-600 bg-transparent shadow-none hover:bg-accent border border-input" onClick={() => deleteTweet(tweet._id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                            <NavLink className='py-2 block' to={`/tweet/${tweet._id}`}>
                                <div>
                                    {tweet.content.textContent && <p><ParseContents content={tweet.content.textContent} /></p>}
                                </div>
                            </NavLink>
                            <div className='w-full'>
                                {tweet.content.image.length > 0 && <Carousel className="max-w-xs mx-auto md:ml-10">
                                    <CarouselContent>
                                        {tweet.content.image.map((img, index) => {
                                            return (
                                                <CarouselItem key={index}>
                                                    <div className='p-1 w-full h-full flex items-center justify-center border border-primary/30 rounded-md bg-card relative'>
                                                        {tweet.content.image.length > 1 && <span className='absolute top-3 right-3 text-sm bg-primary/70 text-background px-2 rounded-md'>{`${index + 1}/${tweet.content.image.length}`}</span>}
                                                        <img src={img} alt={index + 1} className='rounded-md w-full' />
                                                    </div>
                                                </CarouselItem>
                                            )
                                        })}
                                    </CarouselContent>
                                    {(tweet.content.image.length > 1 && !isMobile) && <>
                                        <CarouselPrevious />
                                        <CarouselNext /> </>}
                                </Carousel>}
                            </div>
                            <div className='mt-4 flex items-center gap-4'>
                                <Button className="flex items-center border font-medium  border-primary/50 shadow-none gap-x-2 border-r bg-border text-primary hover:bg-primary/20 after:content-[attr(data-like)] xs:[&_svg]:size-5 [&_svg]:size-4 text-sm xs:text-base" data-like={formatNumbers(tweet.totalLikes)} onClick={() => toggleLike(tweet._id)}>
                                    <span className="inline-block">
                                        {tweet.isLiked ? <Like className='fill-[#ae7aff] text-border' /> : <Like className='fill-transparent' />}
                                    </span>
                                </Button>
                                
                                <Button className="flex items-center border font-medium  border-primary/50 shadow-none gap-x-2 border-r bg-border text-primary hover:bg-primary/20 after:content-[attr(data-like)] xs:[&_svg]:size-5 [&_svg]:size-4 text-sm xs:text-base" data-like={formatNumbers(tweet.totalComments)} onClick={() => navigate(`/tweet/${tweet._id}`)}>
                                    <span className="inline-block">
                                        <MessageSquareTextIcon />
                                        {/* {tweet.isLiked ? <Like className='fill-[#ae7aff] text-border' /> : <Like className='fill-transparent' />} */}
                                    </span>
                                </Button>
                            </div>
                            <hr className='border-zinc-500 mt-5' />
                        </div>
                    )
                }
            })}

            {pageLoader && <div className='flex justify-center'>
                <Loader className='animate-spin' />
            </div>}
        </div>
    )
}

export default ChannelTweets
