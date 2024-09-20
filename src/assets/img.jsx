import React from 'react'

function img() {
  return (
    <div>
      {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="none" strokeWidth="0">
        <path d="M22 16L22 4C22 2.9 21.1 2 20 2L8 2C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16Z" fill="#FFFFFF" />
        <path d="M11 12L13.03 14.71L16 11L20 16L13 20L11 16L11 12Z" fill="#FFFFFF" />
        <path d="M2 6V20C2 21.1 2.9 22 4 22H18V20L4 18L4 6L2 6Z" fill="#FFFFFF" />
      </svg> */}
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <path d="M21 15l-5-5L5 21"></path>
      </svg>
    </div>
  )
}

export default img
