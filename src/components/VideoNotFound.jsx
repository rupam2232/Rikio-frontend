import React from 'react'
import { VideoNotAvl } from './index.js'

const VideoNotFound = () => {
  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 overflow-hidden">
                <div className="flex h-full items-center justify-center">
                    <div className="w-full max-w-sm text-center">
                        <p className="mb-3 w-full">
                            <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                                <VideoNotAvl />
                            </span>
                        </p>
                        <h5 className="mb-2 font-semibold">No videos available</h5>
                        <p>There are no videos here available. Please try to search some thing else.</p>
                    </div>
                </div>
    </section>
  )
}

export default VideoNotFound
