import { useState } from 'react'
import { Button, Input } from './index.js'
import { useDropzone } from 'react-dropzone';
import { Trash2 } from 'lucide-react';
import setAvatar from '../utils/setAvatar.js';


const ProfileTab = ({ user }) => {
    const [avatarErrorMessage, setAvatarErrorMessage] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverImageErrorMessage, setCoverImageErrorMessage] = useState('');

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

    const removeAvatar = () => {
        setAvatarFile(null);
    }

    return (
        <div className="py-4 px-1 rounded">
            <h1 className="font-medium text-xl">Profile</h1>
            <p className='text-sm text-primary/80'>This is how others will see you on the site.</p>
            <hr className="my-2 border-primary" />

            <div className="space-y-4">

                <div>
                    {/* <img className='w-24 h-24 object-cover rounded-full' src={user.avatar} /> */}
                    <div {...getAvatarRootProps()} className={`inline-block cursor-pointer`} >
                        <p className='mb-2'>Avatar</p>
                        <input {...getAvatarInputProps()} name="avatar" />
                        <img className={`w-24 h-24  object-cover rounded-full ${avatarFile && ""} ${isAvatarDragActive ? `${!isAvatarDragReject ? "border-green-500" : "border-red-500"} border-2` : isAvatarDragReject && 'border-red-500 border-2'}`} alt={`@${user.username}`} src={avatarFile ? URL.createObjectURL(avatarFile) : setAvatar(user.avatar)} />

                        <p className='text-xs text-primary/80 md:w-3/4'>This is your public display avatar. You can update it by clicking the image or dropping a new one (under 2MB).</p>

                        {/* <p className="mb-2">
                        {isAvatarDragReject ? 'Unsupported file type' : 'Drag and drop thumbnail image here to upload'}
                    </p>
                    <Button
                        type="button"
                        className="mt-2"
                    >
                        Select Thumbnail
                    </Button> */}
                    </div>
                    {avatarErrorMessage && <p className="text-red-500 text-sm">{avatarErrorMessage}</p>}
                </div>

                <div {...getCoverImageRootProps()} className="w-full max-w-[2560px] cursor-pointer">
                    <p className='mb-2'>Avatar</p>
                    <input {...getCoverImageInputProps()} name="coverImage" />
                    <div className={`relative rounded-md w-full lg:aspect-[2560/510] aspect-[2560/576] ${isCoverImageDragActive ? `${!isCoverImageDragReject ? "border-green-500" : "border-red-500"} border-2` : isCoverImageDragReject && 'border-red-500 border-2'}`}>
                        {user.coverImage ? <img src={coverImageFile ? URL.createObjectURL(coverImageFile) : user.coverImage} alt={`cover image | @${user.username}`} className="absolute inset-0 w-full h-full object-cover rounded-md" /> : <div className='w-full h-full bg-gray-400 rounded-md'>
                        </div>}
                        <Button type="button" className="mt-2" >Select Thumbnail</Button> 
                    </div>
                </div>

                <div>
                    <label htmlFor="name" className="block">Name</label>
                    <Input type="text" id="name" className="border-zinc-500" />
                </div>
                <div>
                    <label htmlFor="email" className="block">Email</label>
                    <Input type="email" id="email" className="border-zinc-500" />
                </div>
                <div>
                    <label htmlFor="bio" className="block">Bio</label>
                    <textarea id="bio" className="w-full border p-2 rounded bg-transparent border-zinc-500"></textarea>
                </div>
                <div>
                    <label htmlFor="avatar" className="block">Avatar</label>
                    <Input type="file" id="avatar" className="border-zinc-500" />
                    <p className='text-xs text-primary/80'>Upload a new avatar.</p>
                </div>
                <div>
                    <label htmlFor="cover" className="block">Cover</label>
                    <Input type="file" id="cover" className="border-zinc-500" />
                    <p className='text-xs text-primary/80'>Upload a new cover photo.</p>
                </div>
                <div>
                    <label htmlFor="location" className="block">Location</label>
                    <Input type="text" id="location" className="border-zinc-500" />
                </div>
                <div>
                    <label htmlFor="website" className="block">Website</label>
                    <Input type="text" id="website" className="border-zinc-500" />
                </div>
                <div>
                    <label htmlFor="birthday" className="block">Birthday</label>
                    <Input type="date" id="birthday" className="border-zinc-500" />
                </div>
                <Button>Save</Button>
            </div>
        </div>
    )
}

export default ProfileTab
