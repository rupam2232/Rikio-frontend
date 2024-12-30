import React, { useId } from 'react'
import { OpenEye, CloseEye } from "./index.js"

const Input = React.forwardRef(function Input({
    type = "text",
    label,
    className = "",
    px = "px-3",
    py = "py-2",
    ...props
}, ref) {
    const id = useId()
    const [see, useSee] = React.useState(false)

    const changeSee = ()=>{
        useSee(!see)
    }

    return (
        <>
            {label && <label
                className='inline-block mb-1 pl-1 text-text cursor-pointer'
                htmlFor={id}>
                {label}
            </label>
            }

        <div className="relative inline-block w-full">
            {type === "password" && label === "Password: " ? <input
                type={see ? "text" : type}
                className={`pl-3 pr-12 py-2 focus:border-white rounded-lg bg-transparent text-text outline-none focus:bg-transparent duration-200 border border-gray-700 w-full ${className}`}
                ref={ref}
                {...props}
                id={id}
            /> :
            <input
                type={type}
                className={`${px} ${py} focus:border-white rounded-lg bg-transparent text-text outline-none focus:bg-transparent duration-200 border border-gray-700 w-full ${className}`}
                ref={ref}
                {...props}
                id={id}
            />}

            {type === "password" && label === "Password: " && (see ? <button type='button' className='w-fit bg-slate-500 p-2 rounded-full cursor-pointer hover:bg-slate-400 z-30 group absolute top-1/2 right-[10px] -translate-y-1/2 transition-colors' onClick={changeSee}>
                <OpenEye classname="fill-background" />
            </button> : <button type='button' className='w-fit hover:bg-slate-400 p-2 rounded-full cursor-pointer bg-slate-500 z-30 group absolute top-1/2 right-[10px] -translate-y-1/2 transition-colors' onClick={changeSee}>
                <CloseEye classname="fill-background" />
            </button>)}
            </div>
        </>
    )
})

export default Input
