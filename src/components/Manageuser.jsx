import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function Manageuser() {
    const [mUser, setUser] = useState({});
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const userDetails = localStorage.getItem("userDet");
        if (userDetails) {
            setUser(JSON.parse(userDetails));
        }
    }, []);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [userType, setUserType] = useState('technician');
    
    const onSubmit = data => {
        console.log(data);
        // axios.post('https://binarysystems.onrender.com/api/addUser', data)
        axios.post('http://localhost:3000/api/addUser', data)
            .then(response => {
                console.log(response);
                alert('User added successfully!');
                setShowForm(false); // Hide the form after successful submission
            })
            .catch(error => {
                console.error(error);
                alert('Failed to add user');
            });
    };

    return (
        <div className='flex flex-col justify-center items-center  ' >
            <h1 className='my-12 font-bold text-5xl'>Manage User</h1>
            <div>
                <table className='border'>
                    <thead>
                        <tr className='border-b-2'>
                            <th className='text-red-400 p-4'>Name</th>
                            <th className='text-red-400 p-4'>Phone Number</th>
                            <th className='text-red-400 p-4'>Role</th>
                            <th className='text-red-400 p-4'>Create Ticket</th>
                            <th className='text-red-400 p-4'>Assign Ticket</th>
                            <th className='text-red-400 p-4'>Manage Finance</th>
                            <th className='text-red-400 p-4'>Create Asset</th>
                            <th className='text-red-400 p-4'>Create Client</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='p-4'>{mUser.name}</td>
                            <td className='p-4'>{mUser.phoneNum}</td>
                            <td className='p-4'>{mUser.role}</td>
                            <td className='p-4'>{mUser.createTicket ? 'Yes' : 'No'}</td>
                            <td className='p-4'>{mUser.assignTicket ? 'Yes' : 'No'}</td>
                            <td className='p-4'>{mUser.manageFinance ? 'Yes' : 'No'}</td>
                            <td className='p-4'>{mUser.createAsset ? 'Yes' : 'No'}</td>
                            <td className='p-4'>{mUser.createClient ? 'Yes' : 'No'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button className='bg-slate-400 p-6 rounded my-9 absolute bottom-0 right-3' onClick={() => setShowForm(true)}>+</button>
            {showForm && (
                <div className="w-1/2 mx-auto p-4 bg-slate-500 text-white shadow-md rounded-lg">
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
                            <input
                                type="password"
                                {...register('password', { required: true })}
                                className="mt-1 bg-transparent outline-none p-2 w-full border rounded-md"
                            />
                            {errors.password && <span className="text-red-500">Password is required</span>}
                        </div>

                        {/* <div className="mb-4">
                            <label className="block text-white">Confirm Password</label>
                            <input
                                type="password"
                                {...register('confirmPassword', { required: true })}
                                className="mt-1 bg-transparent outline-none p-2 w-full border rounded-md"
                            />
                            {errors.confirmPassword && <span className="text-red-500">Confirm Password is required</span>}
                        </div> */}

                        <div className="mb-4">
                            <label className="block text-white">User Type</label>
                            <div className="mt-2">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        value="technician"
                                        {...register('role')}
                                        checked={userType === 'technician'}
                                        onChange={() => setUserType('technician')}
                                        className="form-radio bg-transparent outline-none"
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
                                        className="form-radio bg-transparent outline-none"
                                    />
                                    <span className="ml-2">Admin</span>
                                </label>
                            </div>
                        </div>

                        {userType === 'admin' && (
                            <div className="mb-4">
                                <label className="block text-white">Admin Options</label>
                                <div className="mt-2">
                                    <label className="block">
                                        <input
                                            type="checkbox"
                                            {...register('createTicket')}
                                            className="form-checkbox bg-transparent outline-none"
                                        />
                                        <span className="ml-2">Ticket Creation</span>
                                    </label>
                                    <label className="block mt-2">
                                        <input
                                            type="checkbox"
                                            {...register('assignTicket')}
                                            className="form-checkbox bg-transparent outline-none"
                                        />
                                        <span className="ml-2">Ticket Management</span>
                                    </label>
                                    <label className="block mt-2">
                                        <input
                                            type="checkbox"
                                            {...register('createClient')}
                                            className="form-checkbox bg-transparent outline-none"
                                        />
                                        <span className="ml-2">Customer Database</span>
                                    </label>
                                    <label className="block mt-2">
                                        <input
                                            type="checkbox"
                                            {...register('createAsset')}
                                            className="form-checkbox bg-transparent outline-none"
                                        />
                                        <span className="ml-2">Asset Database</span>
                                    </label>
                                    <label className="block mt-2">
                                        <input
                                            type="checkbox"
                                            {...register('manageFinance')}
                                            className="form-checkbox bg-transparent outline-none"
                                        />
                                        <span className="ml-2">Finance Management</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Manageuser;
