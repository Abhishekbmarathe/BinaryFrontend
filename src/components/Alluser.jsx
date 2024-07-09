import React, { useState, useEffect } from 'react';

function UserProfile() {
    const [allUsers, setAllUsers] = useState([]);
    const [editableUser, setEditableUser] = useState({});
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem("allUsers"));
        if (userDetails) {
            setAllUsers(userDetails);
            // Initialize editableUser with the first user in allUsers
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

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            {allUsers.map((user, index) => (
                <div key={index} className="shadow-md rounded-lg overflow-hidden mb-4">
                    <div
                        className="border-cyan-500 border-2 w-[90vw] rounded-xl p-4 cursor-pointer flex gap-4 items-center"
                        onClick={toggleExpand}
                    >
                        <span>{user.role}</span>
                        <span className="text-white text-lg font-bold">{user.username}</span>
                    </div>
                    {isExpanded && (
                        <div className="p-4">
                            <form onSubmit={handleSave}>
                                {Object.keys(user).map((key, idx) => (
                                    !['createdAt', 'updatedAt', '__v', '_id', 'role'].includes(key) && (
                                        <div key={idx} className="mb-4">
                                            {typeof user[key] === 'boolean' ? (
                                                <div className="flex items-center">
                                                    <input
                                                        className="mr-2 leading-tight"
                                                        type="checkbox"
                                                        id={`${key}-${index}`}
                                                        name={key}
                                                        checked={user[key]}
                                                        onChange={handleChange}
                                                    />
                                                    <span className="text-white">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <label className="block text-white text-sm font-bold mb-2" htmlFor={`${key}-${index}`}>
                                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                                    </label>
                                                    <input
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 bg-transparent text-white leading-tight focus:outline-none focus:shadow-outline"
                                                        type="text"
                                                        id={`${key}-${index}`}
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
                            </form>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default UserProfile;
