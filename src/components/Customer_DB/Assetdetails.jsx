import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import BottomMenu from './BottomMenu';
import Camera from '../../assets/camera';

function AssetDetails() {
    const { state } = useLocation();
    const { productName, brand, category, _id, serialNo = [] } = state || {};
    const navigate = useNavigate();

    const { register, handleSubmit, control, formState: { errors }, reset, getValues } = useForm({
        defaultValues: {
            productName,
            brand,
            category,
            serialNo,
            _id
        }
    });

    localStorage.setItem("assetId", _id);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "serialNo"
    });

    const [scanningIndex, setScanningIndex] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const scannerRef = useRef(null);

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

    const handleUpdate = async (data) => {
        // Rename _id to id and convert serialNo to an array of values
        const updatedData = {
            ...data,
            id: _id,
            serialNo: data.serialNo.map(item => item.value) // Convert serialNo to an array of values
        };
        delete updatedData._id; // Remove _id if present

        try {
            await axios.post('https://binarysystemsbackend-mtt8.onrender.com/api/updateClientAsset', updatedData);
            alert('Asset updated successfully');
            navigate(-1);
        } catch (error) {
            console.error('There was an error updating the asset!', error);
            alert('There was an error updating the asset!');
        }
    };

    const handleDelete = async (data) => {
        if (confirm("Are you sure you want to delete this asset?")) {
            try {
                // Sending the id in the request body as per backend requirements
                await axios.post('https://binarysystemsbackend-mtt8.onrender.com/api/deleteClientAsset', { id: data.id });
                alert('Asset deleted successfully');
                navigate(-1);
            } catch (error) {
                console.error('There was an error deleting the asset!', error);
                alert('There was an error deleting the asset!');
            }
        }
    };


    const handleBack = () => {
        navigate(-1);
    };

    const handleBarcodeScan = (decodedText, decodedResult) => {
        if (decodedText) {
            const updatedFields = [...fields];
            updatedFields[scanningIndex].value = decodedText;
            reset({ ...getValues(), serialNo: updatedFields });
            setScanningIndex(null);
        }
    };

    const handleError = (error) => {
        console.error("Error scanning barcode: ", error);
    };

    if (!productName || !brand || !category) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-3 sm:max-w-[50vw]">
            <BottomMenu />
            <div className="shadow-md rounded-lg overflow-hidden mb-4 p-4">
                <h2 className="text-3xl mb-4 font-bold m-auto w-fit">Update <span className='text-customColor'>Asset</span></h2>
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <input type="hidden" {...register("id")} value={_id} /> {/* Hidden field for ID */}

                    <div className="mb-4">
                        <label className="block mb-1">Category</label>
                        <input
                            type="text"
                            {...register("category", { required: true })}
                            className="w-full border p-3 rounded-xl mb-1 bg-transparent"
                        />
                        {errors.category && <span className="text-red-500">Category is required</span>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Brand Name</label>
                        <input
                            type="text"
                            {...register("brand", { required: true })}
                            className="w-full border p-3 rounded-xl mb-1 bg-transparent"
                        />
                        {errors.brand && <span className="text-red-500">Brand is required</span>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Product Name</label>
                        <input
                            type="text"
                            {...register("productName", { required: true })}
                            className="w-full border p-3 rounded-xl mb-1 bg-transparent"
                        />
                        {errors.productName && <span className="text-red-500">Product Name is required</span>}
                    </div>

                    <div className="mt-4">
                        <div className='flex justify-between items-center mb-5'>
                            <h3 className="text-lg font-bold">Serial Numbers</h3>
                            <button
                                type="button"
                                className="bg-transparent text-customColor px-3 py-1 rounded"
                                onClick={() => append({ value: "" })} // Pass an object to append
                            >
                                <span className='font-bold'>+</span> Add
                            </button>
                        </div>
                        <ul className='w-[90%] m-auto'>
                            {fields.map((field, index) => (
                                <li key={field.id} className="flex relative mb-2">
                                    <input
                                        type="text"
                                        {...register(`serialNo.${index}.value`, { required: false })} // Use .value for nested structure
                                        className="w-full border-b p-2 mb-1 bg-transparent outline-none"
                                        placeholder='Serial Number'
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-0 text-customColor text-xs"
                                        onClick={() => setScanningIndex(index)}
                                    >
                                        <Camera />
                                        <span>Scan</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button type="submit" className="bg-slate-200 text-purple-600 font-bold w-full mt-16 px-4 py-2 rounded-xl">
                        UPDATE
                    </button>
                    <button
                        type="button"
                        className="bg-slate-200 text-red-500 font-bold mt-3 px-4 py-2 rounded-xl"
                        onClick={handleSubmit(handleDelete)}
                    >
                        DELETE
                    </button>
                </form>

                {/* <button
                    className="bg-gray-300 text-gray-700 font-bold w-full mt-4 px-4 py-2 rounded mb-16"
                    onClick={handleBack}
                >
                    BACK
                </button> */}
            </div>

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
    );
}

export default AssetDetails;
