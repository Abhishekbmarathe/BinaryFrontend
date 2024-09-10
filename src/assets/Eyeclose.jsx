import React from 'react';

function HidePasswordIcon({ size = 24, color = 'currentColor' }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke={color} className={`w-${size} h-${size}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A9.971 9.971 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.974 9.974 0 013.642-4.752M9.53 9.53a3 3 0 104.243 4.243M6.77 6.77l10.49 10.49M17.228 17.228l2.317 2.317M20.71 12.29c-.29-.925-.709-1.794-1.229-2.576a9.976 9.976 0 00-2.344-2.79" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 9.53L3 3m6.53 6.53L3 3" />
        </svg>
    );
}

export default HidePasswordIcon;
