import React from 'react'

function Ticket({ size, color }) {
    return (
        <div>
            <svg width={size} height={size} viewBox="0 0 24 24">
                <path fill={color}
                    d="M18,0H14V1a2,2 0,0 1,-4 0V0H6A3,3 0,0 0,3 3V24h7V23a2,2 0,0 1,4 0v1h7V3A3,3 0,0 0,18 0ZM15.874,22a4,4 0,0 0,-7.748 0H5V17H8V15H5V3A1,1 0,0 1,6 2H8.126a4,4 0,0 0,7.748 0H18a1,1 0,0 1,1 1V15H16v2h3v5Z" />
                <path fill={color} d="M10,15h4v2h-4z" />
            </svg>
        </div>
    )
}

export default Ticket

