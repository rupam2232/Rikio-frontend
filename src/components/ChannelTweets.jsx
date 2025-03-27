import { useState, useEffect } from 'react'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'
import setAvatar from '../utils/setAvatar.js'
import formatNumbers from '../utils/formatNumber.js'
import toast from 'react-hot-toast'
import { ImagePlus, Loader, LoaderCircle, PencilLine } from 'lucide-react'
import { timeAgo } from '../utils/timeAgo.js'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Like, ParseContents } from './index.js'
import { logout } from '../store/authSlice.js'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    
} from "@/components/ui/carousel"

const ChannelTweets = ({ channelData }) => {
    const [tweetInput, setTweetInput] = useState("")
    const [tweets, setTweets] = useState(null)
    const [refetchTweets, setRefetchTweets] = useState(false)
    const [loader, setLoader] = useState(true)
    const [tweetLoader, setTweetLoader] = useState(false)
    const [error, setError] = useState(null)
    const [isTextAreaFocused, setIsTextAreaFocused] = useState(false);
    const [api, setApi] = useState()
    const [selectedImages, setSelectedImages] = useState([]);
    const MAX_IMAGES = 4;
    const isUserLoggedin = useSelector((state) => state.auth.status)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        setLoader(true)
        axios.get(`/tweet/${channelData._id}`)
            .then((res) => {
                console.log(res.data.data)
                setTweets(res.data.data)
            })
            .catch((err) => {
                console.error(errorMessage(err))
                setError(errorMessage(err))
            })
            .finally(() => {
                setLoader(false)
            })
    }, [refetchTweets])

    const postTweet = (e) => {
        e.preventDefault();
        if (tweetLoader) return;
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

    const handleImageChange = (event) => {
        const files = event.target.files;
        const imageArray = [];

        for (let i = 0; i < files.length; i++) {
            imageArray.push(files[i]);
        }

        if (selectedImages.length + imageArray.length > MAX_IMAGES) {
            alert(`You can only upload a maximum of ${MAX_IMAGES} images.`);
            return;
        }

        setSelectedImages([...selectedImages, ...imageArray]);
    };

    const handleRemoveImage = (indexToRemove) => {
        setSelectedImages(selectedImages.filter((_, index) => index !== indexToRemove));
    };

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
        <div className='p-2 mt-2 mb-5'>
            {(channelData.isChannelOwner && isUserLoggedin) && <form className='mb-6' onSubmit={(e) => postTweet(e)}>
                <div className={`border-zinc-500 border rounded-md ${isTextAreaFocused ? 'ring-1 ring-primary' : ''}`}>
                    <textarea rows="3" placeholder='Write a tweet' value={tweetInput} maxLength="400" onChange={(e) => setTweetInput(e.target.value)} onFocus={() => setIsTextAreaFocused(true)} onBlur={() => setIsTextAreaFocused(false)} className='bg-transparent w-full rounded-md resize-none p-3 outline-none border-none' />
                    <div>
                        <label htmlFor="pictures" title='upload image' className='ml-2 cursor-pointer inline-block px-2 py-2 rounded-md self-center hover:bg-accent'><ImagePlus className='size-5' /></label>
                        <input type="file" onChange={handleImageChange} name="pictures[]" id="pictures" accept='image/*' multiple className='hidden' />
                    </div>
                </div>
                <p className='text-sm text-primary/80'>{tweetInput.length}/400</p>
                <div className="flex flex-wrap">
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
                <Button type="submit" className='mt-2' disabled={(tweetInput.trim() === "" && selectedImages.length === 0) || tweetLoader}>{tweetLoader ? <Loader className='animate-spin' /> : "Tweet"}</Button>
            </form>}
            {tweets.length > 0 && tweets.map((tweet) => {
                return (
                    <div key={tweet._id} className='p-2 mb-2 rounded-md shadow-md border-b border-zinc-500'>
                        <div className='flex items-center gap-3'>
                            <div className='flex items-center'>
                                <img src={setAvatar(channelData.avatar)} alt={`@${channelData.username}`} className='w-10 h-10 rounded-full' />
                                <div className='ml-2'>
                                    <h3 className='font-bold'>{channelData.fullName}</h3>
                                </div>
                            </div>
                            <p className='text-xs'>{timeAgo(tweet.createdAt)}</p>
                        </div>
                        <div className='mt-2'>
                            {tweet.content.textContent && <p><ParseContents content={tweet.content.textContent} /></p>}
                        </div>
                        <div>
                            {tweet.content.image.length > 0 && <Carousel className="w-full max-w-xs mx-auto md:ml-4">
                                <CarouselContent>
                                    {tweet.content.image.map((img, index) => {
                                        return (
                                            <CarouselItem key={index}>
                                                <Card>
                                                <CardContent className="flex aspect-square items-center justify-center p-3">
                                                <img src={img} alt={index + 1} className='rounded-md' />
                                                </CardContent>
                                                </Card>
                                            </CarouselItem>
                                        )
                                    })}
                                </CarouselContent>
                                    {tweet.content.image.length > 1 && <>
                                <CarouselPrevious />
                                <CarouselNext /> </>}
                            </Carousel>}

                            {/* {tweet.content.image.length > 0 && tweet.content.image.map((img, index) => {
                                return (
                                    <img src={img} key={index} alt={index + 1} className='w-full h-[200px] object-cover rounded-md mt-2' />
                                )
                            })
                            } */}
                        </div>
                        <div className='mt-4'>
                            <Button className="flex items-center border font-medium  border-primary/50 shadow-none gap-x-2 border-r bg-border text-primary hover:bg-primary/20 after:content-[attr(data-like)] xs:[&_svg]:size-5 [&_svg]:size-4 text-sm xs:text-base"
                                data-like={formatNumbers(tweet.totalLikes)} onClick={() => toggleLike(tweet._id)}>
                                <span className="inline-block">
                                    {tweet.isLiked ? <Like className='fill-[#ae7aff] text-border' /> : <Like className='fill-transparent' />}
                                </span>
                            </Button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ChannelTweets
