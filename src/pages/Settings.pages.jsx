import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import setAvatar from '../utils/setAvatar.js'
import errorMessage from '../utils/errorMessage.js'
import axios from '../utils/axiosInstance.js'
import { Settings as SettingsIcon, User2, CircleUserRound, LockKeyhole } from 'lucide-react'
import { AccountTab, ProfileTab, SecurityTab } from '../components/index.js'
import { login, logout } from '../store/authSlice.js'
import { useIsMobile } from '../hooks/use-mobile.jsx'

const Settings = () => {
  const { tab } = useParams()
  const user = useSelector(state => state.auth.userData)
  const [recheckUser, setRecheckUser] = useState(false)
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  useEffect(() => {
    axios.get('/users/current-user')
      .then((res) => {
        if (res.data.data) {
          dispatch(login({ userData: res.data.data }))
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        dispatch(logout());
        console.error(errorMessage(error))
      });

  }, [recheckUser]);

  return (
    <section className="w-full p-4 pt-0 md:max-h-[87vh] md:overflow-y-hidden">
      {(!isMobile || (isMobile && !tab)) &&
        <div className="w-full mt-4 px-4">
          <h1 className="font-medium text-2xl flex items-center gap-2"><span><SettingsIcon className='size-4' /></span>Settings</h1>
          <p className='text-sm text-primary/80'>Manage your account settings.</p>
        </div>
      }
      <hr className={`my-4 border-primary ${(!isMobile || (isMobile && !tab)) ? "block" : "hidden"}`} />
      <div className="flex flex-col md:flex-row md:space-x-4">
        {(!isMobile || (isMobile && !tab)) &&
          <>
            <div className="w-full md:w-1/4">
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2 items-center">
                  <img className='w-10 h-10 object-cover rounded-full' src={setAvatar(user.avatar)} alt="" />

                  <div>
                    <h1 className="font-medium break-all line-clamp-1">{user.fullName}</h1>
                    <p className="text-primary text-sm break-all line-clamp-1">{user.email}</p>
                  </div>
                </div>
                {(!isMobile || (isMobile && !tab)) && <div className="space-y-1">
                  <NavLink to="/settings/profile" className={`flex items-center gap-2 text-base sm:text-sm font-medium px-3 py-2 rounded ${(tab === 'profile' || (!tab && !isMobile)) ? '' : 'hover:bg-accent hover:underline'} ${(!tab && !isMobile) && "active"}`}><span><CircleUserRound className='size-4' /></span>Profile</NavLink>

                  <NavLink to="/settings/account" className={`flex items-center gap-2 text-base sm:text-sm font-medium px-3 py-2 rounded ${tab === 'account' ? '' : 'hover:bg-accent hover:underline'}`}><span><User2 className='size-4' /></span>Account</NavLink>

                  <NavLink to="/settings/security" className={`flex items-center gap-2 text-base sm:text-sm font-medium px-3 py-2 rounded ${tab === 'security' ? '' : 'hover:bg-accent hover:underline'}`}><span><LockKeyhole className='size-4' /></span>Security</NavLink>

                  {/* <NavLink to="/settings/notifications" className={`flex items-center gap-2 text-base sm:text-sm font-medium px-3 py-2 rounded ${tab === 'notifications' ? '' : 'hover:bg-accent hover:underline'}`}><span><Bell className='size-4' /></span>Notifications</NavLink> */}

                </div>}
              </div>
            </div>
            <div className='h-screen w-[1px] bg-primary hidden md:block'></div>
          </>}
        <div className="w-full md:w-3/4 mb-10 md:max-h-[70vh] md:overflow-y-auto">
          {(tab === 'profile' || (!tab && !isMobile)) && <ProfileTab user={user} setRecheckUser={setRecheckUser} />}
          {tab === 'account' && <AccountTab user={user} setRecheckUser={setRecheckUser} />}
          {tab === 'security' && <SecurityTab user={user} setRecheckUser={setRecheckUser} />}
        </div>
      </div>
    </section>
  )
}

export default Settings
