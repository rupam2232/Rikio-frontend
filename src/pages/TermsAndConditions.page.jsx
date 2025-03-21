import React from 'react'
import conf from '../conf/conf.js'

const TermsAndConditions = () => {
    return (
        <section className='w-full max-w-3xl mx-auto px-4 py-8'>
            <h1 className="text-3xl font-bold mb-4 text-center">Terms & Conditions</h1>
            <p className="mb-4">
                Welcome to {conf.appName}! By accessing or using our platform, you agree to comply with and be bound by these Terms & Conditions.
            </p>
            <h2 className="text-xl font-semibold mb-2">Use of Service</h2>
            <p className="mb-4">You agree to use our services responsibly and not engage in any prohibited activities, including illegal or harmful conduct.</p>
            <h2 className="text-xl font-semibold mb-2">User Accounts</h2>
            <p className="mb-4">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            <h2 className="text-xl font-semibold mb-2">Intellectual Property</h2>
            <p className="mb-4">All content and materials on {conf.appName} are the property of {conf.appName} or its licensors and are protected by copyright laws.</p>
            <h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
            <p className="mb-4">We are not liable for any damages arising from the use of our platform.</p>
            <p className="mt-6 text-sm text-zinc-500">Last updated: March 2025</p>
        </section>
    )
}

export default TermsAndConditions
