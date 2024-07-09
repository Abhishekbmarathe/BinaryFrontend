import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function UserDetail() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
            const response = await axios.post('https://binarysystemsbackend-mtt8.onrender.com/api/updateUser', user);
            console.log('Saved user details:', response.data);
            localStorage.setItem("userDet", JSON.stringify(user));
            alert("Saved successfully...")
        } catch (error) {
            console.error('Error saving user details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await axios.delete(`https://binarysystemsbackend-mtt8.onrender.com/api/deleteUser/${user._id}`);
            console.log('User deleted:', user._id);
            // history.push('/'); // Redirect to the main page after deletion
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
        <div className="max-w-md mx-auto mt-10">
            <div className="shadow-md rounded-lg overflow-hidden mb-4">
                <div className="p-4">
                    {isLoading &&
                        <div className="flex justify-center items-center gap-3">
                            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-dotted rounded-full" role="status">
                            </div>
                            <span className="breathing">Saving...</span>
                        </div>}
                    {!isLoading && (
                        <form onSubmit={handleSave}>
                            {Object.keys(user).map((key, idx) => (
                                !['createdAt', 'updatedAt', '__v', '_id', 'role'].includes(key) && (
                                    <div key={idx} className="mb-4">
                                        {typeof user[key] === 'boolean' ? (
                                            <div className="flex items-center">
                                                <input
                                                    className="mr-2 leading-tight"
                                                    type="checkbox"
                                                    id={`${key}-${idx}`}
                                                    name={key}
                                                    checked={user[key]}
                                                    onChange={handleChange}
                                                />
                                                <span className="text-white">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <label className="block text-white text-sm font-bold mb-2" htmlFor={`${key}-${idx}`}>
                                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                                </label>
                                                <input
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-transparent text-white leading-tight focus:outline-none focus:shadow-outline"
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
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
                                type="button"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserDetail;
