import { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import '@videojs/themes/dist/fantasy/index.css';

const VideoPlayer = ({ options, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) {

      const videoElement = document.createElement("video-js");

      videoElement.classList.add('vjs-big-play-centered', "h-full", "w-full", "rounded-lg");
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        onReady && onReady(player);
      });

      const videoRefElement = videoRef.current;
      videoRefElement.addEventListener("contextmenu", (event) => {
        event.preventDefault();
      });
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);


  return (
    <div data-vjs-player className="w-full h-full">
      <div ref={videoRef} className="w-full h-full object-cover rounded-lg video-js vjs-theme-fantasy" />
    </div>
  );
};

export default VideoPlayer;
