import { Facebook, Linkedin, Instagram, Github, X, Website } from "./index.js"
import { Calendar } from "lucide-react"
import joinedAt from "../utils/joinedAt.js"

const ChannelAbout = ({ channelData }) => {
    return (
        <div className='mt-4 min-h-[60vh]'>
            <div className="flex flex-col lg:flex-row justify-between">
            <div className="lg:w-2/3 lg:pr-5">
                <h2 className='text-2xl font-bold mt-4 mb-3'>About</h2>
                {/* <hr className="rounded-md border-zinc-500 mt-2 mb-3"/> */}
                <p>{channelData.bio}</p>
            </div>
            <div className="lg:w-1/3 lg:pl-5">
                {channelData?.socials && <h2 className='text-2xl font-bold mt-4 mb-3'>Social Links</h2>}
                {/* {channelData?.socials && <hr className="rounded-md border-zinc-500 mt-2 mb-3"/>} */}
                <div className="flex items-center gap-x-5">
                    {channelData?.socials?.instagram && (
                        <a className="w-min block" rel="noopener noreferrer" target="_blank" href={channelData?.socials.instagram}><Instagram /></a>
                    )}
                    {channelData?.socials?.github && (
                        <a className="w-min block" rel="noopener noreferrer" target="_blank" href={channelData?.socials.github}><Github className="fill-primary" /></a>
                    )}
                    {channelData?.socials?.linkedin && (
                        <a className="w-min block" rel="noopener noreferrer" target="_blank" href={channelData?.socials.linkedin}><Linkedin /></a>
                    )}
                    {channelData?.socials?.facebook && (
                        <a className="w-min block" rel="noopener noreferrer" target="_blank" href={channelData?.socials.facebook}><Facebook /></a>
                    )}
                    {channelData?.socials?.x && (
                        <a className="w-min block" rel="noopener noreferrer" target="_blank" href={channelData?.socials.x}><X /></a>
                    )}
                    {channelData?.socials?.website && (
                        <a className="w-min block" rel="noopener noreferrer" target="_blank" href={channelData?.socials.website}><Website className="w-[25px] h-[25px] fill-primary" /></a>
                    )}
                </div>
            </div>
            </div>
            <div className={`${channelData.bio ? "mt-5" : ""} flex items-center`}>
                <Calendar className='w-4 h-4 mr-3 inline-block ' />
                <span className=''>Joined {joinedAt(channelData.createdAt)} </span>
            </div>
        </div>
    )
}

export default ChannelAbout
