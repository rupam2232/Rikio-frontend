import React, { useState } from 'react';
import { Button, Input } from "../components/index.js"
import { useDropzone } from 'react-dropzone';

const UploadVideo = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState(null);

    const onDrop = (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
            setErrorMessage('Only MP4 files are allowed.');
            return;
        }

        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setVideoFile(file);
            setErrorMessage('');
        }
    };

    const onThumbnailDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setThumbnailFile(file);
        }
    };
    console.log(videoFile)
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        acceptedFiles,
        fileRejections,
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
            'image/*': []
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



    // return (
    //     <div
    //         {...getRootProps()}
    //         style={{
    //             border: '2px dashed #cccccc',
    //             padding: '20px',
    //             textAlign: 'center',
    //             borderRadius: '8px',
    //             background: isDragActive ? '#f0f8ff' : '#fafafa',
    //             transition: 'background 0.2s ease-in-out',
    //         }}
    //     >
    //         <input {...getInputProps()} />
    //         {/* <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             fill="none"
    //             viewBox="0 0 24 24"
    //             strokeWidth="1.5"
    //             stroke="currentColor"
    //             className="w-12 h-12"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               d="M3 16.5v-9a4.5 4.5 0 014.5-4.5h9a4.5 4.5 0 014.5 4.5v9a4.5 4.5 0 01-4.5 4.5h-9a4.5 4.5 0 01-4.5-4.5z"
    //             />
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               d="M12 9v6m0 0l3-3m-3 3l-3-3"
    //             />
    //           </svg> */}
    //         <p className='text-background'>
    //             {isDragActive
    //                 ? 'Drop your video files here...'
    //                 : 'Drag and drop video files here, or click to select files'}
    //         </p>
    //     </div>
    // );
    return (
        <section className="w-full p-4">
            <div className="w-full px-4 flex items-center justify-between">
                <h1 className="font-medium text-2xl">Upload Video</h1>
                <Button>Upload</Button>
            </div>
            <hr className="my-4 border-primary" />
            {/* <Input type="file" accept=".mp4" /> */}
            <div className='flex justify-between flex-wrap'>
                <form action="/upload" method="POST" encType="multipart/form-data" className="space-y-6 w-3/5">
                    {/* Drag and Drop Zone for Video */}
                    <div
                        {...getRootProps()}
                        className={` border-zinc-500 rounded-md p-6 text-center cursor-pointer bg-secondary/90 ${isDragActive ? 'border-green-500 border-2' : isDragReject ? 'border-red-500 border-2' : 'border-dashed border'
                            }`}
                    >
                        <input {...getInputProps()} name="video" />
                        <p className="mb-2">
                            {isDragReject ? 'Unsupported file type' : 'Drag and drop video files to upload'}
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

                    {/* Video Preview */}
                    {videoFile && (
                        <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Video Preview:</p>
                            <video
                                src={URL.createObjectURL(videoFile)}
                                controls
                                className="w-full h-auto border border-gray-700 rounded-md"
                            />
                            <button
                                type="button"
                                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                onClick={removeVideo}
                            >
                                Remove Video
                            </button>
                        </div>
                    )}

                    {/* Drag and Drop Zone for Thumbnail */}
                    <div
                        {...getThumbnailRootProps()}
                        className={`border-zinc-500 bg-secondary/90 rounded-md p-4 text-center cursor-pointer${isThumbnailDragActive ? 'border-green-500 border-2'  : isThumbnailDragReject ? 'border-red-500 border-2' : 'border-dashed border'
                            }`}
                    >
                        <input {...getThumbnailInputProps()} name="thumbnail" />
                        <p className="mb-2">Drag and drop thumbnail image to upload</p>
                        <Button
                            type="button"
                            className="mt-2"
                        >
                            Select Thumbnail
                        </Button>
                    </div>

                    {/* Thumbnail Preview */}
                    {thumbnailFile && (
                        <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Thumbnail Preview:</p>
                            <img
                                src={URL.createObjectURL(thumbnailFile)}
                                alt="Thumbnail Preview"
                                className="w-32 h-auto border border-gray-700 rounded-md"
                            />
                            <button
                                type="button"
                                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                onClick={removeThumbnail}
                            >
                                Remove Thumbnail
                            </button>
                        </div>
                    )}

                    {/* Title Input */}
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="title">
                            Title*
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="block w-full text-sm border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="description">
                            Description*
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            className="block w-full text-sm border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        ></textarea>
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Save
                    </button>
                </form>
                <div className='w-1/3'>
                    <div className="relative  mb-4">
                        <div className="aspect-video w-full">
                            <video
                                src={videoFile && (URL.createObjectURL(videoFile))}
                                poster={thumbnailFile && (URL.createObjectURL(thumbnailFile))}
                                controls
                                controlsList='nodownload nofullscreen noremoteplayback'
                                className="w-full h-full border border-primary/30 rounded-md"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default UploadVideo