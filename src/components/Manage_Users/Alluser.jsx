import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Technician from '../../assets/Techicon';
import Home from '../../assets/Home';
import User from '../../assets/User';
import fetchAllusers from '../modules/fetchAllusers';

function UserProfile() {
    const [allUsers, setAllUsers] = useState([]);
    const [editableUser, setEditableUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllusers()
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

    const home = () => {
        navigate('/Server/Home')
        navigator.vibrate(60);
    };

    return (
        <div className="w-[95%]">
            {allUsers.map((user, index) => (
                <div key={index}
                    className="border-b border-b-gray-500 flex items-center w-[96vw]/ px-2"
                    onClick={() => handleExpand(user._id)}>
                    {user.role === "technician" ? (<Technician width='44' height='32' />) : (<User size={40} color='#00C5FF' />)}
                    <div
                        className="  sm:max-w-full w-full px-4 py-2 cursor-pointer flex flex-col  font-semibold font-sans"
                    >
                        <span className="text">{user.name}</span>
                        <span className="text-black text-xs">@{user.username}</span>
                    </div>
                </div>
            ))}

            <div className='fixed md:hidden /bg-bottom-gradient bottom-0 py-2 overflow-y-auto w-full -z-10'>
                <nav className='w-screen flex items-center justify-center px-16 py-2  '>
                    <button onClick={home}>
                        <Home />
                    </button>
                </nav>
            </div>
        </div>
    );
}

export default UserProfile;

