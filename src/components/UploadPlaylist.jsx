import { useState, useEffect } from 'react'
import { X, LoaderCircle } from 'lucide-react'
import { Button } from './index.js'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice.js'
import toast from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


const UploadPlaylist = ({ setOpenEditPopup, playlistData = null, setPlaylistData, setFetch = null }) => {
    const [title, setTitle] = useState(playlistData?.playlistName ? playlistData.playlistName : "")
    const [formDisable, setFormDisable] = useState(false)
    const [description, setDescription] = useState(playlistData?.description ? playlistData.description : "")
    const [isPublic, setIsPublic] = useState(playlistData ? playlistData.isPublic : true)
    const [loader, setLoader] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();    
    const location = useLocation();
    const pathname = location.pathname.substring(1);
    const isCreate = pathname.includes("/") ? pathname.split("/")[1] : pathname;

    useEffect(() => {
        if (!title?.trim() || !(isPublic === true || isPublic === false)) {
            setFormDisable(true)
        } else if (title?.trim() === playlistData?.playlistName?.trim() && description?.trim() === playlistData?.description?.trim() && isPublic === playlistData?.isPublic) {
            setFormDisable(true)
        } else if (description?.trim() !== playlistData?.description?.trim() && !description?.trim()) {
            if(title?.trim() !== playlistData?.playlistName?.trim() || isPublic !== playlistData?.isPublic){
                setFormDisable(false)
            } else {
                setFormDisable(true)
            }
        } else {
            setFormDisable(false)
        }
    }, [title, description, isPublic])


    const closePopup = () => {
        if(isCreate === "create"){
            window.history.back();
        } else {
            setOpenEditPopup(false)
        }
    }

    const handleVisibility = (value) => {
        if (value === "true") {
            setIsPublic(true)
        } else if (value === "false") {
            setIsPublic(false)
        }
    }

    const handleEdit = () => {
        setFormDisable(true)
        setLoader(true)
        axios.patch(`/playlist/${playlistData._id}`, { playlistName: title, description: description ? description : null, isPublic })
            .then((res) => {
                setPlaylistData({ ...playlistData, playlistName: title, description: res.data.data.description, isPublic })
                toast.success(res.data.message, {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
                setOpenEditPopup(false)
            })
            .catch((error) => {
                if (error.status === 401) {
                    toast.error("You need to login first", {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                    dispatch(logout())
                    navigate("/login")
                } else {
                    toast.error(errorMessage(error), {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                }
                console.error(errorMessage(error));
            })
            .finally(() => {
                setFormDisable(false)
                setLoader(false)
            })
    }

    const handleCreate = ()=> {
        setFormDisable(true)
        setLoader(true)
        axios.post(`/playlist`, { playlistName: title, description: description ? description : null, isPublic })
            .then((res) => {
                toast.success(res.data.message, {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
                closePopup()
                if(setFetch) setFetch(e => !e)
            })
            .catch((error) => {
                if (error.status === 401) {
                    toast.error("You need to login first", {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                    dispatch(logout())
                    navigate("/login")
                } else {
                    toast.error(errorMessage(error), {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                }
                console.error(errorMessage(error));
            })
            .finally(() => {
                setFormDisable(false)
                setLoader(false)
            })
    }

    return (
        <div className='fixed z-[50] inset-0 flex items-center justify-center bg-black bg-opacity-70'>
            {loader && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-background p-2  rounded  text-center">
                        <LoaderCircle className="w-16 h-16 animate-spin" />
                    </div>
                </div>
            )}
            <div className="w-full sm:w-1/2 max-h-screen bg-background p-6  rounded ring-1 ring-primary/30 overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">{playlistData ? "Edit Playlist" : "Create Playlist"}</h2>
                    <button title='close' onClick={()=> closePopup()}><X /></button>
                </div>
                <hr className="my-4 border-primary" />
                <form action="/upload" method="POST" encType="multipart/form-data" className="space-y-6 mb-6 md:mb-0 mt-6 w-full">

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
                            placeholder="Write a title for your playlist"
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
                            placeholder='Write a description for your playlist'
                            className="w-full resize-none border bg-transparent p-2 scroll-smooth scroll-m-0  block text-sm border-zinc-500 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="select">
                            Visibility*
                        </label>
                        <Select id="select" className="!border-zinc-500" onValueChange={(e) => handleVisibility(e)} defaultValue={isPublic.toString()}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Visibility" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Public</SelectItem>
                                <SelectItem value="false">Private</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button className="w-full sm:w-auto" disabled={formDisable} onClick={() => playlistData ? handleEdit() : handleCreate()}>{playlistData ? "Edit" : "Create"}</Button>
                </form>
            </div>
        </div>
    )
}

export default UploadPlaylist
