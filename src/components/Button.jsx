import React from 'react'

const Button = ({
    children,
    type ="button",
    classname = "",
    bgcolor = "bg-blue-600",
    textcolor = "text-white",
    px = "px-4",
    py = "py-2",
    rounded = "rounded-lg",
    ...props
}) => {
  return (
    <button type={type} className={`${px} ${py} ${rounded} ${bgcolor} ${textcolor} ${classname}`} {...props}>
      {children}
    </button>
  )
}

export default Button
