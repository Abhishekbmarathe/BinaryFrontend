import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'; // Assuming you're using Axios for API requests
import api from '../modules/Api';
import { useNavigate } from 'react-router-dom';

const Editprofile = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [userDetails, setUserDetails] = useState({
        email: '',
        name: '',
        phoneNum: '',
        role: '',
        username: '',
        password: '',
    });

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const navigate = useNavigate();
    
    

    // Fetch user details from localStorage when the component mounts
    useEffect(() => {
        const storedUser = localStorage.getItem('userDet');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUserDetails(userData);
        }
    }, []);

    const onSubmit = (data) => {
        const { oldPassword, newPassword, password } = data;

        // Compare old password from localStorage with entered old password
        if (oldPassword !== userDetails.password) {
            alert('Old password is incorrect');
            return;
        }

        // Check if new password and confirm password match
        if (newPassword !== password) {
            alert('New password and confirm password do not match');
            return;
        }

        const updateFields = {
            email: data.email,
            name: data.name,
            phoneNum: data.phoneNum,
            username: userDetails.username,
            password,
        };

        console.log("user name == ", updateFields.username);

        // Send API request to update the user details
        axios.post(api + 'api/updateUser', {
            username: updateFields.username, // Send username separately
            ...updateFields // Spread updateFields so all fields are at the top level
        })
            .then((response) => {
                alert('Profile updated successfully');
                navigate(-1)
            })
            .catch((error) => {
                console.error('There was an error updating the profile:', error);
            });
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-4">Edit Profile</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                {userDetails.role === 'mAdmin' && (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                defaultValue={userDetails.email}
                                {...register('email', { required: true })}
                                className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
                            />
                            {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">Name</label>
                            <input
                                type="text"
                                defaultValue={userDetails.name}
                                {...register('name', { required: true })}
                                className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
                            />
                            {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">Phone Number</label>
                            <input
                                type="text"
                                defaultValue={userDetails.phoneNum}
                                {...register('phoneNum', { required: true })}
                                className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
                            />
                            {errors.phoneNum && <p className="text-red-500 text-sm">Phone number is required</p>}
                        </div>
                    </>
                )}

                <input
                    type="hidden"
                    defaultValue={userDetails.username}
                    {...register('username')}
                />

                {/* Old Password Field */}
                <div className="mb-4 relative">
                    <label className="block text-sm font-medium">Old Password</label>
                    <input
                        type={showOldPassword ? "text" : "password"}
                        {...register('oldPassword', { required: true })}
                        className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                        {showOldPassword ? "Hide" : "Show"}
                    </button>
                    {errors.oldPassword && <p className="text-red-500 text-sm">Old password is required</p>}
                </div>

                {/* New Password Field */}
                <div className="mb-4 relative">
                    <label className="block text-sm font-medium">New Password</label>
                    <input
                        type={showNewPassword ? "text" : "password"}
                        {...register('newPassword', { required: true })}
                        className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                        {showNewPassword ? "Hide" : "Show"}
                    </button>
                    {errors.newPassword && <p className="text-red-500 text-sm">New password is required</p>}
                </div>

                {/* Confirm Password Field */}
                <div className="mb-4 relative">
                    <label className="block text-sm font-medium">Confirm Password</label>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register('password', { required: true })}
                        className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                    {errors.password && <p className="text-red-500 text-sm">Confirm password is required</p>}
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
                >
                    Save
                </button>
            </form>
        </div>
    );
};

export default Editprofile;
