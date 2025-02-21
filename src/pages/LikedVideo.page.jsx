import { useState } from 'react'
import { ChannelVideo } from '../components/index.js'
const LikedVideo = () => {
    const [showHeading, setshowHeading] = useState(true)
    return (
        <section className="w-full p-4 pt-0 mb-10">
            {showHeading &&
                <>
                    <div className="w-full mt-4 px-4">
                        <h1 className="font-medium text-2xl">Liked Videos</h1>
                    </div>
                    <hr className="my-4 border-primary" />
                </>
            }
            <ChannelVideo likedVideos={true} showLikedVideoHeading={setshowHeading} />
        </section>
    )
}

export default LikedVideo
