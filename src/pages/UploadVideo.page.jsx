import React, { useState } from 'react';
import { Button, Input, Video } from "../components/index.js"
import { useDropzone } from 'react-dropzone';
import { Trash2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from '../utils/axiosInstance.js'
import toast from "react-hot-toast"
import showErrorMessage from '../utils/errorMessage.js'
import { useDispatch } from 'react-redux'
import { logout } from '../store/authSlice.js'
import { useNavigate } from 'react-router-dom'

const UploadVideo = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [thumnailErrorMessage, setThumbnailErrorMessage] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublished, setIsPublished] = useState(true);
    const [tags, setTags] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const onDrop = (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0 || (acceptedFiles.length > 0 && acceptedFiles[0].type !== 'video/mp4')) {
            setErrorMessage('Only MP4 files are allowed.');
            return;
        }

        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setVideoFile(file);
            setErrorMessage('');
        }
    };

    const onThumbnailDrop = (acceptedFiles, rejectedFiles) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (rejectedFiles.length > 0 ||
            (acceptedFiles.length > 0 && !allowedImageTypes.includes(acceptedFiles[0].type))) {
            setThumbnailErrorMessage('Only .jpeg, .jpg, .png files are allowed.');
            return;
        }
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setThumbnailFile(file);
            setThumbnailErrorMessage('');
        }
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
    } = useDropzone({
        accept: {
            'video/mp4': []
        },
        multiple: false,
        onDrop
    });

    const {
        getRootProps: getThumbnailRootProps,
        getInputProps: getThumbnailInputProps,
        isDragActive: isThumbnailDragActive,
        isDragReject: isThumbnailDragReject,
    } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': []
        },
        multiple: false,
        onDrop: onThumbnailDrop
    });

    const removeVideo = () => {
        setVideoFile(null);
    };

    const removeThumbnail = () => {
        setThumbnailFile(null);
    };

    const handleVisibility = (value) => {
        if (value === "true") {
            setIsPublished(true)
        } else if (value === "false") {
            setIsPublished(false)
        }
        console.log(isPublished)
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        const finalTags = tags.split(',').map(tag => tag.trim()); 
        console.log({ videoFile }, { thumbnailFile }, { title }, { description }, { isPublished }, {finalTags})

        try {
            let res = await axios.post("/videos",{
                video: videoFile,
                thumbnail: thumbnailFile,
                title,
                description,
                isPublished,
                tags: finalTags
            },{
                headers: {
                  'Content-Type': 'multipart/form-data',
                }
            })
            if(res.status === 200){
                toast.success(res.data.message, {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })

                navigate(`/video/${res.data.data._id}`)
            }else{
                toast.error("something went wrong please try again", {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
            }
        } catch (error) {
            toast.error(showErrorMessage(error), {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            if (error.status === 401) {
                dispatch(logout())
                navigate("/login")
            }
            console.error(showErrorMessage(error));
        }
        
    }


    return (
        <section className="w-full p-4">
            <div className="w-full px-4 flex items-center justify-between">
                <h1 className="font-medium text-2xl">Upload Video</h1>
            </div>
            <hr className="my-4 border-primary" />

            <div className='md:flex justify-between flex-wrap'>
                <form action="/upload" method="POST" encType="multipart/form-data" className="space-y-6 md:w-3/5 mb-6 md:mb-0" onSubmit={handleSubmit}>

                    <div
                        {...getRootProps()}
                        className={` border-zinc-500 rounded-md p-6 ${videoFile && "hidden"} text-center cursor-pointer hover:bg-secondary/70 bg-secondary ${isDragActive ? 'border-green-500 border-2' : isDragReject ? 'border-red-500 border-2' : 'border-dashed border'
                            }`}
                    >
                        <input {...getInputProps()} name="video" />
                        <p className="mb-2">
                            {isDragReject ? 'Unsupported file type' : 'Drag and drop video files here to upload'}
                        </p>
                        <p className="text-sm text-primary/50">Your videos will be private until you publish them.</p>
                        <Button
                            type="button"
                            className="mt-4"
                        >
                            Select Files
                        </Button>
                    </div>
                    {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

                    {videoFile && (
                        <div className='!mt-0'>
                            <p className="text-sm font-medium mb-2">Video File:</p>
                            <div className='h-20 cursor-pointer border border-primary/30 rounded-lg items-center px-3 flex gap-4 justify-between group'>
                                <h3 className='text-wrap max-w-3/4'>{videoFile.name}</h3>
                                <div className='relative h-full'>
                                    <video
                                        src={URL.createObjectURL(videoFile)}
                                        className="h-full aspect-square border border-gray-700 rounded-md"
                                    />
                                    <Button
                                        type="button"
                                        className="group-hover:visible md:invisible h-full w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/40 px-3 py-5 transition-colors hover:bg-primary/50 text-red-600"
                                        onClick={removeVideo}
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div
                        {...getThumbnailRootProps()}
                        className={`border-zinc-500 hover:bg-secondary/70 bg-secondary rounded-md p-4 text-center cursor-pointer ${thumbnailFile && "hidden"} ${isThumbnailDragActive ? 'border-green-500 border-2' : isThumbnailDragReject ? 'border-red-500 border-2' : 'border-dashed border'
                            }`}
                    >
                        <input {...getThumbnailInputProps()} name="thumbnail" />
                        <p className="mb-2">
                            {isThumbnailDragReject ? 'Unsupported file type' : 'Drag and drop thumbnail image here to upload'}
                        </p>
                        <Button
                            type="button"
                            className="mt-2"
                        >
                            Select Thumbnail
                        </Button>
                    </div>

                    {thumbnailFile && (
                        <div>
                            <p className="text-sm font-medium mb-2">Thumbnail File:</p>
                            <div className='h-20 cursor-pointer border border-primary/30 rounded-lg items-center px-3 flex gap-4 justify-between group'>
                                <h3 className='text-wrap max-w-3/4'>{thumbnailFile.name}</h3>
                                <div className='relative h-full'>
                                    <img
                                        src={URL.createObjectURL(thumbnailFile)}
                                        alt="Thumbnail Preview"
                                        className="h-full aspect-square object-cover border border-gray-700 rounded-md"
                                    />
                                    <Button
                                        type="button"
                                        className="group-hover:visible md:invisible h-full w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/40 px-3 py-5 transition-colors hover:bg-primary/50 text-red-600"
                                        onClick={removeThumbnail}
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {thumnailErrorMessage && <p className="text-red-500 text-sm mt-2">{thumnailErrorMessage}</p>}

                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="title">
                            Title*
                        </label>
                        <textarea
                            id="title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault() }}
                            maxLength="150"
                            placeholder="Write a title for your video"
                            className="block w-full bg-transparent text-sm border border-zinc-500 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            maxLength="2000"
                            placeholder='Write a description for your video'
                            className="w-full resize-none border bg-transparent p-2 scroll-smooth scroll-m-0  block text-sm border-zinc-500 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="select">
                            Visibility*
                        </label>
                        <Select id="select" className="!border-zinc-500" onValueChange={(e) => handleVisibility(e)} defaultValue="true">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Visibility" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Public</SelectItem>
                                <SelectItem value="false">Private</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="tags">Tags</label>
                        <Input
                            id="tags"
                            type="text"
                            value={tags}
                            onChange={(e)=> setTags(e.target.value)}
                            maxLength="50"
                            className="text-sm border-zinc-500 focus:ring-primary"
                            placeholder="Enter tags separated by commas (e.g., funny, video)"
                        />
                    </div>

                    <Button type="submit" disabled={!videoFile || !thumbnailFile || !title}>
                        Upload
                    </Button>
                </form>
                <div className='md:w-1/3'>
                    <div className="relative  mb-4">
                        <div className="aspect-video w-full border border-primary/30 rounded-lg">
                            {videoFile && thumbnailFile ? <Video src={videoFile && (URL.createObjectURL(videoFile))} poster={thumbnailFile ? (URL.createObjectURL(thumbnailFile)) : ""} />
                                : <p className='text-center flex items-center h-full px-2 text-sm'>Upload a video file and thumbnail file to watch the preview here</p>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default UploadVideo