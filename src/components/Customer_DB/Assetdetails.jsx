import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import BottomMenu from './BottomMenu';
import Camera from '../../assets/camera';

function AssetDetails() {
    const { state } = useLocation();
    const { productName, brand, category, _id, serialNo = [] } = state || {}; // Ensure _id and serialNo are passed to the state
    const navigate = useNavigate();

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        defaultValues: {
            productName,
            brand,
            category,
            serialNo
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "serialNo"
    });

    const handleUpdate = async (data) => {
        try {
            await axios.post('https://binarysystemsbackend-mtt8.onrender.com/api/updateClientAsset', {
                _id,
                ...data
            });
            alert('Asset updated successfully');
            navigate(-1); // Navigate back to the previous page
        } catch (error) {
            console.error('There was an error updating the asset!', error);
            alert('There was an error updating the asset!');
        }
    };

    const handleBack = () => {
        navigate(-1); // Navigate back to the previous page
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
                                        // onClick={() => remove(index)}
                                    >
                                        <Camera />
                                        <span>Scan</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button type="submit" className="bg-slate-200 text-purple-600 font-bold w-full mt-16 px-4 py-2 rounded">
                        UPDATE
                    </button>
                </form>

                <button
                    className="bg-gray-300 text-gray-700 font-bold w-full mt-4 px-4 py-2 rounded mb-16"
                    onClick={handleBack}
                >
                    BACK
                </button>
            </div>
        </div>
    );
}

export default AssetDetails;
