import React from 'react';

const Location = ({ pinFill = "#FF6F61", circleFill = "#FFFFFF" }) => {
  return (
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="20" viewBox="0 0 64 64" fill="none">
        {/* Outer Pin Shape */}
        <path
          d="M32 58C32 58 12 38 12 22C12 11.5066 20.5066 3 32 3C43.4934 3 52 11.5066 52 22C52 38 32 58 32 58Z"
          fill={pinFill}
        />
        {/* Inner Circle */}
        <circle
          cx="32"
          cy="22"
          r="8"
          fill={circleFill}
        />
      </svg>
    </div>
  );
};

export default Location;
