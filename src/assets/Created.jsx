import React from 'react';
import Pen from '../assets/Edit';

function CreateIcon() {
    return (
        <div className='relative'>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="rgb(0, 123, 255)" // Blue color
                width="20"
                height="16"
            >
                {/* Document shape */}
                <path
                    d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"
                    fill="none"
                    stroke="rgb(0, 123, 255)"
                    strokeWidth="2"
                />

            </svg>
            <div className='absolute -top-[2px] -right-[2px]'>
                <Pen color='rgb(0, 123, 255' size='16'/>
            </div>
        </div>
    );
}

export default CreateIcon;
