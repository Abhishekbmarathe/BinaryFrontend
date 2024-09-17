import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import fetchAndStoreUsers from '../modules/fetchAllusers';
import api from '../modules/Api'

function UserDetail() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem("allUsers"));
        const selectedUser = userDetails.find(user => user._id === userId);
        setUser(selectedUser);
    }, [userId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser({
            ...user,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const conf = confirm("Are you sure to save the changes ?")
            if (conf) {
                const response = await axios.post(api + 'api/updateUser', user);
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
            const conf = confirm("Are you sure to delete this user")
            if (conf) {

                await axios.post(api + 'api/deleteUser', { username: user.username });
                console.log('User deleted:', user.username);
                fetchAndStoreUsers();
                alert("User Deleted successfully...");
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
        <div className="max-w-md mx-auto mt-10 sm:max-w-[50vw]">
            <h1 className='m-auto w-fit text-2xl'> Edit <span className='text-customColor'>Profile</span></h1>
            <div className="shadow-md shadow-gray-400 rounded-lg overflow-hidden mb-4">
                <div className="p-4">
                    {isLoading &&
                        <div className="flex justify-center items-center gap-3">
                            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-dotted rounded-full" role="status">
                            </div>
                            <span className="breathing">Loading...</span>
                        </div>}
                    {!isLoading && (
                        <form onSubmit={(e) => e.preventDefault()}>
                            {Object.keys(user).map((key, idx) => (
                                !['createdAt', 'updatedAt', '__v', '_id', 'role'].includes(key) && (
                                    <div key={idx} className="mb-4">
                                        {typeof user[key] === 'boolean' ? (
                                            <div className="flex items-center">
                                                <input
                                                    className="mr-2 leading-tight w-6 h-6 cursor-pointer"
                                                    type="checkbox"
                                                    id={`${key}-${idx}`}
                                                    name={key}
                                                    checked={user[key]}
                                                    onChange={handleChange}
                                                />
                                                <span className="text-black">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <label className="block text-black text-sm font-bold mb-2" htmlFor={`${key}-${idx}`}>
                                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                                </label>
                                                <input
                                                    className="shadow-md shadow-gray-400 appearance-none border rounded w-full py-2 px-3 bg-transparent text-black leading-tight focus:outline-none focus:shadow-outline sm:py-4 sm:rounded-xl"
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
                            <button
                                className="bg-slate-300 w-full hover:bg-slate-200 text-purple-500 sm:font-bold  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={handleSave}
                            >
                                UPDATE
                            </button><br /><br />
                            <button
                                className="bg-slate-300 text-red-400 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline block"
                                type="button"
                                onClick={handleDelete}
                            >
                                DELETE
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserDetail;
