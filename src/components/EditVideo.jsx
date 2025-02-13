import { useState, useEffect, useCallback } from "react"
import { X, Trash2, CircleCheck } from "lucide-react"
import { Input, Button } from "./index.js"
import { useDropzone } from 'react-dropzone';
import axios from "../utils/axiosInstance.js";
import errorMessage from "../utils/errorMessage.js";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from '../store/authSlice.js'
import toast from "react-hot-toast";
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

const EditVideo = ({ setOpenEditPopup, videoDetails, setVideoDetails }) => {
    const [title, setTitle] = useState(videoDetails.title)
    const [description, setDescription] = useState(videoDetails.description)
    const [tags, setTags] = useState(videoDetails?.tags.toString().replaceAll(",", ", "))
    const [tagsError, setTagsError] = useState(false)
    const [thumbnailFile, setThumbnailFile] = useState(null)
    const [thumnailErrorMessage, setThumbnailErrorMessage] = useState('');
    const [prevThumbnail, setPrevThumbnail] = useState(true)
    const [openPopup, setOpenPopup] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [frmDisable, setFrmDisable] = useState(true)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

    const onThumbnailDrop = (acceptedFiles, rejectedFiles) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (rejectedFiles.length > 0 ||
            (acceptedFiles.length > 0 && !allowedImageTypes.includes(acceptedFiles[0].type))) {
            setThumbnailErrorMessage('Only .jpeg, .jpg, .png files are allowed.');
            return;
        }
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (file.size > MAX_IMAGE_SIZE) {
                setThumbnailErrorMessage('Thumbnail file size exceeds 2MB.');
                return;
            }

            setThumbnailFile(file);
            setThumbnailErrorMessage('');
        }
    };

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

    const closePopup = () => {
        setOpenEditPopup(false)
        setVideoDetails(null)
    }

    const removeThumbnail = () => {
        setPrevThumbnail(false)
        setThumbnailFile(null)
    }

    const handleSubmit = async () => {
        const finalTags = tags.trim() ? tags.split(',').map(tag => tag.trim()) : [];
        const data = (!prevThumbnail && thumbnailFile) ? {
            tags: finalTags,
            title,
            description,
            thumbnail: thumbnailFile
        } : {
            tags: finalTags,
            title,
            description
        }

        try {
            setOpenPopup(true);
            setIsUploading(true);
            const res = await axios.patch(`/videos/${videoDetails._id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    setUploadProgress(progress - 1);
                },
            })
            if (res.status === 200) {
                videoDetails.title = res.data.data.title;
                videoDetails.description = res.data.data.description;
                videoDetails.tags = res.data.data.tags;
                videoDetails.thumbnail = res.data.data.thumbnail;

                setUploadProgress(100);
                setIsUploading(false);

            } else {
                toast.error("something went wrong please try again", {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
                setIsUploading(false);
                setOpenPopup(false);
            }
        } catch (error) {
            setIsUploading(false);
            setOpenPopup(false);
            toast.error(errorMessage(error), {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            if (error.status === 401) {
                dispatch(logout())
                navigate("/login")
            }
            console.error(errorMessage(error));
        }

    }

    function arraysAreEqual(arr1, arr2) {
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i] && arr1[i] !== "" && !arr1.some((field) => field?.trim() === "")) {
                return false;
            }
        }
        return true;
    }

    useEffect(() => {
        setTagsError(false)
        if (!title.trim()) {
            setFrmDisable(true);
        } else if(((tags.trim() ? tags.split(',').map(tag => tag.trim()) : []).some((field) => field?.trim() === ""))){
            setTagsError(true)
            setFrmDisable(true);
        } else if (!thumbnailFile && prevThumbnail) {
            if (title.trim() === videoDetails.title && description.trim() === videoDetails.description && arraysAreEqual(tags.trim() ? tags.split(',').map(tag => tag.trim()) : [], videoDetails.tags)) {
                setFrmDisable(true);
            } else {
                setTagsError(false)
                setFrmDisable(false);
            }
        } else if (!prevThumbnail && !thumbnailFile) {
            setFrmDisable(true);
        } else {
            setTagsError(false)
            setFrmDisable(false);
        }
    }, [title, description, tags, thumbnailFile, prevThumbnail])

    return (
        <div className='fixed z-[50] inset-0 flex items-center justify-center bg-black bg-opacity-70'>
            {openPopup && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-background p-6  rounded  text-center">
                        <h2 className='text-xl font-semibold'>{isUploading ? "Editing changes..." : "Video edited successfully"}</h2>

                        {isUploading ?
                            <>
                                <p className="text-sm text-left w-full mt-2">Please Don't close this window until the upload is complete.</p>

                                <div className="w-full bg-gray-200 rounded-full h-1 mt-4">
                                    <div
                                        className="bg-[#ae7aff] h-full rounded-full"
                                        style={{ width: `${uploadProgress < 0 ? 0 : uploadProgress}%` }}
                                    ></div>
                                </div>
                            </> :
                            <div className='w-full flex items-center justify-center mt-4'>
                                <CircleCheck className='text-green-500 size-10' />
                            </div>
                        }

                        <p className="text-sm text-zinc-500 mt-2">{uploadProgress < 0 ? 0 : uploadProgress}% uploaded</p>

                        {!isUploading && (
                            <div className='flex gap-32 justify-center mt-4'>
                                <Button type="button" className="py-1 px-5" onClick={() => setOpenEditPopup(false)}>Close</Button>

                                {videoDetails.isPublished === true && <Button type="button">
                                    <NavLink className="!bg-transparent hover:!bg-transparent" to={`/video/${videoDetails._id}`}>View Video</NavLink>
                                </Button>}
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="w-full md:w-1/2 max-h-screen bg-background p-6  rounded ring-1 ring-primary/30 overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Edit Video</h2>
                    <button onClick={closePopup}><X /></button>
                </div>
                <hr className="my-4 border-primary" />
                <form action="/upload" method="POST" encType="multipart/form-data" className="space-y-6 mb-6 md:mb-0 mt-6 w-full">

                    {!prevThumbnail && <div
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
                    </div>}

                    {(prevThumbnail || thumbnailFile) && <div>
                        <p className="text-sm font-medium mb-2 truncate">Thumbnail File: {!prevThumbnail && thumbnailFile.name }</p>
                        <div className='w-full md:h-40 md:w-max cursor-pointer border border-primary/30 rounded-lg items-center px-3 flex gap-4 justify-between group'>
                            <div className='relative h-full mx-auto'>
                                {prevThumbnail ? <img
                                    src={videoDetails.thumbnail}
                                    alt="Thumbnail Preview"
                                    className="h-full aspect-video object-cover border border-gray-700 rounded-md"
                                /> :
                                    thumbnailFile && (<img
                                        src={URL.createObjectURL(thumbnailFile)}
                                        alt="Thumbnail Preview"
                                        className="h-full aspect-video object-cover border border-gray-700 rounded-md"
                                    />)
                                }
                                <Button
                                    type="button"
                                    className="group-hover:visible md:invisible h-full w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/40 px-3 py-5 transition-colors hover:bg-primary/50 text-red-600"
                                    onClick={removeThumbnail}
                                >
                                    <Trash2 />
                                </Button>
                            </div>
                        </div>
                    </div>}

                    {thumnailErrorMessage && <p className="text-red-500 text-sm">{thumnailErrorMessage}</p>}

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
                        <label className="block text-sm font-medium mb-2" htmlFor="tags">Tags</label>
                        <Input
                            id="tags"
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            maxLength="50"
                            className="text-sm border-zinc-500 focus:ring-primary"
                            placeholder="Enter tags separated by commas (e.g., funny, video)"
                        />
                        {tagsError && <p className="text-xs text-red-500 ml-2">you can't leave empty spaces. please follow this pattern "your, tag".</p>}
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger className='disabled:opacity-50 disabled:pointer-events-none w-full sm:w-auto' disabled={frmDisable}>
                            <div role="button" className='px-3 py-2 bg-primary text-sm font-medium hover:bg-primary/90 text-background rounded-lg'>
                                Confirm
                            </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-lg">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-left xs:text-center">Are you sure you want to confirm this edit?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <span className='block'>Please make sure:</span>
                                    <span className='ml-4 block mt-2 text-left'>
                                        <span className='block'>1. You've chosen the correct thumbnail image.</span>
                                        <span className='block'>2. The title, description and tags are accurate.</span>
                                    </span>
                                    <span className='block mt-2'>Click 'Upload' to start uploading or 'Cancel' to review your inputs.</span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleSubmit()}>Upload</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </form>
            </div>
        </div>
    )
}

export default EditVideo
