// NewCustomerForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function NewCustomerForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const { companyName, customerId } = location.state || {};

    console.log(customerId)
    const onSubmit = async (data) => {
        console.log(data);
        try {
            const response = await axios.post('https://binarysystemsbackend-mtt8.onrender.com/api/createClientAsset', data);
            console.log(response.data);
            alert("Asset created successfullyc")
            navigate(`/customer/${customerId}`); // Navigate back to the customer list after creating the new customer
            window.location.reload();
        } catch (error) {
            console.error('There was an error creating the client asset!', error);
            alert('There was an error creating the client asset!', error)

        }
    };

    return (
        <div className="max-w-md mx-auto mt-2 sm:max-w-[50vw]">
            <div className="shadow-md rounded-lg overflow-hidden mb-4 p-4">
                <h2 className="text-2xl mb-7 font-bold m-auto w-fit">Add <span className='text-customColor'>Client Asset</span></h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <input
                            type="text"
                            {...register('companyName', { required: true })}
                            className="w-full border p-3 mb-1 bg-transparent rounded-xl"
                            value={companyName}
                            contentEditable="false"
                            hidden="true"
                        />
                        {/* {errors.category && <span className="text-red-500">Category is required</span>} */}
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            {...register('category', { required: true })}
                            className="w-full border p-3 mb-1 bg-transparent rounded-xl"
                            placeholder="Category"
                        />
                        {errors.category && <span className="text-red-500">Category is required</span>}
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            {...register('brand', { required: true })}
                            className="w-full border p-3 mb-1 bg-transparent rounded-xl"
                            placeholder="Brand Name"
                        />
                        {errors.brand && <span className="text-red-500">Brand Name is required</span>}
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            {...register('productName', { required: true })}
                            className="w-full border p-3 mb-1 bg-transparent rounded-xl"
                            placeholder="Product Name"
                        />
                        {errors.productName && <span className="text-red-500">Product Name is required</span>}
                    </div>
                    <button type="submit" className="bg-slate-300 text-blue-600 font-bold w-full mt-[60%] px-4 py-2 rounded-xl">
                        CREATE
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NewCustomerForm;
