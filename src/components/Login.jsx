import axios from "../utils/axiosInstance.js"
import errorMessage from "../utils/errorMessage.js"
import { NavLink, useNavigate } from "react-router-dom"
import { Logo, Button, FormInput as Input } from "./index.js"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import conf from '../conf/conf.js'
import { useDispatch, useSelector } from 'react-redux'
import { logout, login } from '../store/authSlice.js'
import { LoaderCircle } from 'lucide-react';

function Login() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.userData);

    const tryLogin = async (data) => {
        try {
            let loginResponse = await axios.post(`/users/login`, {
                email: data.emailOrUsername,
                username: data.emailOrUsername,
                password: data.password
            })

            dispatch(login({ userData: loginResponse.data.data.user }))
            toast.success(loginResponse.data.message, {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            navigate("/")

        } catch (error) {
            dispatch(logout())
            toast.error(errorMessage(error), {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
        }
    }

    if (user) {
        return (
                    <div className="flex h-full items-center justify-center w-full py-8">
                        <div className={`mx-auto w-full max-w-lg rounded-xl p-10 border border-border bg-opacity-50 backdrop-filter backdrop-blur-xl shadow-lg  overflow-hidden shadow-slate-500 relative`}>
                            <div className="mb-2 flex flex-col items-center space-y-4">
                                <NavLink to="/" className="inline-block relative left-3 w-full max-w-[100px] cursor-pointer" title={conf.appName}>
                                    <Logo width="100%" />
                                </NavLink>
                            <p className='text-center'>You are already logged In.Please logout first to use this page.</p>
                            <Button onClick={()=> navigate("/")}>Go back home</Button>
                            </div>
                        </div>
                    </div>
                )
    } else {
        return (
            <div className='flex h-full items-center justify-center w-full py-8'>
                <div className={`mx-auto w-full max-w-lg rounded-xl p-10 border border-border bg-opacity-50 backdrop-filter backdrop-blur-xl shadow-md overflow-hidden shadow-slate-500`}>
                    <div className="mb-2 flex justify-center">
                        <NavLink className="inline-block relative left-2 w-full max-w-[100px] cursor-pointer" title={conf.appName} to="/">
                            <Logo className="w-full" />
                        </NavLink>
                    </div>
                    <h2 className="text-center text-2xl font-bold leading-tight">Login to your account</h2>
                    <p className="mt-2 text-center text-base text-primary/70">
                        Don&apos;t have an account?&nbsp;
                        <NavLink
                            to="/signup"
                            className="font-medium text-primary transition-all duration-200 underline text-"
                        >
                            Sign Up
                        </NavLink>
                    </p>
                    <form onSubmit={handleSubmit(tryLogin)} className='mt-8'>
                        <div className='space-y-5'>
                            <div className="w-full">
                                <Input
                                    label="Email or Username: "
                                    placeholder="Enter your email or username"
                                    type="text"
                                    name="emailOrUsername"
                                    autoComplete="username"
                                    {...register("emailOrUsername", {
                                        required: true,
                                    })}
                                    aria-invalid={errors.emailOrUsername ? "true" : "false"}
                                />
                                {errors.emailOrUsername?.type === 'required' && <p role="alert" className='text-red-500 text-sm italic'>Email or a username is required*</p>}
                            </div>
                            <div className="w-full">
                                <Input
                                    label="Password: "
                                    type="password"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    {...register("password", {
                                        required: true,
                                    })}
                                    aria-invalid={errors.password ? "true" : "false"}
                                />
                                {errors.password?.type === 'required' && <p role="alert" className='text-red-500 text-sm italic'>Password is required*</p>}
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >{isSubmitting ? <><span className="animate-spin"><LoaderCircle /></span>Loging...</> : "Log in"}</Button>
                        </div>
                    </form>
                    <p className='text-sm font-light text-primary/70 mt-3'>By continuing, you agree to our <NavLink to="/terms" className="underline">Terms & Conditions</NavLink> and <NavLink to="/privacy" className="underline">Privacy Policy.</NavLink></p>
                </div>
            </div>
        )
    }
}

export default Login