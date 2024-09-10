import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShowPasswordIcon from '../../assets/Eyeopen';
import HidePasswordIcon from '../../assets/Eyeclose';
import { useNavigate, useLocation } from 'react-router-dom';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ companyName: '', data: {}, permissions: {} });
    const [tempData, setTempData] = useState({ key: '', value: '', sensitive: false }); // Temp storage for new key-value pairs
    const [showPassword, setShowPassword] = useState(false);
    const [existingData, setExistingData] = useState([]); // State to store fetched data

    const location = useLocation();
    const { companyName, customerId } = location.state || {};

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const url = 'https://binarysystemsbackend-mtt8.onrender.com/api/';
    // Fetch existing data on component load
    useEffect(() => {
        axios.post(url + "getGlobalData", { companyName })
            .then(response => {
                const fetchedArray = response.data; // The array of objects from the response
                const fetchedData = fetchedArray.reduce((acc, obj) => ({ ...acc, ...obj.data }), {});

                setFormData(prevData => ({
                    ...prevData,
                    companyName,
                    data: { ...prevData.data, ...fetchedData } // Append the new data to the formData
                }));
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [companyName]);


    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setTempData({ key: '', value: '', sensitive: false }); // Reset temp data when modal is closed
    };

    // Handle form field changes (for modal input)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle checkbox change for sensitive field
    const handleSensitiveChange = (e) => {
        setTempData((prevData) => ({
            ...prevData,
            sensitive: e.target.checked,
        }));
    };

    // Add key-value pair to formData
    const handleSubmit = () => {
        setFormData((prevData) => ({
            ...prevData,
            data: {
                ...prevData.data,
                [tempData.key]: {
                    value: tempData.value,
                    sensitive: tempData.sensitive,
                },
            },
        }));
        closeModal(); // Close modal after adding the key-value pair
    };

    // Submit the entire formData to the server
    const handleSave = () => {
        axios.post(url + "updateGlobalData", formData)
            .then(response => {
                // Fetch updated data from server after successful save
                return axios.post(url + "getGlobalData", { companyName }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            })
            .then(response => {
                const fetchedArray = response.data; // The array of objects from the response
                const fetchedData = fetchedArray.reduce((acc, obj) => ({ ...acc, ...obj.data }), {});

                setFormData(prevData => ({
                    ...prevData,
                    companyName,
                    data: { ...prevData.data, ...fetchedData } // Append the new data to the formData
                }));
            })
            .catch(error => {
                console.error('Error submitting data:', error);
            });
    };

    return (
        <div>
            <div className='flex justify-between items-center mb-10 p-4 font-sans'>
                <h2 className="text-2xl w-fit font-semibold">Global <span className='text-customColor'>Data</span></h2>
                <div className='flex items-center gap-5'>
                    <button className='text-red-400 font-semibold'>Permissions <span className='text-xs'>●</span></button>
                </div>
            </div>

            {/* Button to Open the Modal */}
            <button
                className='bg-slate-400 py-2 px-3 rounded-xl my-9 fixed bottom-0 right-8 flex justify-between w-20 items-center'
                onClick={openModal}
            >
                <span className='text-white text-xl font-bold'>+</span> New
            </button>

            {/* Save Button */}
            <button
                className='bg-cyan-400 p-2 rounded-xl my-9 fixed bottom-0 left-8 flex justify-center w-28 items-center font-sans'
                onClick={handleSave}
            >
                <span className='text-white text-xl font-semibold '>Save</span>
            </button>

            {/* Display Existing and Newly Added Data */}
            {Object.entries(formData.data).map(([key, { value, sensitive }], index) => (
                <div key={index} className='bg-cyan-100 px-4 py-3 m-auto rounded border font-sans border-cyan-400 w-[95%] mb-2'>
                    <div className='flex justify-between'>
                        <span className='font-medium'>{key}</span>
                        <span>{value}</span>
                    </div>
                </div>
            ))}

            {/* Modal Popup */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[88%]">
                        <h2 className="text-xl font-semi-bold mb-4 font-sans">Enter Key-Value Pair</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Key
                            </label>
                            <input
                                type="text"
                                name="key"
                                value={tempData.key}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-500 rounded shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter key"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Value
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="value"
                                    value={tempData.value}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter value"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 z-30"
                                >
                                    {showPassword ? (
                                        <ShowPasswordIcon size={6} color="rgb(0 197 255)" />
                                    ) : (
                                        <HidePasswordIcon size={6} color="rgb(0 197 255)" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Sensitive
                            </label>
                            <input
                                type="checkbox"
                                name="sensitive"
                                checked={tempData.sensitive}
                                onChange={handleSensitiveChange}
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                onClick={handleSubmit}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
