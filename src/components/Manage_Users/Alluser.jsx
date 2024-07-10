import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
    const [allUsers, setAllUsers] = useState([]);
    const [editableUser, setEditableUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem("allUsers"));
        if (userDetails) {
            setAllUsers(userDetails);
            setEditableUser(userDetails[0] || {});
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditableUser({
            ...editableUser,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSave = () => {
        console.log('Saved user details:', editableUser);
        localStorage.setItem("userDet", JSON.stringify(editableUser));
    };

    const handleExpand = (userId) => {
        navigate(`/user/${userId}`);
    };

    return (
        <div className="max-w-md mx-auto mt-10 sm:max-w-[50vw]">
            {allUsers.map((user, index) => (
                <div key={index} className="shadow-md rounded-lg overflow-hidden mb-4">
                    <div
                        className="border-cyan-500 border-2 w-[90vw] sm:max-w-full rounded-xl p-4 cursor-pointer flex gap-4 items-center"
                        onClick={() => handleExpand(user._id)}
                    >
                        <span>{user.role}</span>
                        <span className="text-white text-lg font-bold">{user.username}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default UserProfile;

