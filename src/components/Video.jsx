import { useRef, useMemo } from "react";
import VideoPlayer from "./VideoPlayer.jsx";
import { useSelector } from 'react-redux'
import { useLocation } from "react-router-dom";
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'

const Video = ({ poster, src, autoplay = false }) => {
    const playerRef = useRef(null);
    const isAddedToHistory = useRef(false);
    const userStatus = useSelector((state) => state.auth.status);
    const location = useLocation();
    const videoId = location.pathname.split("/")[2]
    const userTimeZoneOffset = new Date().getTimezoneOffset();

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

        player.on("timeupdate", () => {
            const currentTime = player.currentTime();
            if (player.duration() >= 5) {
                if (currentTime >= 5 && userStatus) {
                    if (!isAddedToHistory.current) {
                        isAddedToHistory.current = true
                        axios.post('/users/add-history/', { videoId, userTimeZoneOffset })
                            .catch((error) => {
                                console.error(errorMessage(error))
                            })
                            .finally(()=>{
                                isAddedToHistory.current = true
                            })
                    
                            
                    }
                }
            } else {
                if (userStatus) {
                    if (!isAddedToHistory.current) {
                        isAddedToHistory.current = true
                        axios.post('/users/add-history/', { videoId, userTimeZoneOffset })
                            .catch((error) => {
                                console.error(errorMessage(error))
                            })
                            .finally(()=>{
                                isAddedToHistory.current = true
                            })
                    }
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
