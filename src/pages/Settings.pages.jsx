import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import setAvatar from '../utils/setAvatar.js'
import { Settings as SettingsIcon } from 'lucide-react'
import { Button, ProfileTab } from '@/components/index.js'

const Settings = () => {
    const { tab } = useParams()
    const user = useSelector(state => state.auth.userData)

    return (
        <section className="w-full p-4 pt-0 md:max-h-[87vh] md:overflow-y-hidden">
            <div className="w-full mt-4 px-4">
                <h1 className="font-medium text-2xl flex items-center gap-2"><span><SettingsIcon className='size-4' /></span>Settings</h1>
                <p className='text-sm text-primary/80'>Manage your account settings.</p>
            </div>
            <hr className="my-4 border-primary" />
            <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="w-full md:w-1/4">
                    <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2 items-center">
                            <img className='w-10 h-10 object-cover rounded-full' src={setAvatar(user.avatar)} alt="" />

                            <div>
                                <h1 className="font-medium break-all line-clamp-1">{user.fullName}</h1>
                                <p className="text-primary text-sm break-all line-clamp-1">{user.email}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <NavLink to="/settings/profile" className={`block text-sm font-medium px-3 py-2 rounded ${tab === 'profile' ? '' : 'hover:bg-accent hover:underline'}`}>Profile</NavLink>
                            <NavLink to="/settings/account" className={`block text-sm font-medium px-3 py-2 rounded ${tab === 'account' ? '' : 'hover:bg-accent hover:underline'}`}>Account</NavLink>
                            <NavLink to="/settings/security" className={`block text-sm font-medium px-3 py-2 rounded ${tab === 'security' ? '' : 'hover:bg-accent hover:underline'}`}>Security</NavLink>
                            <NavLink to="/settings/notifications" className={`block text-sm font-medium px-3 py-2 rounded ${tab === 'notifications' ? '' : 'hover:bg-accent hover:underline'}`}>Notifications</NavLink>

                        </div>
                    </div>
                </div>
                <div className='h-screen w-[1px] bg-primary hidden md:block'></div>

                <div className="w-full md:w-3/4 mb-10 md:max-h-[70vh] md:overflow-y-auto">
                    {tab === 'profile' && <ProfileTab user={user}/>}
                    {/* {tab === 'account' && <AccountTab />} */}
                    
                </div>
            </div>
        </section>
    )
}

export default Settings
