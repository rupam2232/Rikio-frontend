import React, { useId } from 'react'
import { Eye as OpenEye, EyeClosed as CloseEye } from 'lucide-react'

const FormInput = React.forwardRef(function Input({
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

        <div className={`relative inline-block w-full ${(type === "password" && label === "Password: ")? "border-zinc-500 border rounded-lg flex items-center focus-within:outline-none focus-within:ring-1 focus-within:ring-ring": ""}`}>
            {type === "password" && label === "Password: " ? <input
                type={see ? "text" : type}
                className={`px-3 py-2 rounded-lg bg-transparent outline-none focus:bg-transparent duration-200 w-[90%] flex text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className}`}
                ref={ref}
                {...props}
                id={id}
            /> :
            <input
                type={type}
                className={`${px} ${py} rounded-lg bg-transparent outline-none focus:bg-transparent duration-200 w-full flex border border-zinc-500 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className} `}
                ref={ref}
                {...props}
                id={id}
            />}

            {type === "password" && label === "Password: " && (see ? <button type='button' className='w-[10%] h-9 hover:bg-primary/10  cursor-pointer bg-primary/5 z-30 group transition-colors flex items-center justify-center' onClick={changeSee}>
                <OpenEye />
            </button> : <button type='button' className='w-[10%] h-9 hover:bg-primary/10  cursor-pointer bg-primary/5 z-30 group transition-colors flex items-center justify-center' onClick={changeSee}>
                <CloseEye />
            </button>)}
            </div>
        </>
    )
})

export default FormInput
