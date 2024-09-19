import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import BottomMenu from './BottomMenu';
import Camera from '../../assets/camera';
import api from '../modules/Api';

function AssetUpdate() {
    const { state } = useLocation();
    const { productName, brand, category, _id, location, department, serialNo = '', additionalData = '' } = state || {};
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm({
        defaultValues: {
            productName,
            brand,
            category,
            location,
            department,
            serialNo,
            additionalData,
            _id
        }
    });
    localStorage.setItem("assetId", _id);
    console.log(productName, brand, category, _id, location, department, serialNo, additionalData);

    const [scanningIndex, setScanningIndex] = useState(null);
    const scannerRef = useRef(null);

    // QR code scanner setup
    useEffect(() => {
        if (scanningIndex !== null) {
            scannerRef.current = new Html5QrcodeScanner(
                "reader",
                {
                    fps: 10,
                    qrbox: 250,
                    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE, Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.CODE_39]
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

    const handleBarcodeScan = (decodedText, decodedResult) => {
        if (decodedText) {
            reset({ ...getValues(), serialNo: decodedText });
            setScanningIndex(null);
        }
    };

    const handleError = (error) => {
        console.error("Error scanning barcode: ", error);
    };

    // Update asset details
    const handleUpdate = async (data) => {
        const updatedData = {
            ...data,
            id: _id,
        };
        delete updatedData._id;

        try {
            await axios.post(api + 'api/updateClientAsset', updatedData);
            alert('Asset updated successfully');
            navigate(-1);
        } catch (error) {
            console.error('Error updating the asset', error);
            alert('There was an error updating the asset!');
        }
    };

    // Delete asset
    const handleDelete = async (data) => {
        if (confirm("Are you sure you want to delete this asset?")) {
            try {
                await axios.post(api + 'api/deleteClientAsset', { id: data.id });
                alert('Asset deleted successfully');
                navigate(-1);
            } catch (error) {
                console.error('Error deleting the asset', error);
                alert('There was an error deleting the asset!');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-3 sm:max-w-[50vw]">
            <BottomMenu />
            <div className="shadow-md rounded-lg overflow-hidden mb-4 p-4">
                <h2 className="text-3xl mb-4 font-bold m-auto w-fit">Update <span className='text-customColor'>Asset</span></h2>
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <input type="hidden" {...register("id")} value={_id} />

                    {/* Location Field */}
                    <div className='mb-4'>
                        <input
                            {...register('location', { required: true })}
                            className='border-2 border-gray-400 focus:border-customColor outline-none rounded p-3 w-full bg-transparent'
                            placeholder="Location"
                        />
                        {errors.location && <span className='text-red-500'>Location is required</span>}
                    </div>

                    {/* Department Field */}
                    <div className='mb-4'>
                        <input
                            {...register('department', { required: true })}
                            className='border-2 border-gray-400 focus:border-customColor outline-none rounded p-3 w-full bg-transparent'
                            placeholder="Department"
                        />
                        {errors.department && <span className='text-red-500'>Department is required</span>}
                    </div>

                    {/* Category Field */}
                    <div className="mb-4">
                        <label className="block mb-1">Category</label>
                        <input
                            type="text"
                            {...register("category", { required: true })}
                            className="w-full border p-3 rounded-xl mb-1 bg-transparent"
                        />
                        {errors.category && <span className="text-red-500">Category is required</span>}
                    </div>

                    {/* Brand Field */}
                    <div className="mb-4">
                        <label className="block mb-1">Brand Name</label>
                        <input
                            type="text"
                            {...register("brand", { required: true })}
                            className="w-full border p-3 rounded-xl mb-1 bg-transparent"
                        />
                        {errors.brand && <span className="text-red-500">Brand is required</span>}
                    </div>

                    {/* Product Name Field */}
                    <div className="mb-4">
                        <label className="block mb-1">Product Name</label>
                        <input
                            type="text"
                            {...register("productName", { required: true })}
                            className="w-full border p-3 rounded-xl mb-1 bg-transparent"
                        />
                        {errors.productName && <span className="text-red-500">Product Name is required</span>}
                    </div>

                    {/* Serial Number Field */}
                    <div className="mb-4">
                        <label className="block mb-1">Serial Number</label>
                        <div className="flex relative">
                            <input
                                type="text"
                                {...register("serialNo", { required: false })}
                                className="w-full border p-3 rounded-xl mb-1 bg-transparent outline-none"
                                placeholder='Serial Number'
                            />
                            <button
                                type="button"
                                className="absolute right-0 text-customColor text-xs"
                                onClick={() => setScanningIndex(0)}
                            >
                                <Camera />
                                <span>Scan</span>
                            </button>
                        </div>
                    </div>

                    {/* Additional Info Field */}
                    <div className="mb-4">
                        <label className="block mb-1">Additional Info</label>
                        <input
                            type="text"
                            {...register("additionalData", { required: false })}
                            className="w-full border p-3 rounded-xl mb-1 bg-transparent"
                            placeholder="Additional Info"
                        />
                    </div>

                    {/* Update and Delete Buttons */}
                    <button type="submit" className="bg-slate-200 text-purple-600 font-bold w-full mt-10 px-4 py-2 rounded-xl">
                        UPDATE
                    </button>
                    <button
                        type="button"
                        className="bg-slate-200 text-red-500 font-bold mt-3 mb-16 px-4 py-2 rounded-xl"
                        onClick={handleSubmit(handleDelete)}
                    >
                        DELETE
                    </button>
                </form>

                {scanningIndex !== null && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white text-black p-4 rounded-lg">
                            <div id="reader" style={{ width: "300px" }}></div>
                            <button
                                className="bg-red-500 text-white mt-4 px-4 py-2 rounded"
                                onClick={() => setScanningIndex(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AssetUpdate;
