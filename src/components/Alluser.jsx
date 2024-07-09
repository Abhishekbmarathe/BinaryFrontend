import React, { useState, useEffect } from 'react';

function UserProfile() {
    const [mUser, setUser] = useState({});
    const [editableUser, setEditableUser] = useState({});
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem("allUsers"));
        const userDetail = userDetails;
        if (userDetail) {
            setUser(userDetail);
            setEditableUser(userDetail);
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
            <div className="shadow-md rounded-lg overflow-hidden">
                <div
                    className="border-cyan-500 border-2 w-[90vw] rounded-xl p-4 cursor-pointer flex gap-4 items-center"
                    onClick={toggleExpand}
                >
                    <span>{editableUser.role}</span>
                    <span className="text-white text-lg font-bold">{editableUser.username}</span>
                </div>
                {isExpanded && (
                    <div className="p-4">
                        <form onSubmit={handleSave}>
                            {Object.keys(editableUser).map((key, index) => (
                                !['createdAt', 'updatedAt', '__v', '_id','role'].includes(key) && (
                                    <div key={index} className="mb-4">
                                        {typeof editableUser[key] === 'boolean' ? (
                                            <div className="flex items-center">
                                                <input
                                                    className="mr-2 leading-tight"
                                                    type="checkbox"
                                                    id={key}
                                                    name={key}
                                                    checked={editableUser[key]}
                                                    onChange={handleChange}
                                                />
                                                <span className="text-white">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <label className="block text-white text-sm font-bold mb-2" htmlFor={key}>
                                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                                </label>
                                                <input
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-transparent text-white leading-tight focus:outline-none focus:shadow-outline"
                                                    type="text"
                                                    id={key}
                                                    name={key}
                                                    value={editableUser[key]}
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
        </div>
    );
}

export default UserProfile;
