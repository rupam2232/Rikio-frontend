import { useState, useRef, useEffect } from 'react'
import { Button, Input } from './index.js'
import { Eye, EyeClosed, LoaderCircle, X, RotateCw as Refresh } from 'lucide-react';
import axios from '../utils/axiosInstance.js';
import toast from 'react-hot-toast';
import errorMessage from '../utils/errorMessage.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice.js';

const SecurityTab = ({ user, setRecheckUser }) => {
  const [loader, setLoader] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordChecked, setIsPasswordChecked] = useState(false);
  const [isConfirmPasswordChecked, setIsConfirmPasswordChecked] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [handleRefreshAnimation, setHandleRefreshAnimation] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [sendOtpBtn, setSendOtpBtn] = useState("send otp")
  const [isOtpSent, setIsOtpSent] = useState(false);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (e.target.value === "") {
      setErrors({ ...errors, password: { type: 'manual', message: 'Password is required*' } })
    } else if (!e.target.value.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&.,:;'"<>?() \[\] {}|\\/~`_^+-]{8,}$/)) {
      setErrors({ ...errors, password: { type: 'manual', message: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character' } })
    } else {
      setErrors({ ...errors, password: null })
    }

    setIsPasswordChecked(true)
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
    if (e.target.value === "") {
      setErrors({ ...errors, confirmPassword: { type: 'manual', message: 'Confirm Password is required*' } })
    } else if (e.target.value !== password) {
      setErrors({ ...errors, confirmPassword: { type: 'manual', message: 'Passwords must match' } })
    } else {
      setErrors({ ...errors, confirmPassword: null })
    }
    setIsConfirmPasswordChecked(true)
  }

  const copyFunction = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText("");
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
    if (sendOtpBtn !== "send otp" && sendOtpBtn !== "resend otp") {
      return;
    }
    setSendOtpBtn("sending...")
    setHandleRefreshAnimation(true)
    const newCode = [...otp];
    try {
      const response = await axios.post(`otp/send-otp/change-password`, { email: user.email, fullName: user.fullName })
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

  const closePopup = () => {
    setOpenPopup(false)
    const newCode = [...otp];
    for (let i = 0; i < 6; i++) {
      newCode[i] = "";
    }
    setOtp(newCode);
    setIsOtpSent(false);
    counter("send otp");
    setHandleRefreshAnimation(false);
  }

  const onFormSubmit = (e) => {
    e.preventDefault()
    if (currentPassword.trim() === "" || (isConfirmPasswordChecked && errors.confirmPassword) || (isPasswordChecked && errors.password) || password.trim() === "" || confirmPassword.trim() === "" || (password.trim() !== confirmPassword.trim()) || currentPassword.trim() === password.trim() || !isOtpSent || otp.join("").length !== 6 || loader) {
      return;
    }
    setLoader(true)
    axios.post("/users/change-password", { oldPassword: currentPassword, newPassword: password, email: user.email, otp: otp.join("") })
      .then((res) => {
        toast.success(res.data.message, {
          style: { color: "#ffffff", backgroundColor: "#333333" },
          position: "top-center"
        })
        setCurrentPassword("")
        setPassword("")
        setConfirmPassword("")
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
        setRecheckUser(reacheckUser => !reacheckUser)
        setLoader(false)
        closePopup();
      })
  }

  return (
    <div className="py-4 px-1 rounded">
      <h1 className="font-medium text-xl">Security</h1>
      <p className='text-sm text-primary/80'>Change your password.</p>
      <hr className="my-2 border-primary" />
      <form className="space-y-4 relative" onSubmit={onFormSubmit}>

        {loader && <div className='fixed inset-0 z-[41] bg-accent/50 flex justify-center items-center'>
          <div className='bg-background p-6 rounded-lg shadow-xl'>
            <LoaderCircle className='size-14 animate-spin' />
          </div>
        </div>}

        {openPopup && <div className='fixed inset-0 z-40 bg-black/50 flex justify-center items-center'>
          <div className='bg-background p-6 rounded-lg shadow-xl w-full sm:w-3/5 md:w-2/5'>
            <div className='flex items-center justify-end'>
              <button onClick={() =>{ 
                setOpenPopup(false)
                const newCode = [...otp];
                for (let i = 0; i < 6; i++) {
                  newCode[i] = "";
                }
                setOtp(newCode);
              }} type='button'><X /></button>
            </div>
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

            <div className="flex justify-end">
              <Button className={`flex justify-center gap-2 w-max text-primary hover:bg-transparent shadow-none bg-transparent`} onClick={handleSendOtp} disabled={(sendOtpBtn !== "send otp" && sendOtpBtn !== "resend otp") || loader}>
                <Refresh height="24px" width="24px" className={`${handleRefreshAnimation && "animate-spin"} relative left-1`} />
                {sendOtpBtn}
              </Button>
            </div>

            <Button disabled={otp.join("").length !== 6 || loader} className="mt-4 w-full sm:w-auto" type="submit">Continue</Button>
          </div>
        </div>}

        <input type="text" name='username' id='username' autoComplete='username' className='hidden' readOnly={true} value={user.username} />
        <div>
          <label htmlFor="currentPassword" className='block font-medium'>Current Password</label>
          <div className='input-parent ring-ring flex items-center border border-zinc-500 rounded-md'>
            <Input
              type={showCurrentPass ? "text" : "password"}
              id="currentPassword"
              placeholder="Enter your current password"
              name="current-password"
              className="border-0 !ring-0"
              value={currentPassword}
              required={true}
              onChange={(e) => setCurrentPassword(e.target.value)}
              onCopy={copyFunction}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {showCurrentPass ? <button type='button' className='px-4 py-1 cursor-pointer hover:bg-primary/10 bg-transparent z-30 group transition-colors flex items-center justify-center' onClick={() => setShowCurrentPass(false)}><Eye /></button> : <button type='button' className='px-4 py-1 cursor-pointer hover:bg-primary/10 bg-transparent z-30 group transition-colors flex items-center justify-center' onClick={() => setShowCurrentPass(true)}><EyeClosed /></button>}
          </div>
          <p className='text-xs mt-2 text-primary/80 md:w-3/4'>This field is required!</p>
        </div>

        <div>
          <label htmlFor="newPassword" className='block font-medium'>New Password</label>
          <div className={`input-parent flex items-center border rounded-md ${isPasswordChecked && errors.password ? 'border-red-500 ring-red-500' : 'border-zinc-500 ring-ring'}`}>
            <Input
              type={showNewPass ? "text" : "password"}
              id="newPassword"
              autoComplete="new-password"
              placeholder="Enter your new password"
              name="new-password"
              className="border-0 !ring-0"
              value={password}
              required={true}
              onChange={handlePasswordChange}
              onCopy={copyFunction}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {showNewPass ? <button type='button' className='px-4 py-1 cursor-pointer hover:bg-primary/10 bg-transparent z-30 group transition-colors flex items-center justify-center' onClick={() => setShowNewPass(false)}><Eye /></button> : <button type='button' className='px-4 py-1 cursor-pointer hover:bg-primary/10 bg-transparent z-30 group transition-colors flex items-center justify-center' onClick={() => setShowNewPass(true)}><EyeClosed /></button>}
          </div>
          {(isPasswordChecked && errors.password) ? <p role='alert' className="text-red-500 text-xs mt-2 md:w-3/4">{errors.password.message}</p> : (isPasswordChecked && (password.trim() === currentPassword.trim())) && <p className='text-red-500 text-xs mt-2 md:w-3/4'>Password must not be the same as the current password</p>}
        </div>

        <div>
          <label htmlFor="confirmNewPassword" className='block font-medium'>Confirm New Password</label>
          <Input
            type="password"
            id="confirmNewPassword"
            autoComplete="new-password"
            placeholder="Confirm your new password"
            name="confirm-newPassword"
            className={`${isConfirmPasswordChecked && errors.confirmPassword ? 'border-red-500 !ring-red-500' : 'border-zinc-500'}`}
            value={confirmPassword}
            required={true}
            onChange={handleConfirmPasswordChange}
            onCopy={copyFunction}
            aria-invalid={errors.confirmPassword ? "true" : "false"}
          />
          {(isConfirmPasswordChecked && errors.confirmPassword) ? <p role='alert' className="text-red-500 text-xs mt-2 md:w-3/4">{errors.confirmPassword.message}</p> : (isConfirmPasswordChecked && (password.trim() !== confirmPassword.trim())) && <p className='text-red-500 text-xs mt-2 md:w-3/4'>Passwords must match</p>}
        </div>

        <div>
          <Button type="button" onClick={() => setOpenPopup(true)} disabled={currentPassword.trim() === "" || (isConfirmPasswordChecked && errors.confirmPassword) || (isPasswordChecked && errors.password) || password.trim() === "" || confirmPassword.trim() === "" || (password.trim() !== confirmPassword.trim()) || currentPassword.trim() === password.trim()} className="w-full sm:w-auto mt-3">Change Password</Button>
        </div>
      </form>
    </div>
  )
}

export default SecurityTab
