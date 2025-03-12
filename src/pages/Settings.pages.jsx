import React from 'react'
import { NavLink, useParams } from 'react-router-dom'

const Settings = () => {
    const { tab } = useParams()
    return (
        <section className="w-full p-4 pt-0 mb-10">
            <div className="w-full mt-4 px-4">
                <h1 className="font-medium text-2xl">Settings</h1>
            </div>
            <hr className="my-4 border-primary" />
            <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="w-full md:w-1/4">
                    <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2 items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                            <div>
                                <h1 className="font-medium">Name</h1>
                                <p className="text-gray-500">
                                    <span className="text-primary">Email</span>
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <NavLink to="/settings/profile" className={`block p-2 rounded ${tab === 'profile' ? '' : 'hover:bg-gray-200'}`}>Profile</NavLink>
                            <NavLink to="/settings/account" className={`block p-2 rounded ${tab === 'account' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}>Account</NavLink>
                            <NavLink to="/settings/security" className={`block p-2 rounded ${tab === 'security' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}>Security</NavLink>
                            <NavLink to="/settings/notifications" className={`block p-2 rounded ${tab === 'notifications' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}>Notifications</NavLink>

                        </div>
                    </div>
                </div>

                <div className="w-full md:w-3/4">
                    <div className="bg-gray-100 p-4 rounded">
                        <h1 className="font-medium text-xl">Edit Profile</h1>
                        <hr className="my-2 border-primary" />
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block">Name</label>
                                <input type="text" id="name" className="w-full border p-2 rounded" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block">Email</label>
                                <input type="email" id="email" className="w-full border p-2 rounded" />
                            </div>
                            <div>
                                <label htmlFor="bio" className="block">Bio</label>
                                <textarea id="bio" className="w-full border p-2 rounded"></textarea>
                            </div>
                            <button className="w-full bg-primary text-white py-2 rounded">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Settings
