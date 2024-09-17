import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShowPasswordIcon from '../../assets/Eyeopen';
import HidePasswordIcon from '../../assets/Eyeclose';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../Loader';
import api from '../modules/Api'

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ companyName: '', data: {}, permissions: {} });
    // const [tempData, setTempData] = useState({ key: '', value: '', sensitive: false });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);  // Loading state
    const [selectedKey, setSelectedKey] = useState(null); // Track selected key for update
    const [errors, setErrors] = useState({ key: '', value: '' }); // Validation errors

    const [permissionPage, setPage] = useState(false);
    const [flag, setFlag] = useState(false);
    const [pflag, setpPflag] = useState(false);

    const location = useLocation();
    const { companyName, customerId } = location.state || {};
   
    // Fetch existing data
    useEffect(() => {
        setLoading(true); // Start loading
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
            .finally(() => setLoading(false)); // End loading
    }, [companyName]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const [tempData, setTempData] = useState({ key: '', value: '', sensitive: false, id: null });

    // Open modal for creating or editing data
    const openModal = (key = null) => {
        if (key) {
            setSelectedKey(key);
            setTempData({
                key: key,
                value: formData.data[key]?.value || '',
                sensitive: formData.data[key]?.sensitive || false,
                id: formData.data[key]?._id || null // Store the object ID for future comparison
            });
            console.log(tempData.id)
        } else {
            setTempData({ key: '', value: '', sensitive: false });
        }
        setErrors({ key: '', value: '' }); // Reset any previous errors
        setIsModalOpen(true); // Open the modal
    };

    // console.log(tempData.id)

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedKey(null);
    };

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSensitiveChange = (e) => {
        setTempData((prevData) => ({
            ...prevData,
            sensitive: e.target.checked,
        }));
    };

    // Validate form data
    const validateForm = () => {
        let hasError = false;
        let newErrors = { key: '', value: '' };

        // Check if key is empty
        if (!tempData.key.trim()) {
            newErrors.key = 'Key cannot be empty';
            hasError = true;
        }

        // Check if value is empty
        if (!tempData.value.trim()) {
            newErrors.value = 'Value cannot be empty';
            hasError = true;
        }

        // Check if key already exists (on update only)
        if (!selectedKey && tempData.key in formData.data) {
            newErrors.key = 'This key already exists';
            hasError = true;
        }

        setErrors(newErrors);
        return !hasError; // Return true if no errors
    };

    // Add or update key-value pair
    const handleSubmit = () => {
        if (!tempData.key || !tempData.value) {
            alert("Key and Value cannot be empty.");
            return;
        }

        setFlag(true);

        // Directly modify the existing formData
        setFormData((prevData) => {
            // Clone the previous data
            const updatedData = { ...prevData };

            // Find the specific card using the key and update its value and sensitive fields
            if (updatedData.data[tempData.key]) {
                updatedData.data[tempData.key].value = tempData.value; // Update value
                updatedData.data[tempData.key].sensitive = tempData.sensitive; // Update sensitive flag
            }

            return updatedData; // Return the updated data without creating new entries
        });

        // Close the modal after updating
        closeModal();
    };




    // Delete key-value pair
    const handleDelete = () => {
        setFlag(true)
        setFormData((prevData) => {
            const updatedData = { ...prevData.data };
            delete updatedData[selectedKey];
            return { ...prevData, data: updatedData };
        });
        closeModal();
    };

    // Submit the data to the server
    const handleSave = () => {
        const cnf = confirm("Are you sure to save the changes?");
        if (cnf) {
            setLoading(true); // Start loading
            axios.post(api + "updateGlobalData", formData)
                .then(() => {
                    return axios.post(api + "api/getGlobalData", { companyName });
                })
                .then(response => {
                    const fetchedArray = response.data;
                    const fetchedData = fetchedArray.reduce((acc, obj) => ({ ...acc, ...obj.data }), {});

                    // Updating only the existing keys and adding new ones
                    setFormData(prevData => {
                        const updatedData = { ...prevData.data };

                        // Loop through fetchedData to either update or add new keys
                        Object.keys(fetchedData).forEach(key => {
                            if (updatedData.hasOwnProperty(key)) {
                                // Update existing key value
                                updatedData[key] = fetchedData[key];
                            } else {
                                // If it's new, add only when creating
                                if (isCreating) {  // 'isCreating' is a flag you should set for Create operations
                                    updatedData[key] = fetchedData[key];
                                }
                            }
                        });

                        return {
                            ...prevData,
                            companyName,
                            data: updatedData
                        };
                    });

                    alert("Changes saved successfully");
                    setFlag(false);
                })
                .catch(error => {
                    alert("Error saving changes");
                    console.error('Error submitting data:', error);
                })
                .finally(() => setLoading(false)); // End loading
        }
    };





    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [permissionData, setPermissionData] = useState({ username: '', key: '' });
    const [grantedPermissions, setGrantedPermissions] = useState([]);
    const [editIndex, setEditIndex] = useState(null); // To track which permission is being edited

    // Handle input change
    const handlePermissionInputChange = (e) => {
        const { name, value } = e.target;
        setPermissionData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Open permission modal for editing
    const openPermissionModal = (index = null) => {
        if (index !== null && grantedPermissions[index]) {
            // Editing existing permission
            setPermissionData(grantedPermissions[index]); // Pre-fill with existing data
            setEditIndex(index); // Track the index being edited
        } else {
            // Adding new permission
            setPermissionData({ username: '', key: '' }); // Reset form fields
            setEditIndex(null); // No edit, it's new
        }
        setIsPermissionModalOpen(true);
    };


    // Close permission modal
    const closePermissionModal = () => {
        setIsPermissionModalOpen(false);
        setEditIndex(null); // Reset editing state when closed
    };

    // Handle grant permission (add or update)
    const handleGrantPermission = () => {
        // Ensure username and key are provided
        if (!permissionData.username.trim() || !permissionData.key.trim()) {
            alert("Username and key are required to grant permission.");
            return; // Stop execution if validation fails
        }

        // Add the new permission to grantedPermissions array
        setGrantedPermissions((prevPermissions) => [
            ...prevPermissions,
            { ...permissionData, grantedAt: new Date().toLocaleString() },
        ]);

        console.log(`Permission granted to user ${permissionData.username} for key ${permissionData.key} at ${new Date().toLocaleString()}`);

        // Close the permission modal
        closePermissionModal();
    };




    return (
        <div className='md:w-1/2 m-auto'>
            <div className='flex justify-between items-center mb-10 p-4 font-sans'>
                <h2 className="text-2xl w-fit font-semibold">Global <span className='text-customColor'>Data</span></h2>

                <div>
                    {permissionPage ? (
                        <div>
                            {pflag && (
                                <button
                                    className='rounded-xl flex justify-center w-fit items-center font-sans text-green-500'
                                    // onClick={handleSave}
                                    disabled={loading} // Disable if loading
                                >Save Changes<span className='text-xs'>&nbsp;●</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        <div>
                            {flag && (
                                <button
                                    className='rounded-xl flex justify-center w-fit items-center font-sans text-green-500'
                                    onClick={handleSave}
                                    disabled={loading} // Disable if loading
                                >Save Changes<span className='text-xs'>&nbsp;●</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>




            </div>
            <div className='flex items-center justify-center fixed bottom-4 left-1/2 -translate-x-1/2 gap-14'>
                <button className='font-sans text-xl text-customColor w-16' onClick={() => setPage(false)}>Data </button>
                <button type='button' className='text-3xl'>|</button>
                <button className='font-sans text-xl text-customColor' onClick={() => setPage(true)}>Permissions</button>
            </div>

            {permissionPage ? (
                <div>
                    {/* Permission Cards */}
                    {grantedPermissions.map((permission, index) => (
                        <div
                            key={index}
                            className='bg-cyan-100 px-4 py-3 m-auto rounded border font-sans border-cyan-400 w-[95%] mb-2 cursor-pointer'
                            onClick={() => openPermissionModal(index)} // Open modal with the clicked card data
                        >
                            <div className='flex justify-between'>
                                <span className='font-medium'>User: {permission.username}</span>
                                <span>Key: {permission.key}</span>
                                <span>Granted At: {permission.grantedAt}</span>
                            </div>
                        </div>
                    ))}

                    {/* Permission Modal */}
                    {isPermissionModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded shadow-lg w-[88%] md:w-1/3">
                                <h2 className="text-xl font-semi-bold mb-4 font-sans">
                                    {editIndex !== null ? "Edit Permission" : "Grant Permission to User"}
                                </h2>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={permissionData.username}
                                        onChange={handlePermissionInputChange}
                                        className="mt-1 block w-full border border-gray-500 rounded shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter username"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Select Key</label>
                                    <input
                                        type="text"
                                        name="key"
                                        value={permissionData.key}
                                        onChange={handlePermissionInputChange}
                                        className="mt-1 block w-full border border-gray-500 rounded shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter key"
                                        list="key-suggestions"
                                        autoComplete="off"
                                    />
                                    {/* Suggestions for keys */}
                                    <datalist id="key-suggestions">
                                        {Object.keys(formData.data).map((key, index) => (
                                            <option key={index} value={key} />
                                        ))}
                                    </datalist>
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                        onClick={closePermissionModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                        onClick={handleGrantPermission}
                                    >
                                        {editIndex !== null ? "Update" : "Grant"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        className='bg-slate-400 py-2 px-3 rounded-xl my-9 fixed bottom-12 right-8 flex justify-between w-20 items-center'
                        onClick={openPermissionModal}
                    >
                        <span className='text-white text-xl font-bold'>+</span> New
                    </button>
                </div>
            ) : (
                <div>
                    {/* Button to Open the Modal for Creating */}
                    <button
                        className='bg-slate-400 py-2 px-3 rounded-xl my-9 fixed bottom-12 right-8 flex justify-between w-20 items-center'
                        onClick={() => openModal()}
                    >
                        <span className='text-white text-xl font-bold'>+</span> New
                    </button>

                    {/* Save Button */}


                    {/* Display Loading State */}
                    {loading ? (
                        <Loader />
                    ) : (
                        <div>
                            {/* Display Existing and Newly Added Data */}
                            {Object.entries(formData.data).map(([key, { value, sensitive }], index) => (
                                <div key={index} className='bg-cyan-100 px-4 py-3 m-auto rounded border font-sans border-cyan-400 w-[95%] mb-2'
                                    onClick={() => openModal(key)} // Open modal on click with existing data
                                >
                                    <div className='flex justify-between'>
                                        <span className='font-medium'>{key}</span>
                                        <span>{value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Modal Popup */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded shadow-lg w-[88%] md:w-1/3">
                                <h2 className="text-xl font-semi-bold mb-4 font-sans">
                                    {selectedKey ? 'Update Key-Value Pair' : 'Enter Key-Value Pair'}
                                </h2>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Key</label>
                                    <input
                                        type="text"
                                        name="key"
                                        value={tempData.key}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-500 rounded shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter key"
                                    />

                                    {errors.key && <span className="text-red-500 text-xs">{errors.key}</span>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Value</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="value"
                                            value={tempData.value}
                                            onChange={handleInputChange}
                                            className={`mt-1 block w-full border ${errors.value ? 'border-red-500' : 'border-gray-500'} rounded shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                            placeholder="Enter value"
                                        />
                                        <span className="absolute right-2 top-2 cursor-pointer" onClick={togglePasswordVisibility}>
                                            {showPassword ? <ShowPasswordIcon size={6} color="rgb(0 197 255)" /> : <HidePasswordIcon size={6} color="rgb(0 197 255)" />}
                                        </span>
                                    </div>
                                    {errors.value && <span className="text-red-500 text-xs">{errors.value}</span>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Sensitive</label>
                                    <input
                                        type="checkbox"
                                        checked={tempData.sensitive}
                                        onChange={handleSensitiveChange}
                                        className="mr-2"
                                    />
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        className="bg-gray-500 text-white px-4 py-2 rounded"
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </button>
                                    {selectedKey && (
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </button>
                                    )}
                                    <button
                                        className="bg-cyan-500 text-white px-4 py-2 rounded"
                                        onClick={handleSubmit}
                                    >
                                        {selectedKey ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}







        </div>
    );
}

export default App;
