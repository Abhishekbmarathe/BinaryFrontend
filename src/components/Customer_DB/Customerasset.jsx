import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import api from '../modules/Api';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode'; // Barcode scanning imports
import Camera from '../../assets/camera';

function NewCustomerForm() {
    const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const { companyName, customerId } = location.state || {};
    
    const [scanningIndex, setScanningIndex] = useState(null);
    const scannerRef = useRef(null);

    // Barcode scanning setup
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

    // Submit function to create a new customer asset
    const onSubmit = async (data) => {
        console.log(data);
        try {
            const response = await axios.post(api + 'api/updateClientAsset', data);
            console.log(response.data);
            alert('Asset created successfully');
            navigate(`/customer/${customerId}`); // Navigate back to the customer list after creating the asset
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
                    <div className='mb-4'>
                        <input
                            {...register('location', { required: true })}
                            className='border-2 border-gray-400 focus:border-customColor outline-none rounded p-3 w-full bg-transparent'
                            placeholder='Enter location'
                        />
                        {errors.location && <span className='text-red-500'>Location is required</span>}
                    </div>
                    <div className='mb-4'>
                        <input
                            {...register('department', { required: true })}
                            className='border-2 border-gray-400 focus:border-customColor outline-none rounded p-3 w-full bg-transparent'
                            placeholder='Enter department'
                        />
                        {errors.department && <span className='text-red-500'>Department is required</span>}
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            {...register('category', { required: true })}
                            className="w-full border-2 border-gray-500 outline-none focus:border-customColor p-3 mb-1 bg-transparent rounded"
                            placeholder="Category"
                        />
                        {errors.category && <span className="text-red-500">Category is required</span>}
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            {...register('brand', { required: true })}
                            className="w-full border-2 outline-none border-gray-500 focus:border-customColor p-3 mb-1 bg-transparent rounded"
                            placeholder="Brand Name"
                        />
                        {errors.brand && <span className="text-red-500">Brand Name is required</span>}
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            {...register('productName', { required: true })}
                            className="w-full border-2 outline-none border-gray-500 focus:border-customColor p-3 mb-1 bg-transparent rounded"
                            placeholder="Product Name"
                        />
                        {errors.productName && <span className="text-red-500">Product Name is required</span>}
                    </div>

                    {/* Serial Number Field with Barcode Scanning */}
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

                    {/* Additional Info Textarea */}
                    <div className="mb-4">
                        <textarea
                            {...register('additionalData', { required: false })}
                            className="w-full border-2 outline-none border-gray-500 focus:border-customColor p-3 bg-transparent rounded"
                            placeholder="Additional Info (optional)"
                        />
                    </div>

                    {/* Barcode scanner overlay */}
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

                    <button
                        type="submit"
                        className="bg-slate-300 text-blue-600 font-bold w-full mt-[20%] px-4 py-2 rounded-xl"
                    >
                        Save  
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NewCustomerForm;
