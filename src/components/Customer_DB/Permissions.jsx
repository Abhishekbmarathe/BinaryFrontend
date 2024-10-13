import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../modules/Api';

const Permissions = ({ companyName }) => {
    const [formData, setFormData] = useState({
        companyName: companyName || '',
        data: {},  // Will store the key-value pairs like key1, key2, etc.
        permissions: {},  // Will store username with keys they have access to
    });
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [grantedPermissions, setGrantedPermissions] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [permissionData, setPermissionData] = useState({ username: '', key: '' });

    useEffect(() => {
        // setLoading(true); // Start loading
        axios.post(api + "api/getGlobalData", { companyName })
            .then(response => {
                const fetchedArray = response.data;
                const fetchedData = fetchedArray.reduce((acc, obj) => ({ ...acc, ...obj.data }), {});

                setFormData(prevData => ({
                    ...prevData,
                    companyName,
                    data: { ...prevData.data, ...fetchedData }
                }));
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })
        // .finally(() => setLoading(false)); // End loading
    }, [companyName]);
    console.log("initial form data === ", formData)

    const openPermissionModal = (index) => {
        if (index !== null && grantedPermissions[index]) {
            setEditIndex(index);
            setPermissionData(grantedPermissions[index]);
        } else {
            setEditIndex(null);
            setPermissionData({ username: '', key: '' });
        }
        setIsPermissionModalOpen(true);
    };

    const closePermissionModal = () => {
        setIsPermissionModalOpen(false);
    };

    const handlePermissionInputChange = (e) => {
        const { name, value } = e.target;
        setPermissionData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Submits data in the required format
    const submitToApi = async () => {
        try {
            // Create the permissions map from grantedPermissions
            const permissionsMap = grantedPermissions.reduce((acc, permission) => {
                const { username, key } = permission;
                if (!acc[username]) {
                    acc[username] = [];
                }
                if (!acc[username].includes(key)) {
                    acc[username].push(key); // Add key to the user's permission array
                }
                return acc;
            }, {});

            // Check if formData contains the data and log it
            console.log("FormData:", formData); // Check the full formData before submission
            console.log("Data being submitted:", formData.data); // Specifically check the 'data' field

            // Wrap everything into the 'data' variable
            const payload = {
                companyName: formData.companyName,
                data: formData.data,  // Ensure this contains your data
                permissions: permissionsMap,  // Permissions map constructed from grantedPermissions
            };

            console.log('Payload submitted:', payload);  // Log the full payload

            // Await the response from the API
            const response = await axios.post(api + 'api/updateGlobalData', payload);

            console.log('Response from API:', response.data);  // Check the response from the API

            if (response.data.status) {
                console.log('Permissions successfully submitted:', response.data.message || 'Success');
            } else {
                console.log('Failed to submit permissions:', response.data.message || 'Failure');
            }

        } catch (error) {
            console.error('Error submitting permissions:', error);
        }
    };





    const handleSavePermission = () => {
        if (permissionData.username && permissionData.key) {
            const newPermission = {
                ...permissionData,
                grantedAt: new Date().toLocaleString(),
            };

            if (editIndex !== null) {
                const updatedPermissions = grantedPermissions.map((permission, index) =>
                    index === editIndex ? newPermission : permission
                );
                setGrantedPermissions(updatedPermissions);
                setEditIndex(null);
            } else {
                setGrantedPermissions((prevPermissions) => [
                    ...prevPermissions,
                    newPermission,
                ]);
            }
            setIsPermissionModalOpen(false);
        } else {
            console.log('Username and key are required.');
        }
    };

    return (
        <div>
            <button
                className='rounded-xl flex justify-center w-fit items-center font-sans text-green-500'
                onClick={submitToApi}
            >
                Save Changes<span className='text-xs'>&nbsp;●</span>
            </button>

            <div className="mb-4">
                <h3 className="text-lg font-bold">Granted Permissions:</h3>
                <ul>
                    {grantedPermissions.map((permission, index) => (
                        <li key={index} className="flex justify-between p-2 border bg-cyan-100">
                            <span>{permission.username}</span>
                            <span>{permission.key}</span>
                            <button
                                onClick={() => openPermissionModal(index)}
                                className="text-blue-500 hover:underline"
                            >
                                Edit
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {isPermissionModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[88%]">
                        <h2 className="text-xl font-semi-bold mb-4 font-sans">
                            {editIndex !== null ? 'Edit Permission' : 'Grant Permission to User'}
                        </h2>
                        <div className="mb-4">
                            <label className="block mb-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={permissionData.username}
                                onChange={handlePermissionInputChange}
                                className="border rounded w-full p-2"
                                placeholder="Enter username"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Key</label>
                            <input
                                type="text"
                                name="key"
                                value={permissionData.key}
                                onChange={handlePermissionInputChange}
                                className="border rounded w-full p-2"
                                placeholder="Enter permission key"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleSavePermission}
                                className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                            >
                                {editIndex !== null ? 'Update' : 'Grant'}
                            </button>
                            <button
                                onClick={closePermissionModal}
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                className='bg-slate-400 py-2 px-3 rounded-xl my-9 fixed bottom-12 right-8 flex justify-between w-20 items-center'
                onClick={() => openPermissionModal(null)}
            >
                <span className='text-white text-xl font-bold'>+</span> New
            </button>
        </div>
    );
};

export default Permissions;
