// NewCustomerForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function NewCustomerForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        const allCustomers = JSON.parse(localStorage.getItem("AllClients")) || [];
        const newCustomer = {
            _id: new Date().getTime().toString(),
            ...data
        };
        allCustomers.push(newCustomer);
        localStorage.setItem("AllClients", JSON.stringify(allCustomers));
        navigate('/customers'); // Navigate back to the customer list after creating the new customer
    };

    return (
        <div className="max-w-md mx-auto mt-10 sm:max-w-[50vw]">
            <div className="shadow-md rounded-lg overflow-hidden mb-4 p-4">
                <h2 className="text-xl mb-4 font-bold">Add Client Asset</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <input
                            type="text"
                            {...register('category', { required: true })}
                            className="w-full border p-2 mb-1 bg-transparent"
                            placeholder="Category"
                        />
                        {errors.category && <span className="text-red-500">Category is required</span>}
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            {...register('brandName', { required: true })}
                            className="w-full border p-2 mb-1 bg-transparent"
                            placeholder="Brand Name"
                        />
                        {errors.brandName && <span className="text-red-500">Brand Name is required</span>}
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            {...register('productName', { required: true })}
                            className="w-full border p-2 mb-1 bg-transparent"
                            placeholder="Product Name"
                        />
                        {errors.productName && <span className="text-red-500">Product Name is required</span>}
                    </div>
                    <button type="submit"  className="bg-slate-200 text-purple-600 font-bold w-full mt-16 px-4 py-2 rounded">
                        CREATE
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NewCustomerForm;
