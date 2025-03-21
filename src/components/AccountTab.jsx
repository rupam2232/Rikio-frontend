import { useState, useRef, useEffect } from 'react'
import { Button, Input } from './index.js'
import { LoaderCircle, X, Check, RotateCw as Refresh } from 'lucide-react';
import errorMessage from '../utils/errorMessage.js';
import axios from '../utils/axiosInstance.js';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice.js';

const AccountTab = ({ user, setRecheckUser }) => {
    const [loader, setLoader] = useState(null)
    const [errors, setErrors] = useState({});
    const [email, setEmail] = useState(user?.email ? user.email : "");
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false)
    const [username, setUsername] = useState(user?.username ? user.username : "");
    const [isUsernameValid, setIsUsernameValid] = useState(false);
    const [isUsernameChecked, setIsUsernameChecked] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [sendOtpBtn, setSendOtpBtn] = useState("send otp")
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpValid, setIsOtpValid] = useState(null)
    const [password, setPassword] = useState("")
    const [openPasswordPopup, setOpenPasswordPopup] = useState(false)
    const [handleRefreshAnimation, setHandleRefreshAnimation] = useState(false)
    const inputRefs = useRef([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const checkUsername = async () => {
            if (username.trim().toLowerCase() === user.username) {
                setIsUsernameValid(false);
                setIsUsernameChecked(false);
                return;
            }
            if (username?.length > 2) {
                if (!username.match(/^[a-zA-Z0-9_-]+$/) || username.length < 3 || username.length > 12) {
                    setIsUsernameValid(false);
                    setIsUsernameChecked(false);
                    return;
                }
                try {
                    const response = await axios.get(`/users/check-username/${username.toLowerCase()}`);
                    setIsUsernameValid(response.data.data);
                    setIsUsernameChecked(true);
                } catch (error) {
                    console.error('Error checking username', error);
                }
            } else {
                setIsUsernameChecked(false);
            }
        };
        checkUsername();
    }, [username]);

    useEffect(() => {
        const checkEmail = async () => {
            if (email.trim().toLowerCase() === user.email) {
                setIsEmailValid(false);
                setIsEmailChecked(false);
                return;
            }
            if (email?.length > 2) {
                if (!email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
                    setIsEmailValid(false);
                    setIsEmailChecked(false);
                    return;
                }
                try {
                    const response = await axios.get(`/users/check-email/${email.trim().toLowerCase()}`);
                    setIsEmailValid(response.data.data);
                    setIsEmailChecked(true);
                } catch (error) {
                    console.error('Error checking email', error);
                }
            } else {
                setIsEmailChecked(false);
            }
        };
        checkEmail();
    }, [email])


    const handleEmailChange = (e) => {
        setEmail(e.target.value)
        if (e.target.value === "") {
            setErrors({ ...errors, email: { type: 'manual', message: 'Email is required*' } })
        } else if (!e.target.value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
            setErrors({ ...errors, email: { type: 'manual', message: 'Email address must be a valid address' } })
        } else {
            setErrors({ ...errors, email: null })
        }
        setIsEmailChecked(true)
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
        if (e.target.value === "") {
            setErrors({ ...errors, username: { type: 'manual', message: 'Username is required*' } })
        } else if (e.target.value.length < 3) {
            setErrors({ ...errors, username: { type: 'manual', message: 'Username must be at least 3 characters' } })
        } else if (e.target.value.length > 12) {
            setErrors({ ...errors, username: { type: 'manual', message: 'Username must be at most 12 characters' } })
        } else if (!e.target.value.match(/^[a-zA-Z0-9_-]+$/) || e.target.value.length < 3 || e.target.value.length > 12) {
            setErrors({ ...errors, username: { type: 'manual', message: 'Username can only contain letters, digits, underscores, and hyphens, and cannot have spaces' } })
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

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const counter = (message) => {
        let counter = 60
        let clear = setInterval(() => {
            setSendOtpBtn(`${counter}s`);
            counter -= 1;
            if (counter === 0) {
                setSendOtpBtn(message)
                clearInterval(clear)
            }
        }, 1000);
    }

    const handleSendOtp = async () => {
        if (isOtpValid) {
            return;
        }
        if(sendOtpBtn !== "send otp" && sendOtpBtn !== "resend otp") {
            return;
        }
        setSendOtpBtn("sending...")
        setHandleRefreshAnimation(true)
        const newCode = [...otp];
        try {
            const response = await axios.post(`otp/send-otp/register`, { email, fullName: user.fullName })
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

    const verifyOtp = () => {
        if (isOtpValid) {
            return;
        }
        setLoader(true)
        axios.post("/otp/verify-otp", { email, otp: otp.join(""), context: "register" })
            .then((res) => {
                setIsOtpValid(res.data.data)
                toast.success(res.data.message, {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
            })
            .catch((err) => {
                setIsOtpValid(false)
                toast.error(errorMessage(err), {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
                setOtp(["", "", "", "", "", ""])
            })
            .finally(() => {
                setLoader(false)
            })
    }

    const onFormSubmit = (e) => {
        e.preventDefault();
        if (!isOtpValid && (email.trim().toLowerCase() !== user.email.trim().toLowerCase())) {
            toast.error("Please verify your email", {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            return;
        }
        if ((email.trim().toLowerCase() === user.email.trim().toLowerCase()) && (username.trim().toLowerCase() === user.username.trim().toLowerCase())) {
            toast.error("Make any changes to proceed", {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            return;
        }

        if (!password) {
            toast.error("Enter your password", {
                style: { color: "#ffffff", backgroundColor: "#333333" },
                position: "top-center"
            })
            return;
        }
        setLoader(true)
        axios.patch("/users/update-account", { email: email.trim().toLowerCase(), username: username.trim().toLowerCase(), password, isOtpValid })
            .then((res) => {
                toast.success(res.data.message, {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
                setIsEmailValid(false)
                setIsOtpValid(null)
                setOtp(["", "", "", "", "", ""])
                setPassword("")
                setIsOtpSent(false)
                setSendOtpBtn("send otp")
                setHandleRefreshAnimation(false)
                setErrors({})
                setIsEmailChecked(false)
                setIsUsernameChecked(false)
            })
            .catch((err) => {
                console.error(errorMessage(err))
                toast.error(errorMessage(err), {
                    style: { color: "#ffffff", backgroundColor: "#333333" },
                    position: "top-center"
                })
                if (err.status === 401) {
                    dispatch(logout())
                    navigate("/login")
                }
            })
            .finally(() => {
                setLoader(false)
                setOpenPasswordPopup(false)
                setTimeout(() => {
                    setRecheckUser(recheckUser => !recheckUser)
                }, 3000);
            })

    }


    return (
        <div className="py-4 px-1 rounded">
            <h1 className="font-medium text-xl">Account</h1>
            <p className='text-sm text-primary/80'>Update your account settings.</p>
            <hr className="my-2 border-primary" />

            <form className="space-y-4 relative" onSubmit={onFormSubmit}>
                {loader && <div className='fixed inset-0 z-[41] bg-accent/50 flex justify-center items-center'>
                    <div className='bg-background p-6 rounded-lg shadow-xl'>
                        <LoaderCircle className='size-14 animate-spin' />
                    </div>
                </div>}

                {openPasswordPopup && <div className='fixed inset-0 z-40 bg-black/50 flex justify-center items-center'>
                    <div className='bg-background p-6 rounded-lg shadow-xl w-full sm:w-3/5 md:w-2/5'>
                        <div className='flex items-center justify-between'>
                            <p className='text-lg font-bold'>Enter Password</p>
                            <button onClick={() => setOpenPasswordPopup(false)} type='button'><X /></button>
                        </div>
                        <label htmlFor='password' className="block font-medium">Password</label>
                        <Input id="password" className="border-zinc-500" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <p className={`text-xs mt-1 text-primary/80`}>This field is required!</p>
                        <Button disabled={!password || loader} className="mt-4 w-full sm:w-auto" type="submit">Confirm</Button>
                    </div>
                </div>}

                <div>
                    <label htmlFor="email" className="block font-medium">Email</label>
                    <Input
                        id="email"
                        placeholder="Enter your email"
                        type="email"
                        name="email"
                        disabled={isOtpValid}
                        required
                        className={`lowercase ${errors.email || (isEmailChecked && !isEmailValid) ? "!border-red-500 !ring-red-500" : isEmailValid ? "focus-visible:!border-green-500 focus-visible:!ring-green-500 border-zinc-500" : "border-zinc-500"}`}
                        value={email}
                        onChange={handleEmailChange}
                        aria-invalid={errors.email ? "true" : "false"}
                    />
                    {errors.email && <p role='alert' className="text-red-500 text-xs font-bold mt-3">{errors.email.message}</p>}
                    {(email.trim().toLowerCase() === user.email) ? <p className='text-xs mt-3 text-primary/80'>Type a different email to check if it's available</p> : !errors.email && isEmailChecked && (isEmailValid ? <p className='text-xs font-bold mt-3 text-green-500'>Email is available</p> : <p className='text-xs font-bold mt-3 text-red-500'>A user with same email already exists</p>)}
                </div>

                {isEmailValid && <div className={`w-full sm:w-1/2`}>
                    <p className='text-center sm:text-left'>Enter the 6-digit code sent to your email address.</p>
                    <p className='text-xs font-light text-primary/70 mb-3'>If the OTP is not found in your inbox, then check in your spam folder.</p>

                    <div className='flex justify-between mb-2'>
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

                    {!isOtpValid && <div className="flex justify-end">
                        <Button className={`flex justify-center gap-2 w-max text-primary hover:bg-transparent shadow-none bg-transparent`} onClick={handleSendOtp} disabled={(sendOtpBtn !== "send otp" && sendOtpBtn !== "resend otp") || isOtpValid}>
                            <Refresh height="24px" width="24px" className={`${handleRefreshAnimation && "animate-spin"} relative left-1`} />
                            {sendOtpBtn}
                        </Button>
                    </div>}
                    <div>
                        <Button disabled={!isOtpSent || isOtpValid} className="disabled:opacity-70" onClick={verifyOtp}>{isOtpValid && <span><Check /></span>}{isOtpValid ? "Verified" : "Verify otp"}</Button>
                    </div>
                </div>}

                <div>
                    <label htmlFor="username" className="block font-medium">Username</label>
                    <div className={`input-parent flex items-center border border-zinc-500 rounded-md ${errors.username || ((isUsernameChecked) && !isUsernameValid) ? "!border-red-500 !ring-red-500" : isUsernameValid ? "ring-green-500 border-zinc-500" : "border-zinc-500 ring-ring"}`}>
                        <span className='text-sm pl-3 pr-1 bg-primary/20 font-medium py-2 rounded-s-md'>{window.location.host}/@</span>
                        <Input
                            id="username"
                            className={`lowercase peer border-0 pl-2 !ring-0`}
                            autoComplete="username"
                            placeholder="Set your unique username"
                            name="username"
                            value={username}
                            onChange={handleUsernameChange}
                            aria-invalid={(errors.username || !isUsernameValid) ? "true" : "false"}
                        />

                    </div>
                    {errors.username && <p role='alert' className="text-red-500 text-xs mt-3 font-bold">{errors.username.message}</p>}
                    {(username.trim().toLowerCase() === user.username) ? <p className='text-xs mt-3 text-primary/80'>Type a different username to check if it's available</p> : !errors.username && isUsernameChecked && (isUsernameValid ? <p className='text-xs font-bold mt-3 text-green-500'>Username is available</p> : <p className='text-xs font-bold mt-3 text-red-500'>Username is not available</p>)}
                </div>

                <div>
                    <Button disabled={((email.trim().toLowerCase() === user.email.trim().toLowerCase()) && (username.trim().toLowerCase() === user.username.trim().toLowerCase())) || (!isOtpValid && (email.trim().toLowerCase() !== user.email.trim().toLowerCase())) || (errors.email || errors.username) || ((user.username !== username) && !isUsernameValid) || ((user.email !== email) && !isEmailValid)} onClick={() => setOpenPasswordPopup(true)} className="w-full sm:w-auto mt-3">Update account</Button>
                </div>
                
            </form>
        </div>
    )
}

export default AccountTab
