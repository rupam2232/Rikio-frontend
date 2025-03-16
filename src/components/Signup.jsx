import React, { useState, useEffect, useRef } from 'react'
import axios from "../utils/axiosInstance.js"
import errorMessage from "../utils/errorMessage.js"
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, FormInput as Input, Logo, ArrowBack } from './index.js'
import toast from "react-hot-toast"
import { useDispatch, useSelector } from 'react-redux'
import { logout, login } from '../store/authSlice.js'
import { RotateCw as Refresh } from 'lucide-react'

function Signup() {
    const [fullName, setFullName] = useState("");
    const [isFullNameChecked, setIsFullNameChecked] = useState(false);
    const [email, setEmail] = useState("");
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const [password, setPassword] = useState("");
    const [isPasswordChecked, setIsPasswordChecked] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isConfirmPasswordChecked, setIsConfirmPasswordChecked] = useState(false);
    const [username, setUsername] = useState("");
    const [isUsernameValid, setIsUsernameValid] = useState(false);
    const [isUsernameChecked, setIsUsernameChecked] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [sendOtpBtn, setSendOtpBtn] = useState("send otp")
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [handleRefreshAnimation, setHandleRefreshAnimation] = useState(false)
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const inputRefs = useRef([]);
    const step = searchParams.get('step') || "1";
    const [step1, setStep1] = useState(false);
    const [step2, setStep2] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.userData);

    useEffect(() => {
        if (step !== "1" && step !== "2" && step !== "3") {
            navigate("/signup?step=1")
        }
        if (step === "2") {
            if (step1 === false) {
                navigate("/signup?step=1")
            }
        } else if (step === "3") {
            if (step1 === false) {
                navigate("/signup?step=1")
            } else if (step2 === false) {
                navigate("/signup?step=2")
            }
        }
    }, [step])

    useEffect(() => {
        const checkUsername = async () => {
            if (username?.length > 2) {
                if (!username.match(/^[a-zA-Z0-9_-]+$/) || username.length < 3 || username.length > 12) {
                    setIsUsernameValid(false);
                    setIsUsernameChecked(true);
                    setStep1(false);
                    return;
                }
                try {
                    const response = await axios.get(`/users/check-username/${username.toLowerCase()}`);
                    setIsUsernameValid(response.data.data);
                    if (response.data.data === false) setStep1(false);
                    setIsUsernameChecked(true);
                } catch (error) {
                    console.error('Error checking username', error);
                }
            } else {
                setIsUsernameChecked(false);
                setStep1(false);
            }
        };
        checkUsername();
    }, [username]);

    const handleFullNameChange = (e) => {
        setFullName(e.target.value)
        if (e.target.value === "") {
            setErrors({ ...errors, fullName: { type: 'manual', message: 'Full Name is required*' } })
            setStep1(false);
        } else if (e.target.value.length < 3 || e.target.value.length > 30) {
            setErrors({ ...errors, fullName: { type: 'manual', message: 'Full Name must be min 3 characters max 30 characters' } })
            setStep1(false);
        } else if (!e.target.value.match(/^[a-zA-Z. ]+$/)) {
            setErrors({ ...errors, fullName: { type: 'manual', message: 'Full name can only contain alphabets' } })
            setStep1(false);
        } else {
            setErrors({ ...errors, fullName: null })
        }
        setIsFullNameChecked(true)
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
        if (e.target.value === "") {
            setErrors({ ...errors, email: { type: 'manual', message: 'Email is required*' } })
            setStep1(false);
        } else if (!e.target.value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
            setErrors({ ...errors, email: { type: 'manual', message: 'Email address must be a valid address' } })
            setStep1(false);
        } else {
            setErrors({ ...errors, email: null })
        }
        setIsEmailChecked(true)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
        if (e.target.value === "") {
            setErrors({ ...errors, password: { type: 'manual', message: 'Password is required*' } })
            setStep2(false);
        } else if (!e.target.value.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&.,:;'"<>?() \[\] {}|\\/~`_^+-]{8,}$/)) {
            setErrors({ ...errors, password: { type: 'manual', message: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character' } })
            setStep2(false);
        } else {
            setErrors({ ...errors, password: null })
        }
        setIsPasswordChecked(true)
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value)
        if (e.target.value === "") {
            setErrors({ ...errors, confirmPassword: { type: 'manual', message: 'Confirm Password is required*' } })
            setStep2(false);
        } else if (e.target.value !== password) {
            setErrors({ ...errors, confirmPassword: { type: 'manual', message: 'Passwords must match' } })
            setStep2(false);
        } else {
            setErrors({ ...errors, confirmPassword: null })
        }
        setIsConfirmPasswordChecked(true)
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
        if (e.target.value === "") {
            setErrors({ ...errors, username: { type: 'manual', message: 'Username is required*' } })
            setStep1(false);
        } else if (e.target.value.length < 3) {
            setErrors({ ...errors, username: { type: 'manual', message: 'Username must be at least 3 characters' } })
            setStep1(false);
        } else if (e.target.value.length > 12) {
            setErrors({ ...errors, username: { type: 'manual', message: 'Username must be at most 12 characters' } })
            setStep1(false);
        } else if (!e.target.value.match(/^[a-zA-Z0-9_-]+$/) || e.target.value.length < 3 || e.target.value.length > 12) {
            setErrors({ ...errors, username: { type: 'manual', message: 'Username can only contain letters, digits, underscores, and hyphens, and cannot have spaces' } })
            setStep1(false);
        } else {
            setErrors({ ...errors, username: null })
        }
    }

    const handleOtpChange = (index, value) => {
        const newCode = [...otp];

        // Handle pasted content
        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split("");
            for (let i = 0; i < 6; i++) {
                newCode[i] = pastedCode[i] || "";
            }
            setOtp(newCode);

            // Focus on the last non-empty input or the first empty one
            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
            inputRefs.current[focusIndex].focus();
        } else {
            newCode[index] = value;
            setOtp(newCode);

            // Move focus to the next input field if value is entered
            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const counter = (message) => {
        let counter = 30
        let clear = setInterval(() => {
            setSendOtpBtn(`${counter}s`);
            counter -= 1;
            if (counter === 0) {
                setSendOtpBtn(message)
                clearInterval(clear)
            }
        }, 1000);
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSendOtp = async () => {
        setSendOtpBtn("sending...")
        setHandleRefreshAnimation(true)
        const newCode = [...otp];
        try {
            const response = await axios.post(`otp/send-otp/register`, { email, fullName })
            if (response.data.data !== true) {
                toast.error(response.data.message, {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })

                for (let i = 0; i < 6; i++) {
                    newCode[i] = "";
                }
                setOtp(newCode);
                setIsOtpSent(false);
                counter("resend otp");
                setHandleRefreshAnimation(false);
                return;
            } else {
                toast.success(response.data.message, {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })

                for (let i = 0; i < 6; i++) {
                    newCode[i] = "";
                }
                setOtp(newCode);
                setIsOtpSent(true);
                counter("resend otp");
                setHandleRefreshAnimation(false);
                return;
            }

        } catch (error) {
            setIsOtpSent(false)
            toast.error(errorMessage(error), {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            setHandleRefreshAnimation(false);
            counter("resend otp");
        }
    }

    const handleStep1 = async (e) => {
        e.preventDefault();

        if (errors.fullName || errors.email || errors.username) {
            setStep1(false);
            return;
        }

        const response = await axios.get(`/users/check-email/${email}`)
        if (!response.data.data) {
            setErrors({ ...errors, email: { type: 'manual', message: 'Email is already in use' } });
            setStep1(false);
            return;
        }

        setStep1(true);
        navigate("/signup?step=2");
    }

    const handleStep2 = async (e) => {
        e.preventDefault();

        if (errors.password || errors.confirmPassword) {
            setStep2(false);
            return;
        }

        setStep2(true);
        navigate("/signup?step=3");
    }

    const SingUpForm = async (e) => {
        e.preventDefault();
        const joinedOtp = otp.join("")
        setIsSubmitting(true)
        const newCode = [...otp];
        try {
            const registerResponse = await axios.post(`users/register`, { fullName, email, username, password, otp: joinedOtp });
            toast.success(registerResponse.data.message, {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            try {
                const loginResponse = await axios.post(`/users/login`, { email, username, password })
                toast.success(loginResponse.data.message, {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
                dispatch(login({ userData: loginResponse.data.data.user }))
                navigate("/")
            } catch (error) {
                toast.error(errorMessage(error), {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
                dispatch(logout())
                for (let i = 0; i < 6; i++) {
                    newCode[i] = "";
                }
                setOtp(newCode);
                setIsSubmitting(false)
            }
        } catch (error) {
            toast.error(errorMessage(error), {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            dispatch(logout())
            for (let i = 0; i < 6; i++) {
                newCode[i] = "";
            }
            setOtp(newCode);
            setIsSubmitting(false)
        }
    }

    const copyFunction = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText("");
    }

    if (user) {
        return (
            <div className="flex h-full items-center justify-center w-full py-8">
                <div className={`mx-auto w-full max-w-lg rounded-xl p-10 border border-border bg-opacity-50 backdrop-filter backdrop-blur-xl shadow-lg  overflow-hidden shadow-slate-500 relative`}>
                    <div className="mb-2 flex flex-col items-center space-y-4">
                        <NavLink to="/" className="inline-block relative left-3 w-full max-w-[100px] cursor-pointer" title='Limo'>
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
            <div className="flex h-full items-center justify-center w-full py-8">
                <div className={`mx-auto w-full max-w-lg rounded-xl p-10 border border-border bg-opacity-50 backdrop-filter backdrop-blur-xl shadow-lg  overflow-hidden shadow-slate-500 relative`}>
                    <Button type="button" title="back" className={`text-2xl shadow-slate-500 bg-transparent hover:bg-transparent flex justify-center items-center font-bold absolute h-max w-max`} onClick={() => navigate(`/signup?step=${parseInt(step) - 1}`)} disabled={step === "1" ? true : false}>
                        <ArrowBack height="24px" width="24px" className={`relative left-1 fill-primary`} />
                    </Button>
                    <div className="mb-2 flex justify-center">
                        <NavLink className="inline-block relative left-2 w-full max-w-[100px] cursor-pointer" title='Limo' to="/">
                            <Logo width="100%" />
                        </NavLink>
                    </div>
                    <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                    <p className="mt-2 mb-2 text-center text-base text-primary/70">
                        Already have an account?&nbsp;
                        <NavLink
                            to="/login"
                            className="font-medium text-primary transition-all duration-200 underline text-text"
                        >
                            Log In
                        </NavLink>
                    </p>

                    <form onSubmit={SingUpForm}>
                        <div className={`space-y-5 `}>
                            <div className={`w-full ${step === "1" ? "" : "hidden"}`}>
                                <Input
                                    label="Full Name: "
                                    placeholder="Enter your full name"
                                    name="fullName"
                                    value={fullName}
                                    required
                                    onChange={handleFullNameChange}
                                    aria-invalid={errors.fullName ? "true" : "false"}
                                />
                                {isFullNameChecked && errors.fullName && <p role='alert' className="text-red-500 text-sm italic">{errors.fullName.message}</p>}
                            </div>
                            <div className={`w-full ${step === "1" ? "" : "hidden"}`} >
                                <Input
                                    label="Email: "
                                    placeholder="Enter your email"
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    aria-invalid={errors.email ? "true" : "false"}
                                />
                                {isEmailChecked && errors.email && <p role='alert' className="text-red-500 text-sm italic">{errors.email.message}</p>}
                            </div>

                            <div className={`w-full relative ${step === "1" ? "" : "hidden"}`}>
                                <Input label="Username: "
                                    className="lowercase"
                                    autoComplete="username"
                                    placeholder="Create your unique username"
                                    name="username"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    aria-invalid={(errors.username || !isUsernameValid) ? "true" : "false"}
                                />
                                {errors.username && <p role='alert' className="text-red-500 text-sm italic">{errors.username.message}</p>}
                                {!errors.username && isUsernameChecked && (isUsernameValid ? <p className='text-sm text-green-600'>Username is available</p> : <p className='text-sm text-red-600'>Username is not available</p>)}
                            </div>

                            <div className={`w-full ${step === "2" ? "" : "hidden"}`}>
                                <Input
                                    label="Password: "
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Enter your password"
                                    name="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onCopy={copyFunction}
                                    aria-invalid={errors.password ? "true" : "false"}
                                />
                                {isPasswordChecked && errors.password && <p role='alert' className="text-red-500 text-sm italic">{errors.password.message}</p>}
                            </div>
                            <div className={`w-full ${step === "2" ? "" : "hidden"}`}>
                                <Input
                                    label="Confirm Password: "
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Confirm your password"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    onCopy={copyFunction}
                                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                                />
                                {isConfirmPasswordChecked && errors.confirmPassword && <p role='alert' className="text-red-500 text-sm italic">{errors.confirmPassword.message}</p>}
                            </div>
                            <div className={`w-full mb-10 ${step === "3" ? "" : "hidden"}`}>
                                <h2 className='text-lg font-bold mb-3 text-center bg-gradient-to-r from-primary/70 to-primary text-transparent bg-clip-text'>
                                    Verify Your Email <span className="underline">{`${email}`}</span>
                                </h2>
                                <p className='text-center text-primary/80 mb-6'>Enter the 6-digit code sent to your email address.</p>
                                <div className='flex justify-between mb-4'>
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type='number'
                                            maxLength='6'
                                            value={digit}
                                            disabled={!isOtpSent}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className='w-12 h-12 text-center text-2xl font-bold bg-background/80 text-primary border-2 border-primary/30 rounded-lg focus:border-primary focus:outline-none'
                                        />
                                    ))}
                                </div>
                                <div className="w-ful flex justify-end">
                                    <Button className={`flex justify-center gap-2 w-max text-primary hover:bg-transparent shadow-none bg-transparent`} onClick={handleSendOtp} disabled={sendOtpBtn !== "send otp" && sendOtpBtn !== "resend otp"}>
                                        <Refresh height="24px" width="24px" className={`${handleRefreshAnimation && "animate-spin"} relative left-1`} />
                                        {sendOtpBtn}
                                    </Button>
                                </div>
                            </div>

                            <div className={`w-full justify-between flex ${step === "3" && "!mb-5"}`}>


                                {step === "1" && (
                                    <Button type="button" className={`w-full`} onClick={handleStep1} disabled={(errors.fullName || errors.email || errors.username || !isUsernameValid || !fullName || !username || !email)}>
                                        Next
                                    </Button>
                                )
                                }

                                {step === "2" && (
                                    <Button type="button" className={`w-full`} onClick={handleStep2} disabled={(errors.password || errors.confirmPassword || !password || !confirmPassword)}>
                                        Next
                                    </Button>
                                )}

                                {step === "3" && (
                                    <Button type="submit" className={`w-full`} disabled={errors.otp || isSubmitting || otp.some((field) => field?.trim() === "")}>
                                        {isSubmitting ? "Creating account..." : "Verify & Create Account"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                    {step === "3" && <p className='text-sm font-light text-primary/70 absolute bottom-2'>If the OTP is not found in your inbox, then check in your spam folder.</p>}
                </div>
            </div>
        )
    }

}

export default Signup