import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CustomerDetail() {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const allCustomers = JSON.parse(localStorage.getItem("AllClients"));
        if (allCustomers) {
            const foundCustomer = allCustomers.find(c => c._id === customerId);
            setCustomer(foundCustomer || {});
        }
    }, [customerId]);

    const handleEdit = () => {
        navigate(`/customer/edit/${customerId}`);
    };

    if (!customer) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 sm:max-w-[50vw]">
            <div className="shadow-md rounded-lg overflow-hidden mb-4 p-4">
                <h2 className="text-xl mb-4">Customer Details</h2>
                <div className="mb-4">
                    <label className="block mb-2">Company Name</label>
                    <p className="w-full border p-2 bg-transparent">{customer.companyName}</p>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <p className="w-full border p-2 bg-transparent">{customer.email}</p>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Website</label>
                    <p className="w-full border p-2 bg-transparent">{customer.web}</p>
                </div>
                <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Edit
                </button>
            </div>
        </div>
    );
}

export default CustomerDetail;
