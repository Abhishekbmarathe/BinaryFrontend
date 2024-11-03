import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import api from '../modules/Api';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import Camera from '../../assets/camera';

function NewCustomerForm() {
    const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const { companyName, customerId } = location.state || {};
    const [creator, setCreator] = useState(JSON.parse(localStorage.getItem('userDet')).username);

    const [scanningIndex, setScanningIndex] = useState(null);
    const scannerRef = useRef(null);

    const [focusedField, setFocusedField] = useState(null);

    const [filteredLocationSuggestions, setFilteredLocationSuggestions] = useState([]);
    const [filteredDepartmentSuggestions, setFilteredDepartmentSuggestions] = useState([]);
    const [filteredCategorySuggestions, setFilteredCategorySuggestions] = useState([]);
    const [filteredBrandSuggestions, setFilteredBrandSuggestions] = useState([]);
    const [filteredProductSuggestions, setFilteredProductSuggestions] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');

    useEffect(() => {
        const clientBranches = JSON.parse(localStorage.getItem('Clientbranches')) || [];
        const matchingBranches = clientBranches.filter(branch => branch.companyName === companyName);
        setFilteredLocationSuggestions(matchingBranches.map(branch => branch.location));
        setFilteredDepartmentSuggestions(matchingBranches.map(branch => branch.department));
    }, [companyName]);

    useEffect(() => {
        const allAssets = JSON.parse(localStorage.getItem('getAllAssets')) || [];
        setFilteredCategorySuggestions([...new Set(allAssets.map(asset => asset.category))]);
    }, []);

    const handleFieldFocus = (field) => {
        setFocusedField(field);
    };

    const handleSuggestionSelect = (field, value) => {
        reset({ ...getValues(), [field]: value });
        setFocusedField(null);

        if (field === 'category') {
            setSelectedCategory(value);
            const allAssets = JSON.parse(localStorage.getItem('getAllAssets')) || [];
            const filteredBrands = allAssets
                .filter(asset => asset.category === value)
                .map(asset => asset.brandName); // Using brandName from assets
            setFilteredBrandSuggestions([...new Set(filteredBrands)]);
            setFilteredProductSuggestions([]); // Clear products if category changes
            setSelectedBrand(''); // Reset selected brand
        }

        if (field === 'brand') { // Changed from brandName to brand
            setSelectedBrand(value);
            const allAssets = JSON.parse(localStorage.getItem('getAllAssets')) || [];
            const filteredProducts = allAssets
                .filter(asset => asset.category === selectedCategory && asset.brandName === value) // Updated to use brandName
                .map(asset => asset.productName);
            setFilteredProductSuggestions([...new Set(filteredProducts)]);
        }
    };

    useEffect(() => {
        if (scanningIndex !== null) {
            scannerRef.current = new Html5QrcodeScanner(
                "reader",
                {
                    fps: 10,
                    qrbox: 250,
                    formatsToSupport: [
                        Html5QrcodeSupportedFormats.QR_CODE,
                        Html5QrcodeSupportedFormats.EAN_13,
                        Html5QrcodeSupportedFormats.CODE_39
                    ]
                },
                false
            );
            scannerRef.current.render(handleBarcodeScan, handleError);
        }
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear();
            }
        };
    }, [scanningIndex]);

    const handleBarcodeScan = (decodedText) => {
        if (decodedText) {
            reset({ ...getValues(), serialNo: decodedText });
            setScanningIndex(null);
        }
    };

    const handleError = (error) => {
        console.error('Error scanning barcode: ', error);
    };

    const onSubmit = async (data) => {
        console.log(data);
        try {
            const response = await axios.post(api + 'api/updateClientAsset', data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'updatedby': creator
                    }
                }
            );
            console.log(response.data);
            alert('Asset created successfully');
            navigate(`/customer/${customerId}`);
            window.location.reload();
        } catch (error) {
            console.error('There was an error creating the client asset!', error);
            alert('There was an error creating the client asset!');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-2 sm:max-w-[50vw]">
            <div className="rounded-lg overflow-hidden mb-4 p-4">
                <h2 className="text-2xl mb-7 font-bold m-auto w-fit">
                    Add <span className='text-customColor'>Client Asset</span>
                </h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <input
                            type="text"
                            {...register('companyName', { required: true })}
                            className="w-full border-2 p-3 mb-1 rounded-xl"
                            value={companyName}
                            contentEditable="false"
                            hidden={true}
                        />
                    </div>
                    {/* Location Input */}
                    <div className='mb-4 relative'>
                        <input
                            {...register('location', { required: true })}
                            className='border-2 border-gray-400 focus:border-customColor outline-none rounded p-3 w-full bg-transparent'
                            placeholder='Enter location'
                            onFocus={() => handleFieldFocus('location')}
                            onBlur={() => setFocusedField(null)}
                        />
                        {errors.location && <span className='text-red-500'>Location is required</span>}
                        {focusedField === 'location' && (
                            <ul className="absolute bg-white border border-gray-300 rounded mt-1 w-full z-10">
                                {filteredLocationSuggestions.map((loc, idx) => (
                                    <li
                                        key={idx}
                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                        onMouseDown={() => handleSuggestionSelect('location', loc)}
                                    >
                                        {loc}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Department Input */}
                    <div className='mb-4 relative'>
                        <input
                            {...register('department', { required: true })}
                            className='border-2 border-gray-400 focus:border-customColor outline-none rounded p-3 w-full bg-transparent'
                            placeholder='Enter department'
                            onFocus={() => handleFieldFocus('department')}
                            onBlur={() => setFocusedField(null)}
                        />
                        {errors.department && <span className='text-red-500'>Department is required</span>}
                        {focusedField === 'department' && (
                            <ul className="absolute bg-white border border-gray-300 rounded mt-1 w-full z-10">
                                {filteredDepartmentSuggestions.map((dep, idx) => (
                                    <li
                                        key={idx}
                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                        onMouseDown={() => handleSuggestionSelect('department', dep)}
                                    >
                                        {dep}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Additional Info Field */}
                    <div className="mb-4">
                        <textarea
                            {...register('additionalInfo')}
                            className="border-2 border-gray-400 focus:border-customColor outline-none rounded p-3 w-full bg-transparent"
                            placeholder="Enter additional information"
                        />
                    </div>

                    {/* Category Input */}
                    <div className="mb-4 relative">
                        <input
                            type="text"
                            {...register('category', { required: true })}
                            className="w-full border-2 border-gray-500 outline-none focus:border-customColor p-3 bg-transparent rounded"
                            placeholder="Category"
                            onFocus={() => handleFieldFocus('category')}
                            onBlur={() => setFocusedField(null)}
                        />
                        {errors.category && <span className="text-red-500">Category is required</span>}
                        {focusedField === 'category' && (
                            <ul className="absolute bg-white border border-gray-300 rounded mt-1 w-full z-10">
                                {filteredCategorySuggestions.map((cat, idx) => (
                                    <li
                                        key={idx}
                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                        onMouseDown={() => handleSuggestionSelect('category', cat)}
                                    >
                                        {cat}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Brand Input */}
                    <div className="mb-4 relative">
                        <input
                            type="text"
                            {...register('brand', { required: true })} // Changed from brandName to brand
                            className="w-full border-2 border-gray-500 outline-none focus:border-customColor p-3 bg-transparent rounded"
                            placeholder="Brand"
                            onFocus={() => handleFieldFocus('brand')} // Changed from brandName to brand
                            onBlur={() => setFocusedField(null)}
                        />
                        {errors.brand && <span className="text-red-500">Brand is required</span>}
                        {focusedField === 'brand' && ( // Changed from brandName to brand
                            <ul className="absolute bg-white border border-gray-300 rounded mt-1 w-full z-10">
                                {filteredBrandSuggestions.map((brand, idx) => (
                                    <li
                                        key={idx}
                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                        onMouseDown={() => handleSuggestionSelect('brand', brand)} // Changed from brandName to brand
                                    >
                                        {brand}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Product Input */}
                    <div className="mb-4 relative">
                        <input
                            type="text"
                            {...register('productName', { required: true })}
                            className="w-full border-2 border-gray-500 outline-none focus:border-customColor p-3 bg-transparent rounded"
                            placeholder="Product Name"
                            onFocus={() => handleFieldFocus('productName')}
                            onBlur={() => setFocusedField(null)}
                        />
                        {errors.productName && <span className="text-red-500">Product Name is required</span>}
                        {focusedField === 'productName' && (
                            <ul className="absolute bg-white border border-gray-300 rounded mt-1 w-full z-10">
                                {filteredProductSuggestions.map((product, idx) => (
                                    <li
                                        key={idx}
                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                        onMouseDown={() => handleSuggestionSelect('productName', product)}
                                    >
                                        {product}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Serial No Input */}
                    <div className="mb-4">
                        <div className="flex relative space-x-4 w-full border-2 outline-none border-gray-500 focus:border-customColor p-3 mb-1 bg-transparent rounded">
                            <input
                                type="text"
                                {...register('serialNo', { required: false })}
                                className="w-full mb-1 bg-transparent outline-none"
                                placeholder="Serial Number"
                            />
                            <button
                                type="button"
                                className="absolute right-3 text-customColor text-xs"
                                onClick={() => setScanningIndex(0)}
                            >
                                <Camera />
                                <span>Scan</span>
                            </button>
                        </div>
                    </div>

                    {scanningIndex !== null && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white text-black p-4 rounded-lg">
                                <div id="reader" style={{ width: '300px' }}></div>
                                <button
                                    className="bg-red-500 text-white mt-4 px-4 py-2 rounded"
                                    onClick={() => setScanningIndex(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center mt-4">
                        <button type="submit" className="bg-customColor text-white px-4 py-2 rounded-md">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewCustomerForm;
