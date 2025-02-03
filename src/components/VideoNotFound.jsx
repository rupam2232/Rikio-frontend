import React from 'react'
import { VideoNotAvl } from './index.js'

const VideoNotFound = ({pText, className}) => {
  return (
    <div className={`w-full h-full pb-[70px] sm:pb-0 overflow-hidden ${className}`}>
                <div className="flex h-full items-center justify-center">
                    <div className="w-full max-w-sm text-center">
                        <p className="mb-3 w-full">
                            <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                                <VideoNotAvl />
                            </span>
                        </p>
                        {/* There are no videos here available. Please try to search some thing else. */}
                        <h5 className="mb-2 font-semibold">No videos available</h5>
                        <p>{pText}</p>
                    </div>
                </div>
    </div>
  )
}

export default VideoNotFound
