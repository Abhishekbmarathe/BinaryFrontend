import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function customerProfile() {
    const [allcustomers, setAllcustomers] = useState([]);
    const [editablecustomer, setEditablecustomer] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const customerDetails = JSON.parse(localStorage.getItem("AllClients"));
        if (customerDetails) {
            setAllcustomers(customerDetails);
            setEditablecustomer(customerDetails[0] || {});
        }
    }, []);

    const handleSave = () => {
        const updatedcustomers = allcustomers.map(customer =>
            customer._id === editablecustomer._id ? editablecustomer : customer
        );
        localStorage.setItem("getAllcustomers", JSON.stringify(updatedcustomers));
        console.log('Saved customer details:', editablecustomer);
    };

    const handleExpand = (customerId) => {
        navigate(`/customer/${customerId}`);
    };

    if (!allcustomers.length) {
        return <div>Loading...</div>;
    }

    return (
            <div className="max-w-md mx-auto mt-10 sm:max-w-[50vw]">
                {allcustomers.map((customer, index) => (
                    <div key={index} className="border-customColor bg-cyan-50 border rounded-lg overflow-hidden mb-4">
                        <div
                            className=" w-[90vw] sm:max-w-full rounded-[8px] p-4 cursor-pointer flex gap-4 items-center"
                            onClick={() => handleExpand(customer._id)}
                        >
                            <span>{customer.companyName}</span>
                        </div>
                    </div>
                ))}
            </div>
    );
}

export default customerProfile;
