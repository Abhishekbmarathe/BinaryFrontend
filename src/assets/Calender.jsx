import React from 'react'

function Calender() {
    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="rgb(0, 197, 255)"
                strokeWidth="2"
                width="16"
                height="22"
            >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="rgb(0, 197, 255)" strokeWidth="2" fill="none" />
                <line x1="3" y1="10" x2="21" y2="10" stroke="rgb(0, 197, 255)" strokeWidth="2" />
                <line x1="16" y1="2" x2="16" y2="6" stroke="rgb(0, 197, 255)" strokeWidth="2" />
                <line x1="8" y1="2" x2="8" y2="6" stroke="rgb(0, 197, 255)" strokeWidth="2" />
                {/* <rect x="7" y="14" width="3" height="3" fill="rgb(0, 197, 255)" /> */}
            </svg>
        </div>
    )
}

export default Calender
