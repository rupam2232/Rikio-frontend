import { useState, useRef, useEffect } from 'react'
import { Button, Facebook, Github, Input, Instagram, Linkedin, Website, X } from './index.js'
import { useDropzone } from 'react-dropzone';
import { Pencil, LoaderCircle, Users } from 'lucide-react';
import setAvatar from '../utils/setAvatar.js';
import errorMessage from '../utils/errorMessage.js';
import axios from '../utils/axiosInstance.js';
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


const ProfileTab = ({ user }) => {
    const [avatarErrorMessage, setAvatarErrorMessage] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverImageErrorMessage, setCoverImageErrorMessage] = useState('');
    const [loader, setLoader] = useState(null)
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar ? user.avatar : null)
    const [coverImageUrl, setCoverImageUrl] = useState(user?.coverImage ? user.coverImage : null)
    const [fullName, setFullName] = useState(user?.fullName ? user.fullName : "")
    const [bio, setBio] = useState(user?.bio ? user.bio : "")
    const [instagram, setInstagram] = useState("")
    const [github, setGithub] = useState("")
    const [linkedin, setLinkedin] = useState("")
    const [facebook, setFacebook] = useState("")
    const [x, setX] = useState("")
    const [website, setWebsite] = useState("")
    const avatarRef = useRef(null);
    const coverImageRef = useRef(null);

    const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
    const MAX_COVERIMAGE_SIZE = 5 * 1024 * 1024;

    const onAvatarDrop = (acceptedFiles, rejectedFiles) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

        if (rejectedFiles.length > 0 ||
            (acceptedFiles.length > 0 && !allowedImageTypes.includes(acceptedFiles[0].type))) {
            setAvatarErrorMessage('Only .jpeg, .jpg, .png, .gif files are allowed.');
            return;
        }
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (file.size > MAX_IMAGE_SIZE) {
                setAvatarErrorMessage('Thumbnail file size exceeds 2MB.');
                return;
            }

            setAvatarFile(file);
            setAvatarErrorMessage('');
        }
    };
    const onCoverImageDrop = (acceptedFiles, rejectedFiles) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (rejectedFiles.length > 0 ||
            (acceptedFiles.length > 0 && !allowedImageTypes.includes(acceptedFiles[0].type))) {
            setCoverImageErrorMessage('Only .jpeg, .jpg, .png files are allowed.');
            return;
        }
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (file.size > MAX_COVERIMAGE_SIZE) {
                setCoverImageErrorMessage('Thumbnail file size exceeds 5MB.');
                return;
            }

            setCoverImageFile(file);
            setCoverImageErrorMessage('');
        }
    };

    const {
        getRootProps: getAvatarRootProps,
        getInputProps: getAvatarInputProps,
        isDragActive: isAvatarDragActive,
        isDragReject: isAvatarDragReject,
    } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': [],
            'image/gif': []
        },
        multiple: false,
        onDrop: onAvatarDrop
    });

    const {
        getRootProps: getCoverImageRootProps,
        getInputProps: getCoverImageInputProps,
        isDragActive: isCoverImageDragActive,
        isDragReject: isCoverImageDragReject,
    } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': []
        },
        multiple: false,
        onDrop: onCoverImageDrop
    });

    useEffect(() => {
        const fetchChannelData = async () => {
            setLoader(true)
            try {
                const response = await axios.get(`/users/c/${user.username}`)
                if (response.data.data.socials) {
                    setInstagram(response.data.data.socials?.instagram ? response.data.data.socials.instagram : "")
                    setGithub(response.data.data.socials?.github ? response.data.data.socials.github : "")
                    setLinkedin(response.data.data.socials?.linkedin ? response.data.data.socials.linkedin : "")
                    setFacebook(response.data.data.socials?.facebook ? response.data.data.socials.facebook : "")
                    setX(response.data.data.socials?.x ? response.data.data.socials.x : "")
                    setWebsite(response.data.data.socials?.website ? response.data.data.socials.website : "")
                }
            } catch (error) {
                console.error(errorMessage(error))
            } finally {
                setLoader(false)
            }
        }
        fetchChannelData()

    }, [])

    const removeAvatar = () => {
        if(avatarFile){
            setAvatarFile(null);
        } else {
            setAvatarUrl(null)
        }
    }

    const removeCoverImage = () => {
        if(coverImageFile){
            setCoverImageFile(null);
        } else {
            setCoverImageUrl(null)
        }
    }

    const onFormSubmit = ()=>{
        setLoader(true)
        if((bio.trim() !== user.bio.trim()) || (fullName.trim() !== user.fullName.trim())){
            axios.patch("/users/update-account", {fullName, bio})
                .then((res)=>{

                })
                .catch((err)=>{
                    console.error(errorMessage(err))
                })
        }
        if(avatarFile){
            axios.patch("/users/avatar", {avatar: avatarFile})
                .then((res)=>{

                })
                .catch((err)=>{
                    console.error(errorMessage(err))
                })
        }
        if(coverImageFile){
            axios.patch("/users/cover-image", {coverImage: coverImageFile})
                .then((res)=>{

                })
                .catch((err)=>{
                    console.error(errorMessage(err))
                })
        }
    }
    console.log((bio.trim() !== user.bio.trim()) || (fullName.trim() !== user.fullName.trim()))
    return (
        <div className="py-4 px-1 rounded">
            <h1 className="font-medium text-xl">Profile</h1>
            <p className='text-sm text-primary/80'>This is how others will see you on the site.</p>
            <hr className="my-2 border-primary" />

            <form className="space-y-4 relative">
                {loader && <div className='fixed inset-0 z-40 bg-accent/50 flex justify-center items-center'>
                    <div className='bg-background p-6 rounded-lg shadow-xl'>
                        <LoaderCircle className='size-14 animate-spin' />
                    </div>
                </div>}
                <div>
                    <p className='mb-1 font-medium'>Avatar</p>
                    <div className='relative inline-block'>
                        <div {...getAvatarRootProps()} className={`inline-block cursor-pointer`} >
                            <input {...getAvatarInputProps()} name="avatar" />
                            <img className={`w-40 h-40 object-cover rounded-full ${isAvatarDragActive ? `${!isAvatarDragReject ? "border-green-500" : "border-red-500"} border-2` : isAvatarDragReject && 'border-red-500 border-2'}`} alt={`@${user.username}`} src={avatarFile ? URL.createObjectURL(avatarFile) : setAvatar(avatarUrl)} />
                            <p className={`text-sm font-bold absolute top-0 left-0 w-full h-full flex justify-around items-center bg-background/30 ${isAvatarDragActive ? "block" : "hidden"}`}>Drop avatar file here</p>
                            {(!avatarUrl && !avatarFile) &&
                                <p className={`text-lg font-bold absolute top-0 left-0 w-full h-full flex justify-around items-center bg-background/30 ${isAvatarDragActive ? "hidden" : "block"}`}>No avatar</p>}
                            <button className="hidden" ref={avatarRef}>Upload avatar</button>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild title='Edit' className="mx-auto">
                                <button className="absolute flex items-center gap-2 bottom-5 left-0 p-1 bg-accent shadow rounded-md border text-sm">
                                    <Pencil className='size-4' /> Edit
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="min-w-min !z-30 shadow-md shadow-zinc-500">
                                <DropdownMenuItem className="py-0 px-1 w-full">
                                    <Button className="bg-transparent w-max h-min text-primary shadow-none hover:bg-transparent hover:text-primary text-sm" onClick={() => avatarRef.current.click()}>
                                        Upload a new avatar
                                    </Button>
                                </DropdownMenuItem>
                                {(avatarUrl || avatarFile) && 
                                <>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                    <AlertDialogTrigger className="py-0 px-0 w-full hover:bg-accent rounded-sm transition-colors ">
                                        <div role="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-4 py-2 bg-transparent w-full h-min text-primary shadow-none hover:bg-transparent hover:text-primary text-red-600 hover:text-red-600" >
                                            Remove avatar
                                        </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your avatar.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction className="text-red-600 bg-transparent shadow-none hover:bg-accent border border-input" onClick={() => removeAvatar()}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog> </>}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {avatarErrorMessage && <p className="text-red-500 text-sm">{avatarErrorMessage}</p>}
                    <p className='text-xs mt-3 text-primary/80 md:w-3/4'>This is your public display avatar. You can update it by clicking the image or dropping a new one (under 2MB).</p>
                </div>

                <div>
                    <p className='mb-1 font-medium'>Cover image</p>
                    <div className='relative'>
                        <div {...getCoverImageRootProps()} className="w-full max-w-[2560px] cursor-pointer">
                            <input {...getCoverImageInputProps()} name="coverImage" />
                            <div className={`relative rounded-md w-full lg:aspect-[2560/510] aspect-[2560/576] ${isCoverImageDragActive ? `${!isCoverImageDragReject ? "border-green-500" : "border-red-500"} border-2` : isCoverImageDragReject && 'border-red-500 border-2'}`}>
                                {(coverImageUrl || coverImageFile) ? <img src={coverImageFile ? URL.createObjectURL(coverImageFile) : coverImageUrl} alt={`cover image | @${user.username}`} className="absolute inset-0 w-full h-full object-cover rounded-md" /> : <div className='w-full h-full bg-gray-400 rounded-md'>
                                </div>}
                                <p className={`text-sm absolute font-bold top-0 left-0 w-full h-full flex justify-around items-center bg-background/30 ${isCoverImageDragActive ? "block" : "hidden"}`}>Drop cover image file here</p>
                                {(!coverImageUrl && !coverImageFile) &&
                                    <p className={`text-lg font-bold absolute top-0 left-0 w-full h-full flex justify-around items-center bg-background/30 ${isCoverImageDragActive ? "hidden" : "block"}`}>No cover image</p>}
                                <button ref={coverImageRef} className="hidden" >Upload cover image</button>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild title='Edit' className="mx-auto">
                                <button className="absolute flex items-center gap-2 bottom-1 left-1 p-1 bg-accent shadow rounded-md border text-sm">
                                    <Pencil className='size-4' /> Edit
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="min-w-min !z-30 shadow-md shadow-zinc-500">
                                <DropdownMenuItem className="py-0 px-1 w-full">
                                    <Button className="bg-transparent w-max h-min text-primary shadow-none hover:bg-transparent hover:text-primary text-sm" onClick={() => coverImageRef.current.click()}>
                                        Upload a new cover image
                                    </Button>
                                </DropdownMenuItem>
                                {(coverImageUrl || coverImageFile) && 
                                <>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                    <AlertDialogTrigger className="py-0 px-0 w-full hover:bg-accent rounded-sm transition-colors ">
                                        <div role="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-4 py-2 bg-transparent w-full h-min text-primary shadow-none hover:bg-transparent hover:text-primary text-red-600 hover:text-red-600" >
                                            Remove cover image
                                        </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your cover image.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction className="text-red-600 bg-transparent shadow-none hover:bg-accent border border-input" onClick={() => removeCoverImage()}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog> </>}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {coverImageErrorMessage && <p className="text-red-500 text-sm">{coverImageErrorMessage}</p>}
                    <p className='text-xs mt-3 text-primary/80 md:w-3/4'>This is your public display cover image. You can update it by clicking the image or dropping a new one (under 5MB).</p>
                </div>

                <div>
                    <label htmlFor="name" className="block font-medium">Name*</label>
                    <Input type="text" required placeholder="Enter your name" id="name" onChange={(e) => setFullName(e.target.value)} value={fullName} className="border-zinc-500 text-sm" />
                    <p className='text-xs mt-2 text-primary/80 md:w-3/4'>This field is required!</p>
                </div>

                <div>
                    <label htmlFor="bio" className="block font-medium">Bio</label>
                    <textarea id="bio" placeholder='Tell us a little bit about yourself' rows={4} onChange={(e) => setBio(e.target.value)} value={bio} maxLength="200" className="w-full border p-2 rounded-md bg-transparent border-zinc-500 resize-none text-sm"></textarea>
                </div>

                <div>
                    <p className='mb-1 font-medium'>Social accounts</p>
                    <div className='space-y-3'>
                        <div className='flex items-center gap-2'>
                            <label htmlFor='instagram'><Instagram /></label>
                            <Input type="text" placeholder="Link to your instagram profile" onChange={(e) => setInstagram(e.target.value)} value={instagram} id="instagram" className="border-zinc-500 text-sm" />
                        </div>
                        <div className='flex items-center gap-2'>
                            <label htmlFor='github'><Github className='fill-primary' /> </label>
                            <Input type="text" placeholder="Link to your github profile" onChange={(e) => setGithub(e.target.value)} value={github} id="github" className="border-zinc-500 text-sm" />
                        </div>
                        <div className='flex items-center gap-2'>
                            <label htmlFor='linkedin'><Linkedin /></label>
                            <Input type="text" placeholder="Link to your linkedin profile" onChange={(e) => setLinkedin(e.target.value)} value={linkedin} id="linkedin" className="border-zinc-500 text-sm" />
                        </div>
                        <div className='flex items-center gap-2'>
                            <label htmlFor='facebook'><Facebook /></label>
                            <Input type="text" placeholder="Link to your facebook profile" onChange={(e) => setFacebook(e.target.value)} value={facebook} id="facebook" className="border-zinc-500 text-sm" />
                        </div>
                        <div className='flex items-center gap-2'>
                            <label htmlFor='x'><X /></label>
                            <Input type="text" placeholder="Link to your x profile" onChange={(e) => setX(e.target.value)} value={x} id="x" className="border-zinc-500 text-sm" />
                        </div>
                        <div className='flex items-center gap-2'>
                            <label htmlFor='website'><Website className="mx-0.5 w-[25px] h-[25px] fill-primary" /></label>
                            <Input type="text" placeholder="Link to your website" onChange={(e) => setWebsite(e.target.value)} value={website} id="website" className="border-zinc-500 text-sm" />
                        </div>
                    </div>
                </div>

                <Button>Save</Button>
            </form>
        </div>
    )
}

export default ProfileTab
