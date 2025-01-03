import React from 'react'

const Loading = ({ children, className, left, width, hieght }) => {
  return (
    <>
      <div className={`bg-transparent flex justify-center items-center absolute border-4 rounded-full border-primary ${className}`}>
        <div className={`absolute ${left} ${width} ${hieght} z-20 bg-background top-1/2 animate-spin origin-right`}></div>
      </div>
      {children}
    </>
  )
}

export default Loading
