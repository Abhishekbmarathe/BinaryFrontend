import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShowPasswordIcon from '../../assets/Eyeopen';
import HidePasswordIcon from '../../assets/Eyeclose';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../Loader';
import api from '../modules/Api';
import Close from '../../assets/Close';
import Permissions from '../Customer_DB/Permissions';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assetId, setAssetId] = useState(localStorage.getItem('assetId'))
    const [formData, setFormData] = useState({ companyName: '', data: {}, permissions: {} });
    const [tempData, setTempData] = useState({ key: '', value: '', sensitive: false });
    // const [tempData, setTempData] = useState({ key: '', value: '', sensitive: false });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);  // Loading state
    const [selectedKey, setSelectedKey] = useState(null); // Track selected key for update
    const [errors, setErrors] = useState({ key: '', value: '' }); // Validation errors
    const role = JSON.parse(localStorage.getItem('userDet'))?.role || 'unknown';
    const [userDet, setUserdet] = useState(JSON.parse(localStorage.getItem('userDet')));

    const [dynamicData, setDynamicData] = useState([]);
    const hasEmptyProducts = dynamicData.some(item => item.productName === "");
    const hasNonEmptyProducts = dynamicData.some(item => item.productName !== "");

    const [permissionPage, setPage] = useState(false);
    const [flag, setFlag] = useState(false);
    // const [pflag, setpPflag] = useState(false);

    const location = useLocation();
    const { companyName } = location.state || {};
    const techEndPoint = role !== 'technician' ? 'api/getGlobalData' : 'api/getTechPrivateData'

    // Fetch existing data
    // useEffect(() => {
    //     setLoading(true); // Start loading
    //     axios.post(api + "api/getGlobalData", { companyName: assetId })
    //         .then(response => {
    //             const fetchedArray = response.data;
    //             const fetchedData = fetchedArray.reduce((acc, obj) => ({ ...acc, ...obj.data }), {});

    //             setFormData(prevData => ({
    //                 ...prevData,
    //                 companyName: assetId,
    //                 data: { ...prevData.data, ...fetchedData }
    //             }));
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data:', error);
    //         })
    //         .finally(() => setLoading(false)); // End loading
    // }, [companyName]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        setLoading(true); // Start loading
        const payload = role !== 'technician' ? { companyName: assetId } : { username: userDet.username };
        axios.post(api + techEndPoint, payload)
            .then(response => {
                console.log("asset p data ",response.data)
                const fetchedArray = response.data;
                setDynamicData(response.data);
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
    }, [companyName, role]);


    // const [tempData, setTempData] = useState({ key: '', value: '', sensitive: false, id: null });

    // Open modal for creating or editing data
    const openModal = (key = null) => {
        if (key) {
            setSelectedKey(key);
            setTempData({ key, value: formData.data[key]?.value || '', sensitive: formData.data[key]?.sensitive || false });
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
        setErrors({ key: '', value: '' }); // Reset errors
        setIsModalOpen(true);
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
        const existingKeys = Object.keys(formData.data);
        // Check if key already exists, excluding the original key being edited
        if (existingKeys.includes(tempData.key) && selectedKey !== tempData.key) {
            alert("Key already exists. Please enter a unique key.");
            return;
        }

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
            axios.post(api + "api/updateGlobalData", formData)
                .then(() => {
                    return axios.post(api + "api/getGlobalData", { companyName: assetId });
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

    return (
        <div className='md:w-1/2 m-auto'>
            <div className='flex justify-between items-center mb-5 p-4 font-sans'>
                <h2 className="text-2xl w-fit font-semibold">Global <span className='text-customColor'>Data</span></h2>

                <div>
                    {permissionPage ? (
                        <div>
                            {/* {!pflag && (
                                <button
                                    className='rounded-xl flex justify-center w-fit items-center font-sans text-green-500'
                                    onClick={submitToApi}
                                    disabled={loading} // Disable if loading
                                >Save Changes<span className='text-xs'>&nbsp;●</span>
                                </button>
                            )} */}
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
                <Permissions companyName={assetId} />
            ) : (
                <div className=''>
                    {/* Button to Open the Modal for Creating */}
                    <div className='px-5'>
                        <button
                            className='bg-blue-400 text-white py-1 rounded hover:opacity-85 px-3 mb-9  flex justify-between w-20 items-center'
                            onClick={() => openModal()}
                        >
                            <span className='text-white text-xl font-bold'>+</span> New
                        </button>
                    </div>

                    {/* Save Button */}


                    {/* Display Loading State */}
                    {loading ? (
                        <Loader />
                    ) : (
                        <div>
                            {/* Display Existing and Newly Added Data */}
                            {role !== 'technician' ? (
                                <div>

                                    {Object.entries(formData.data).map(([key, { value, sensitive }], index) => (
                                        <div key={index} className='px-4 py-2 m-auto rounded border font-sans border-cyan-400/ border-black w-[95%] mb-2'
                                            onClick={() => openModal(key)} // Open modal on click with existing data
                                        >
                                            <div className='flex flex-col font-sans'>
                                                <span className='font-semibold text-xl text-customColor'>{key}</span>
                                                <div className='flex gap-1'>
                                                    <span className='font-semibold'>Value : </span>
                                                    <span>{value}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    {hasNonEmptyProducts && (
                                        <div>
                                            {/* currentlt this block of code is not used anywhere */}

                                            {/* // Block for items with non-empty productName */}
                                            <div className="non-empty-product-block">
                                                {dynamicData.map((item, index) => (
                                                    item.productName !== "" && (
                                                        <div key={index} className="data-card px-4 py-2 m-auto rounded border font-sans border-cyan-400/ border-black w-[95%] mb-2">
                                                            {Object.entries(item).map(([key, value]) => (
                                                                key !== "companyName" && key !== "productName" && (
                                                                    <p key={key}>
                                                                        <strong>{key}:</strong> {value}
                                                                    </p>
                                                                )
                                                            ))}
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                            }
                        </div>
                    )}

                    {/* Modal Popup */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
                            <div className="bg-white p-6 rounded shadow-lg w-[88%] relative md:w-1/2">
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

                                <div className="flex justify-end gap-3">
                                    <button
                                        className="bg-red-500 text-white p-2 absolute right-2 top-3 rounded-full"
                                        onClick={closeModal}
                                    >
                                        <Close />
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