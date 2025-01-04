import React, { useState, useEffect } from 'react'
import axios from "../utils/axiosInstance.js"
import errorMessage from "../utils/errorMessage.js"
import { NavLink, useNavigate } from "react-router-dom"
import { Logo, Button, Input } from "./index.js"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useDispatch } from 'react-redux'
import { logout, login } from '../store/authSlice.js'

function Login() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const tryLogin = async (data) => {
        try {
            let loginResponse = await axios.post(`/users/login`, {
                email: data.emailOrUsername,
                username: data.emailOrUsername,
                password: data.password
            })

            dispatch(login({userData: loginResponse.data.data.user}))
            toast.success(loginResponse.data.message,{
                style:{ color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            navigate("/")

        } catch (error) {
            dispatch(logout())
            toast.error(errorMessage(error),{
                style:{ color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
        }
    }

    return (
        <div className='flex items-center justify-center w-full py-8'>
            <div className={`mx-auto w-full max-w-lg rounded-xl p-10 border border-border bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl shadow-lg overflow-hidden shadow-slate-500`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px] cursor-pointer" title='Logo' onClick={() => navigate("/")}>
                        <Logo className="fill-black w-full" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight text-secondary">Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-text">
                    Don&apos;t have any account?&nbsp;
                    <NavLink
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 underline text-text"
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
                        >{isSubmitting ? "Loging..." : "Log in"}</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login