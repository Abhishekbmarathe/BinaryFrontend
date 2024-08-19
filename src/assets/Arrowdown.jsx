import React from 'react'

function Arrowdown() {
    return (
        <div>
            <svg width="25" height="24" viewBox="0 0 25 24">
                <clipPath id="clip-path">
                    <path d="M0.5,0h24v24h-24z" />
                </clipPath>
                <g clip-path="url(#clip-path)">
                    <path d="M16.5,10.75L12.5,14.75L8.5,10.75" stroke-linejoin="round" stroke-width="1.5" fill="#00000000" stroke="black" stroke-linecap="round" />
                    <path d="M12.5,21.25C17.609,21.25 21.75,17.109 21.75,12C21.75,6.891 17.609,2.75 12.5,2.75C7.391,2.75 3.25,6.891 3.25,12C3.25,17.109 7.391,21.25 12.5,21.25Z" stroke-width="1.5" fill="#00000000" stroke="black" stroke-linecap="round" />
                </g>
            </svg>
        </div>
    )
}

export default Arrowdown
