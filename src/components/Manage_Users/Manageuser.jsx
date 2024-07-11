import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Alluser from './Alluser';
import fetchAndStoreUsers from '../modules/fetchAllusers'


function Manageuser() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [userType, setUserType] = useState('technician');
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [showForm, setShowForm] = useState(false); // Form visibility state

    const onSubmit = async (data) => {
        setIsLoading(true); // Set loading state to true on form submission
        try {
            const response = await axios.post('https://binarysystemsbackend-mtt8.onrender.com/api/addUser', data);
            console.log(response);
            fetchAndStoreUsers();
            alert('User added successfully!');
            window.location.reload();
            setIsLoading(false); // Set loading state to false after successful submission
            setShowForm(false); // Hide the form after successful submission
        } catch (error) {
            console.error('Failed to add user:', error);
            alert('Failed to add user');
            setIsLoading(false); // Set loading state to false on error
        }


    };
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className='flex flex-col justify-center items-center sm:w-1/2 sm:m-auto'>
            <h1 className='my-6 font-bold text-3xl'>Manage <span className='text-cyan-400'> Users</span></h1>
            {!showForm ? (
                <button className='bg-neutral-500 py-2 px-3 rounded-xl my-9 fixed bottom-0 right-8 flex justify-between w-20 items-center ' onClick={() => setShowForm(true)}><span className=''>+</span> New</button>
            ) : null}
            {showForm && (
                <div className="mx-auto p-4 w-full text-white shadow-md rounded-lg">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-white">Name</label>
                            <input
                                type="text"
                                {...register('name', { required: true })}
                                className="bg-transparent outline-none mt-1 p-2 w-full border rounded-md"
                            />
                            {errors.name && <span className="text-red-500">Name is required</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-white">Phone Number</label>
                            <input
                                type="text"
                                {...register('phoneNum', { required: true })}
                                className="bg-transparent outline-none mt-1 p-2 w-full border rounded-md"
                            />
                            {errors.phoneNum && <span className="text-red-500">Phone Number is required</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-white">Email</label>
                            <input
                                type="text"
                                {...register('email', { required: true })}
                                className="mt-1 bg-transparent outline-none p-2 w-full border rounded-md"
                            />
                            {errors.email && <span className="text-red-500">Email is required</span>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-white">Username</label>
                            <input
                                type="text"
                                {...register('username', { required: true })}
                                className="mt-1 bg-transparent outline-none p-2 w-full border rounded-md"
                            />
                            {errors.username && <span className="text-red-500">Username is required</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-white">Password</label>
                            <div className="relative">
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    {...register('password', { required: true })}
                                    className="mt-1 bg-transparent outline-none p-2 w-full border rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300"
                                >
                                    {passwordVisible ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {errors.password && <span className="text-red-500">Password is required</span>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-cyan-400">User Type</label>
                            <div className="mt-2">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        value="technician"
                                        {...register('role')}
                                        checked={userType === 'technician'}
                                        onChange={() => setUserType('technician')}
                                        className="form-radio bg-transparent outline-none w-6 h-6"
                                    />
                                    <span className="ml-2">Technician</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input
                                        type="radio"
                                        value="admin"
                                        {...register('role')}
                                        checked={userType === 'admin'}
                                        onChange={() => setUserType('admin')}
                                        className="form-radio bg-transparent outline-none w-6 h-6"
                                    />
                                    <span className="ml-2">Admin</span>
                                </label>
                            </div>
                        </div>

                        {userType === 'admin' && (
                            <div className="mb-4">
                                <label className="block text-cyan-400">Rights</label>
                                <div className="mt-2">
                                    <label className="flex items-center ">
                                        <input
                                            type="checkbox"
                                            {...register('createTicket')}
                                            className="form-checkbox bg-transparent outline-none w-6 h-6 cursor-pointer"
                                        />
                                        <span className="ml-2">Ticket Creation</span>
                                    </label>
                                    <label className="flex items-center  mt-2">
                                        <input
                                            type="checkbox"
                                            {...register('assignTicket')}
                                            className="form-checkbox bg-transparent outline-none w-6 h-6 cursor-pointer"
                                        />
                                        <span className="ml-2">Ticket Management</span>
                                    </label>
                                    <label className="flex items-center  mt-2">
                                        <input
                                            type="checkbox"
                                            {...register('createClient')}
                                            className="form-checkbox bg-transparent outline-none w-6 h-6 cursor-pointer"
                                        />
                                        <span className="ml-2">Customer Database</span>
                                    </label>
                                    <label className="flex items-center  mt-2">
                                        <input
                                            type="checkbox"
                                            {...register('createAsset')}
                                            className="form-checkbox bg-transparent outline-none w-6 h-6 cursor-pointer"
                                        />
                                        <span className="ml-2">Asset Database</span>
                                    </label>
                                    <label className="flex items-center  mt-2">
                                        <input
                                            type="checkbox"
                                            {...register('manageFinance')}
                                            className="form-checkbox bg-transparent outline-none w-6 h-6 cursor-pointer"
                                        />
                                        <span className="ml-2">Finance Management</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            disabled={isLoading} // Disable button when loading
                        >
                            {isLoading ? (
                                <div className="flex justify-center items-center gap-3">
                                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-dotted rounded-full" role="status"></div>
                                    <span className="breathing">Loading...</span>
                                </div>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </form>
                </div>
            )}
            {!showForm && <Alluser />}
        </div>
    );
}

export default Manageuser;
