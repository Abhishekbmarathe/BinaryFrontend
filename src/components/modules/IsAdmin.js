// src/hooks/useAdminStatus.js
import { useEffect, useState } from 'react';

const useAdminStatus = () => {
    const [ismAdmin, setMadmin] = useState(false); // Default to false

    useEffect(() => {
        const userDet = JSON.parse(localStorage.getItem("userDet"));
        if (userDet && userDet.role) {
            setMadmin(userDet.role === 'mAdmin'); // Set to true if the role is admin
        }
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    return ismAdmin; // Return the admin status
};

export default useAdminStatus;
