import { useRef, useMemo } from "react";
import VideoPlayer from "./VideoPlayer.jsx";

const Video = ({poster, src, autoplay=false}) => {
    const playerRef = useRef(null);

    const videoJsOptions = useMemo(() => (
        {autoplay: autoplay,
        controls: true,
        responsive: true,
        fluid: false,
        playbackRates : [0.1, 0.5, 1, 1.5, 2, 4],
        poster: poster,
        sources: [
            {
                src: src,
                type: "video/mp4",
            },
        ],}
    ), [src, poster, autoplay]);

    const handlePlayerReady = (player) => {
        playerRef.current = player;
    };
    
    return (
        <>
            <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
        </>
    );
};

export default Video;
