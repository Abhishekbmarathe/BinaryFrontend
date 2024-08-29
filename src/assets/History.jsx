import React from 'react';

function History({ size = 24 }) { // default size is 24 if no size is provided
    return (
        <div>
            <svg
                width={size}
                height="24"
                viewBox="0 0 24 24"
                fill="#69CBFF"
            >
                <path
                    d="M13,3C8.03,3 4,7.03 4,12L1,12l3.89,3.89 0.07,0.14L9,12L6,12C6,8.13 9.13,5 12,5s7,3.13 7,7 -3.13,7 -7,7C10.07,21 12.51,21 13,21c4.97,0 9,-4.03 9,-9s-4.03,-9 -9,-9zM12,8v5l4.28,2.54 0.72,-1.21 -3.5,-2.08L13.5,8L12,8z"
                    fill="customColor"
                />
            </svg>
        </div>
    );
}

export default History;
