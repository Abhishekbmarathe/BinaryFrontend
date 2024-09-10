import React from 'react';

function ShowPasswordIcon({ size = 24, color = 'currentColor' }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke={color} className={`w-${size} h-${size}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.654 1.883-1.79 3.515-3.229 4.735M19.744 15.732A9.99 9.99 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.953 9.953 0 012.373-3.992" />
        </svg>
    );
}

export default ShowPasswordIcon;
