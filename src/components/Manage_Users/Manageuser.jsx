import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Alluser from './Alluser';
import fetchAndStoreUsers from '../modules/fetchAllusers'
import Nav from '../TopNav'
import api from '../modules/Api'
import Eyeclose from '../../assets/Eyeclose'
import Eyeopen from '../../assets/Eyeopen'

function Manageuser() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [userType, setUserType] = useState('technician');
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [showForm, setShowForm] = useState(false); // Form visibility state

    const onSubmit = async (data) => {
        setIsLoading(true); // Set loading state to true on form submission
        try {
            const response = await axios.post(
                api + 'api/addUser',
                data, // Keep data in the request body
                {
                    headers: {
                        'Content-Type': 'application/json', // Specify the content type
                        'UpdatedBy': 'Master' // Add the `creater` value in the headers
                    }
                }
            );
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
        <><Nav />
            <div className='flex flex-col justify-center items-center sm:w-1/2 sm:m-auto  md:mt-6'>
                <h1 className='my-6 font-semibold font-sans  text-2xl'>User <span className='text-customColor'> List</span></h1>
                {!showForm ? (
                    <button className='bg-white shadow-customShadow  py-2  px-5 rounded-xl my-9 fixed bottom-9 md:bottom-16 right-8 md:right-24' onClick={() => setShowForm(true)}><span className='text-customColor  text-3xl'>+</span></button>
                ) : null}
                {showForm && (
                    <div className="mx-auto p-4 w-full text-black rounded-lg md:bg-white md:shadow-lg">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <label className="block text-black">Name</label>
                                <input
                                    type="text"
                                    {...register('name', { required: true })}
                                    className="bg-g border-gray-400 outline-none mt-1 p-2 w-full border-2 rounded-md"
                                />
                                {errors.name && <span className="text-red-500">Name is required</span>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-black">Phone Number</label>
                                <input
                                    type="text"
                                    {...register('phoneNum', { required: true })}
                                    className="bg-g border-gray-400 outline-none mt-1 p-2 w-full border-2 rounded-md"
                                />
                                {errors.phoneNum && <span className="text-red-500">Phone Number is required</span>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-black">Email</label>
                                <input
                                    type="text"
                                    {...register('email', { required: true })}
                                    className="mt-1 border-gray-400  outline-none p-2 w-full border-2 rounded-md"
                                />
                                {errors.email && <span className="text-red-500">Email is required</span>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-black">Username</label>
                                <input
                                    type="text"
                                    {...register('username', { required: true })}
                                    className="mt-1 border-gray-400  outline-none p-2 w-full border-2 rounded-md"
                                />
                                {errors.username && <span className="text-red-500">Username is required</span>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-black">Password</label>
                                <div className="relative">
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        {...register('password', { required: true })}
                                        className="mt-1 border-gray-400  outline-none p-2 w-full border-2 rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 scale-[.3]"
                                    >
                                        {!passwordVisible ? <Eyeclose /> : <Eyeopen />}
                                    </button>
                                </div>
                                {errors.password && <span className="text-red-500">Password is required</span>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-customColor">User Type</label>
                                <div className="mt-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            value="technician"
                                            {...register('role')}
                                            checked={userType === 'technician'}
                                            onChange={() => setUserType('technician')}
                                            className="form-radio bg-gray outline-none w-6 h-6"
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
                                            className="form-radio bg-gray outline-none w-6 h-6"
                                        />
                                        <span className="ml-2">Admin</span>
                                    </label>
                                </div>
                            </div>

                            {userType === 'admin' && (
                                <div className="mb-4">
                                    <label className="block text-customColor">Rights</label>
                                    <div className="mt-2">
                                        <label className="flex items-center ">
                                            <input
                                                type="checkbox"
                                                {...register('createTicket')}
                                                className="form-checkbox bg-gray outline-none w-6 h-6 cursor-pointer"
                                            />
                                            <span className="ml-2">Ticket Creation</span>
                                        </label>
                                        {/* <label className="flex items-center  mt-2">
                                            <input
                                                type="checkbox"
                                                {...register('assignTicket')}
                                                className="form-checkbox bg-gray outline-none w-6 h-6 cursor-pointer"
                                            />
                                            <span className="ml-2">Ticket Management</span>
                                        </label> */}
                                        <label className="flex items-center  mt-2">
                                            <input
                                                type="checkbox"
                                                {...register('createClient')}
                                                className="form-checkbox bg-gray outline-none w-6 h-6 cursor-pointer"
                                            />
                                            <span className="ml-2">Customer Database</span>
                                        </label>
                                        <label className="flex items-center  mt-2">
                                            <input
                                                type="checkbox"
                                                {...register('createAsset')}
                                                className="form-checkbox bg-gray outline-none w-6 h-6 cursor-pointer"
                                            />
                                            <span className="ml-2">Asset Database</span>
                                        </label>
                                        {/* <label className="flex items-center  mt-2">
                                            <input
                                                type="checkbox"
                                                {...register('manageFinance')}
                                                className="form-checkbox bg-gray outline-none w-6 h-6 cursor-pointer"
                                            />
                                            <span className="ml-2">Finance Management</span>
                                        </label> */}
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-slate-200"
                                disabled={isLoading} // Disable button when loading
                            >
                                {isLoading ? (
                                    <div className="flex justify-center items-center gap-3">
                                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-dotted rounded-full" role="status"></div>
                                        <span className="breathing">Loading...</span>
                                    </div>
                                ) : (
                                    'CREATE'
                                )}
                            </button>
                        </form>
                    </div>
                )}
                {!showForm && <Alluser />}
            </div>
        </>
    );
}

export default Manageuser;
