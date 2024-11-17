import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../modules/Api';

// MultiCheckbox component for multiple key selection
const MultiCheckbox = ({ options, selectedValues, onChange }) => {
    const handleCheckboxChange = (option) => {
        const updatedValues = selectedValues.includes(option)
            ? selectedValues.filter((value) => value !== option)
            : [...selectedValues, option];

        onChange(updatedValues);
    };

    return (
        <div className="flex flex-col">
            {options.map((option) => (
                <label key={option} className="flex items-center mb-2">
                    <input
                        type="checkbox"
                        value={option}
                        checked={selectedValues.includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                        className="mr-2"
                    />
                    {option}
                </label>
            ))}
        </div>
    );
};

const Permissions = ({ companyName }) => {
    const [formData, setFormData] = useState({
        companyName: companyName || '',
        data: {},
        permissions: {},
    });
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [grantedPermissions, setGrantedPermissions] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [permissionData, setPermissionData] = useState({ username: '', key: [] });
    const [availableKeys] = useState(['Key1', 'Key2', 'Key3', 'Key4']); // Example keys
    const [suggestions] = useState(['s1', 's2', 's3', 's4', 's5']); // Custom suggestions
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestionBox, setShowSuggestionBox] = useState(false);

    useEffect(() => {
        axios.post(api + "api/getGlobalData", { companyName})
            .then(response => {
                const fetchedArray = response.data;
                const fetchedData = fetchedArray.reduce((acc, obj) => ({ ...acc, ...obj.data }), {});
                const fetchedPermissions = fetchedArray.reduce((acc, obj) => ({ ...acc, ...obj.permissions }), {});

                setFormData(prevData => ({
                    ...prevData,
                    companyName,
                    data: { ...prevData.data, ...fetchedData },
                    permissions: { ...prevData.permissions, ...fetchedPermissions }
                }));

                const permissionsArray = Object.entries(fetchedPermissions).map(([username, keys]) => ({
                    username,
                    key: Array.isArray(keys) ? keys : [keys],
                    grantedAt: new Date().toLocaleString()
                }));

                setGrantedPermissions(permissionsArray);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [companyName]);

    const openPermissionModal = (index) => {
        if (index !== null && grantedPermissions[index]) {
            setEditIndex(index);
            setPermissionData(grantedPermissions[index]);
        } else {
            setEditIndex(null);
            setPermissionData({ username: '', key: [] });
        }
        setIsPermissionModalOpen(true);
    };

    const closePermissionModal = () => {
        setIsPermissionModalOpen(false);
        setShowSuggestionBox(false);
    };

    const handleUsernameChange = (e) => {
        const inputValue = e.target.value;
        setPermissionData({ ...permissionData, username: inputValue });

        // Filter suggestions based on input
        if (inputValue) {
            const filtered = suggestions.filter(suggestion =>
                suggestion.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions(suggestions);
        }
    };

    const handleUsernameFocus = () => {
        setFilteredSuggestions(suggestions);
        setShowSuggestionBox(true);
    };

    const handleSuggestionSelect = (suggestion) => {
        setPermissionData({ ...permissionData, username: suggestion });
        setShowSuggestionBox(false);
        setFilteredSuggestions([]);
    };

    const handleKeyInputChange = (e) => {
        const value = e.target.value;
        const newKeys = value.split(',').map(k => k.trim()).filter(k => k); // Split by comma and trim

        setPermissionData(prevData => ({
            ...prevData,
            key: newKeys
        }));

        // Update checkboxes based on input
        const checkedKeys = availableKeys.filter(key => newKeys.includes(key));
        setPermissionData(prevData => ({
            ...prevData,
            key: checkedKeys
        }));
    };

    const handleKeyCheckboxChange = (updatedKeys) => {
        // Update key state based on checkbox selection
        setPermissionData(prevData => ({
            ...prevData,
            key: updatedKeys
        }));
    };

    const handleBackspace = (e) => {
        if (e.key === 'Backspace') {
            const currentKeys = permissionData.key;
            if (currentKeys.length > 0) {
                const newKeys = currentKeys.slice(0, -1); // Remove last key
                setPermissionData(prevData => ({
                    ...prevData,
                    key: newKeys
                }));
            }
        }
    };

    const handleSavePermission = () => {
        if (permissionData.username && permissionData.key.length > 0) {
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
            console.log('Username and at least one key are required.');
        }
    };

    const submitToApi = async () => {
        try {
            const permissionsMap = grantedPermissions.reduce((acc, permission) => {
                const { username, key } = permission;
                if (!acc[username]) {
                    acc[username] = [];
                }
                key.forEach(k => {
                    if (!acc[username].includes(k)) {
                        acc[username].push(k);
                    }
                });
                return acc;
            }, {});

            const payload = {
                companyName: formData.companyName,
                data: formData.data,
                permissions: permissionsMap,
            };

            const response = await axios.post(api + 'api/updateGlobalData', payload);

            if (response.data.status) {
                console.log('Permissions successfully submitted:', response.data.message || 'Success');
            } else {
                console.log('Failed to submit permissions:', response.data.message || 'Failure');
            }
        } catch (error) {
            console.error('Error submitting permissions:', error);
        }
    };

    return (
        <div>
            <div className="mb-4 px-3">
                <div className='flex justify-between flex-wrap gap-2 px-2 mb-3 font-sans'>
                    <h3 className="text-lg font-bold">Granted Permissions</h3>
                    <div className='flex'>
                        <button
                            className='rounded flex justify-center w-fit items-center bg-blue-500 mr-2 text-white px-2 py-1 hover:opacity-85'
                            onClick={() => openPermissionModal(null)}
                        >
                            Add Permission
                        </button>
                        <button
                            className='rounded flex justify-center w-fit items-center bg-blue-500 mr-2 text-white px-2 py-1 hover:opacity-85'
                            onClick={submitToApi}
                        >
                            Save Changes<span className='text-xs'>&nbsp;●</span>
                        </button>
                    </div>
                </div>
                <ul className='font-sans'>
                    {grantedPermissions.map((permission, index) => (
                        <li key={index}
                            onClick={() => openPermissionModal(index)}
                            className="flex flex-col p-4 border border-black rounded cursor-pointer mb-2">
                            <div className="flex justify-between mb-2">
                                <div className="text-customColor text-xl font-semibold">{permission.username}</div>
                            </div>
                            <div className="flex flex-wrap">
                                {permission.key.map((k, i) => (
                                    <span key={i} className="mr-2  px-2 shadow-customShadow text-black rounded">{k}</span>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {isPermissionModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[88%] md:w-1/2">
                        <h2 className="text-xl font-semibold mb-4">
                            {editIndex !== null ? 'Edit Permission' : 'Grant Permission to User'}
                        </h2>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Username"
                                value={permissionData.username}
                                onChange={handleUsernameChange}
                                onFocus={handleUsernameFocus}
                                className="border rounded p-2 w-full"
                            />
                            {showSuggestionBox && filteredSuggestions.length > 0 && (
                                <ul className="border border-gray-300 bg-white">
                                    {filteredSuggestions.map((suggestion, idx) => (
                                        <li key={idx}
                                            onClick={() => handleSuggestionSelect(suggestion)}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Keys (comma separated)"
                                value={permissionData.key.join(', ')}
                                onChange={handleKeyInputChange}
                                onKeyDown={handleBackspace}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <MultiCheckbox
                            options={availableKeys}
                            selectedValues={permissionData.key}
                            onChange={handleKeyCheckboxChange}
                        />
                        <div className="flex justify-end mt-4">
                            <button className="bg-gray-300 text-black px-4 py-2 rounded mr-2" onClick={closePermissionModal}>
                                Cancel
                            </button>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSavePermission}>
                                {editIndex !== null ? 'Update' : 'Add Permission'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Permissions;
