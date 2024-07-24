import React from 'react'

function User({ size, color }) {
    return (
        <div>
            <svg width={size} height={size} viewBox="0 0 24 24">
                <path fill={color} d="M12,12c2.21,0 4,-1.79 4,-4s-1.79,-4 -4,-4 -4,1.79 -4,4 1.79,4 4,4zM12,14c-2.67,0 -8,1.34 -8,4v2h16v-2c0,-2.66 -5.33,-4 -8,-4z" />
            </svg>
        </div>
    )
}

export default User
