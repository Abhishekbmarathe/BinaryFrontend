import React from 'react';

function Calendar({
    color = "rgb(0, 197, 255)",
    width = 16,
    height = 22,
    strokeWidth = 2
}) {
    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke={color}
                strokeWidth={strokeWidth}
                width={width}
                height={height}
            >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth={strokeWidth} fill="none" />
                <line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth={strokeWidth} />
                <line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth={strokeWidth} />
                <line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth={strokeWidth} />
                {/* <rect x="7" y="14" width="3" height="3" fill={color} /> */}
            </svg>
        </div>
    );
}

export default Calendar;
