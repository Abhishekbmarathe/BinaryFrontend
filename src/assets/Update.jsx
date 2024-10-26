import React from 'react'

const Update = () => {
    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="rgb(0, 128, 0)"
                strokeWidth="2"
                width="20"
                height="24"
            >
                {/* Tail of the arrow */}
                <line x1="12" y1="20" x2="12" y2="8" stroke="rgb(0, 128, 0)" strokeWidth="2" />

                {/* Arrowhead */}
                <polyline points="6,12 12,6 18,12" fill="none" stroke="rgb(0, 128, 0)" strokeWidth="2" />
            </svg>
        </div>
    )
}

export default Update
