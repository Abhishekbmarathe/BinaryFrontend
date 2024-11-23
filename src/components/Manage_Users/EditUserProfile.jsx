import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import fetchAndStoreUsers from '../modules/fetchAllusers';
import api from '../modules/Api';
import Delete from '../../assets/Delete';

function UserDetail() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [userType, setUserType] = useState('technician'); // Default to 'technician'
    const [error, setError] = useState(''); // For validation error

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem("allUsers"));
        const selectedUser = userDetails.find(user => user._id === userId);
        setUser(selectedUser);
        setUserType(selectedUser.role); // Set the userType based on the fetched user's role
    }, [userId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser({
            ...user,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleRoleChange = (e) => {
        const { value } = e.target;
        setUser({
            ...user,
            role: value, // Update the user's role directly
        });
        setUserType(value);

        // If technician is selected, uncheck all checkboxes
        if (value === 'technician') {
            const updatedUser = { ...user, role: 'technician' }; // Ensure role is updated to 'technician'
            Object.keys(updatedUser).forEach((key) => {
                if (typeof updatedUser[key] === 'boolean') {
                    updatedUser[key] = false; // Uncheck all permissions
                }
            });
            setUser(updatedUser);
        }
    };

    const handleSave = async () => {
        // If admin is selected, validate at least one checkbox is true
        if (userType === 'admin') {
            const hasPermission = Object.keys(user).some(
                (key) => typeof user[key] === 'boolean' && user[key] === true
            );
            if (!hasPermission) {
                setError('Please select at least one permission for admin.');
                return;
            }
        }

        setIsLoading(true);
        try {
            const conf = confirm("Are you sure to save the changes ?");
            if (conf) {
                const response = await axios.post(api + 'api/updateUser',
                    user,
                    {
                        headers: {
                            'Content-Type': 'application/json', // Specify the content type
                            'UpdatedBy': 'Master' // Add the `creater` value in the headers
                        }
                    }
                );
                console.log('Saved user details:', response.data);
                fetchAndStoreUsers();
                alert("Saved successfully...");
                navigate('/manage-user');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error saving user details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const conf = confirm("Are you sure to delete this user?");
            if (conf) {
                await axios.post(api + 'api/deleteUser', { username: user.username },
                    {
                        headers: {
                            'Content-Type': 'application/json', // Specify the content type
                            'UpdatedBy': 'Master' // Add the `creater` value in the headers
                        }
                    }
                );
                console.log('User deleted:', user.username);
                fetchAndStoreUsers();
                alert("User deleted successfully...");
                navigate('/manage-user');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 sm:max-w-[50vw] font-sans md:bg-white md:shadow-lg">
            <div className='flex justify-between p-3'>
                <h1 className='w-fit text-2xl'>Edit <span className='text-customColor'>Profile</span></h1>
                <button
                    className="border border-black text-red-400 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline block"
                    type="button"
                    onClick={handleDelete}
                >
                    <Delete />
                </button>
            </div>
            <div className="rounded-lg overflow-hidden mb-4">
                <div className="p-4">
                    {isLoading &&
                        <div className="flex justify-center items-center gap-3">
                            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-dotted rounded-full" role="status">
                            </div>
                            <span className="breathing">Loading...</span>
                        </div>
                    }
                    {!isLoading && (
                        <form onSubmit={(e) => e.preventDefault()}>
                            {Object.keys(user).map((key, idx) => (
                                !['createdAt', 'updatedAt', '__v', '_id', 'role'].includes(key) && (
                                    <div key={idx} className="mb-4">
                                        {typeof user[key] === 'boolean' ? (
                                            <>
                                                {/* Checkboxes will now be rendered conditionally below the radio buttons */}
                                            </>
                                        ) : (
                                            <>
                                                <label
                                                    className="block text-black text-sm font-bold mb-2"
                                                    htmlFor={`${key}-${idx}`}
                                                >
                                                    {/* Check if the key is 'PhoneNum', display 'Phone number', otherwise capitalize the key */}
                                                    {key === 'phoneNum'
                                                        ? 'Phone number'
                                                        : key.charAt(0).toUpperCase() + key.slice(1)}
                                                </label>
                                                <input
                                                    className="appearance-none border-2 border-gray-400 rounded w-full p-3 px-3 bg-transparent text-black leading-tight focus:outline-none focus:shadow-outline sm:py-4 sm:rounded-xl"
                                                    type="text"
                                                    id={`${key}-${idx}`}
                                                    name={key}
                                                    value={user[key]}
                                                    onChange={handleChange}
                                                />
                                            </>
                                        )}
                                    </div>
                                )
                            ))}


                            {/* Radio buttons for user role */}
                            <div className="mb-4">
                                <label className="block text-black">User Type</label>
                                <div className="mt-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            value="technician"
                                            name="role"
                                            checked={userType === 'technician'}
                                            onChange={handleRoleChange}
                                            className="form-radio bg-gray outline-none w-6 h-6"
                                        />
                                        <span className="ml-2">Technician</span>
                                    </label>
                                    <label className="inline-flex items-center ml-6">
                                        <input
                                            type="radio"
                                            value="admin"
                                            name="role"
                                            checked={userType === 'admin'}
                                            onChange={handleRoleChange}
                                            className="form-radio bg-gray outline-none w-6 h-6"
                                        />
                                        <span className="ml-2">Admin</span>
                                    </label>
                                </div>
                            </div>

                            {/* Conditional rendering for checkboxes based on role */}
                            {userType === 'admin' && (
                                <div className="mb-4">
                                    <label className="block text-black text-sm font-bold mb-2">Admin Permissions</label>
                                    {Object.keys(user).map((key, idx) => (
                                        typeof user[key] === 'boolean' && (
                                            <div key={idx} className="flex items-center mb-2">
                                                <input
                                                    className="mr-2 leading-tight w-6 h-6 cursor-pointer"
                                                    type="checkbox"
                                                    id={`${key}-${idx}`}
                                                    name={key}
                                                    checked={user[key]}
                                                    onChange={handleChange}
                                                />
                                                <span className="text-black">
                                                    {key === 'createAsset' && 'Asset Creation'}
                                                    {key === 'createClient' && 'Customer Database'}
                                                    {key === 'createTicket' && 'Ticket Creation'}
                                                    {!['createAsset', 'createClient', 'createTicket'].includes(key) &&
                                                        (key.charAt(0).toUpperCase() + key.slice(1))}
                                                </span>
                                            </div>
                                        )
                                    ))}

                                </div>
                            )}

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <button
                                className="bg-blue-500 w-full hover:bg-slate-200 text-white sm:font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={handleSave}
                            >
                                Save
                            </button><br /><br />
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserDetail;
