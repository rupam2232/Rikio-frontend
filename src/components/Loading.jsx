import React from 'react'

const Loading = ({children, className, left, width, hieght}) => {
  return (
    <div className={`bg-transparent flex justify-center items-center relative border-4 after:content-[div] after:w-full after:h-2 after:text-red-600 rounded-full border-white ${className}`}>
      <div className={`absolute ${left} ${width} ${hieght} z-20 bg-[#121212] top-1/2 animate-spin origin-right`}></div>
      {children}
    </div>
  )
}

export default Loading
