import React from 'react'

const Logo = ({ className }) => {
    return (
        <svg
            className={`${className} relative left-1 fill-none`}
            viewBox="0 0 63 64"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M10.5366 47.7971V17.5057C10.5366 16.9599 11.1511 16.6391 11.599 16.9495L33.4166 32.0952C33.8041 32.3639 33.8041 32.9368 33.4166 33.2076L11.599 48.3533C11.1511 48.6657 10.5366 48.3429 10.5366 47.7971Z"
                stroke="url(#paint0_linear_53_10115)"
                strokeWidth="6.99574"
                strokeMiterlimit="10"
                strokeLinecap="round"></path>
            <defs>
                <linearGradient
                    id="paint0_linear_53_10115"
                    x1="2.23416"
                    y1="20.3361"
                    x2="26.863"
                    y2="44.9649"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#007EF8"></stop>
                    <stop
                        offset="1"
                        stopColor="#FF4A9A"></stop>
                </linearGradient>
            </defs>
        </svg>
    )
}

export default Logo
