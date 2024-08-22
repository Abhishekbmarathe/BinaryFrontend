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

    const home = () => {
        navigate('/Server/Home')
        navigator.vibrate(60);
    };

    return (
        <div className="max-w-md mx-auto mt-10 sm:max-w-[50vw] ">
            {allUsers.map((user, index) => (
                <div key={index} className="shadow-gray-500 shadow-md rounded-lg overflow-hidden mb-4">
                    <div
                        className=" w-[90vw] sm:max-w-full rounded-[8px] p-4 cursor-pointer flex gap-4 items-center font-semibold font-sans"
                        onClick={() => handleExpand(user._id)}
                    >
                        <span className=''>{user.role}</span>
                        <span className="text-black text-lg ">{user.username}</span>
                    </div>
                </div>
            ))}

            <div className='fixed md:hidden /bg-bottom-gradient bottom-0 py-2 overflow-y-auto w-full -z-10'>
                <nav className='w-screen flex items-center justify-center px-16 py-2  '>
                    <button onClick={home}>
                        <lord-icon
                            src="https://cdn.lordicon.com/cnpvyndp.json"
                            trigger="click"
                            colors="primary:black"
                        >
                        </lord-icon>
                        {/* <br /><span>Home</span> */}
                    </button>
                </nav>
            </div>
        </div>
    );
}

export default UserProfile;

