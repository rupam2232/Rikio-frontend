import React from 'react'
import conf from '../conf/conf.js'

const PrivacyPolicy = () => {
  return (
    <section className='w-full max-w-3xl mx-auto px-4 py-8'>
      <h1 className="text-3xl font-bold mb-4 text-center">Privacy Policy</h1>
      <p className="mb-4">
        At {conf.appName}, your privacy is critically important to us. This Privacy Policy outlines the types of information we collect, how we use it, and the choices you have regarding your data.
      </p>
      <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
      <p className="mb-4">We may collect personal information such as your name, email address, and usage data when you interact with our platform.</p>
      <h2 className="text-xl font-semibold mb-2">How We Use Information</h2>
      <p className="mb-4">Your data helps us improve our services, provide personalized experiences, and communicate important updates.</p>
      <h2 className="text-xl font-semibold mb-2">Third-Party Services</h2>
      <p className="mb-4">We may use third-party services for analytics, storage, or payment processing. These services adhere to their own privacy policies.</p>
      <h2 className="text-xl font-semibold mb-2">Your Choices</h2>
      <p className="mb-4">You can request access to, modification, or deletion of your personal data at any time by contacting us.</p>
      <p className="mt-6 text-sm text-zinc-500">Last updated: March 2025</p>
    </section>
  )
}

export default PrivacyPolicy
