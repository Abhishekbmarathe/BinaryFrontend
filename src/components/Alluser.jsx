import React, { useState, useEffect } from 'react';

function UserProfile() {
    const [mUser, setUser] = useState({});

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem("userDet"));
        const userDetail = userDetails.allUsers || userDetails.user || userDetails;
        if (userDetail) {
            setUser(userDetail);
        }
    }, []);

    const renderValue = (value) => {
        if (typeof value === 'object' && value !== null) {
            return (
                <ul>
                    {Object.keys(value).map((subKey, subIndex) => (
                        <li key={subIndex}>
                            <strong>{subKey}</strong>: {JSON.stringify(value[subKey])}
                        </li>
                    ))}
                </ul>
            );
        }
        return value;
    };

    return (
        <div>
            <h1>User Profile</h1>
            <div>
                {Object.keys(mUser).length > 0 ? (
                    <ul>
                        {Object.keys(mUser).map((key, index) => (
                            <li key={index}>
                                <strong>{key}</strong>: {renderValue(mUser[key])}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No user data available.</p>
                )}
            </div>
        </div>
    );
}

export default UserProfile;
