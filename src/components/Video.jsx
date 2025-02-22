import { useRef, useMemo, useState } from "react";
import VideoPlayer from "./VideoPlayer.jsx";
import { useSelector } from 'react-redux'
import { useLocation } from "react-router-dom";
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'

const Video = ({ poster, src, autoplay = false }) => {
    const playerRef = useRef(null);
    const userStatus = useSelector((state) => state.auth.status);
    const [addedToHistory, setAddedToHistory] = useState(false);
    const location = useLocation();
    const videoId = location.pathname.split("/")[2]
    const userTimeZoneOffset = -new Date().getTimezoneOffset();

    const videoJsOptions = useMemo(() => (
        {
            autoplay: autoplay,
            controls: true,
            responsive: true,
            fluid: false,
            playbackRates: [0.1, 0.5, 1, 1.5, 2, 4],
            poster: poster,
            sources: [
                {
                    src: src,
                    type: "video/mp4",
                },
            ],
        }
    ), [src, poster, autoplay]);

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        // Get the current playback time (in seconds)
        player.on("timeupdate", () => {
            const currentTime = player.currentTime();
            if (currentTime >= 10 && userStatus) {
                if (!addedToHistory) {
                    setAddedToHistory(true)
                    axios.post('/users/add-history/', { videoId })
                        .then((res) => {
                            console.log(res)
                        })
                        .catch((error) => {
                            setAddedToHistory(false)
                            console.error(errorMessage(error))
                        })
                    console.log(addedToHistory)
                }
            }
        });
    };

    return (
        <>
            <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
        </>
    );
};

export default Video;
