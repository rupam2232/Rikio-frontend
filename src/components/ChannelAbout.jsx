import { Facebook, Linkedin, Instagram, Github, X, Website } from "./index.js"

const ChannelAbout = ({ channelData }) => {
    console.log(channelData)
    return (
        <div className='mt-4 min-h-[60vh]'>
            <div>
                <h2 className='text-2xl font-bold mt-4'>About</h2>
                <p>{channelData.bio}</p>
            </div>
            <div>
                <h2 className='text-2xl font-bold mt-4'>Social Links</h2>
                <div>
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
                        <a className="w-min block" rel="noopener noreferrer" target="_blank" href={channelData?.socials.website}><Website className="w-[30px] h-[30px]" /></a>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChannelAbout
