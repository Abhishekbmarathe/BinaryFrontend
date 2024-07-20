import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import getAllcustomers from '../modules/getAllcustomers';
import axios from 'axios';

function CustomerEdit() {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const allCustomers = JSON.parse(localStorage.getItem("AllClients"));
        if (allCustomers) {
            const foundCustomer = allCustomers.find(c => c._id === customerId);
            setCustomer(foundCustomer || {});
        }
    }, [customerId]);

    const handleChange = (e, index = null, field = null) => {
        const { name, value, type, checked } = e.target;
        if (index !== null && field) {
            const updatedContacts = [...customer.contacts];
            updatedContacts[index] = {
                ...updatedContacts[index],
                [field]: value,
            };
            setCustomer({
                ...customer,
                contacts: updatedContacts,
            });
        } else {
            setCustomer({
                ...customer,
                [name]: type === 'checkbox' ? checked : value,
            });
        }
    };

    const handleSave = async () => {

        const allCustomers = JSON.parse(localStorage.getItem("AllClients"));
        let c = confirm("Are you sure to update the chamges ?")
        if (c) {
            setLoading(true);
            try {
                const response = await axios.post('https://binarysystemsbackend-mtt8.onrender.com/api/updateClient', {
                    id: customerId,
                    ...customer
                });

                if (response.status === 200) {
                    alert('Updated customer details:', customer);
                    navigate(`/customer/${customerId}`); // Navigate back to the customer detail page after saving
                    // getAllcustomers();
                    window.location.reload()
                } else {
                    alert('Failed to update customer details');
                }
            } catch (error) {
                alert('Error:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    if (!customer) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 sm:max-w-[50vw]">
            {loading ? (
                <div className="flex justify-center items-center gap-3">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-dotted rounded-full" role="status">
                    </div>
                    <span className="breathing">Loading...</span>
                </div>
            ) : (
                <div className="shadow-md rounded-lg overflow-hidden mb-4 p-4">
                    <h2 className="text-xl mb-4">Edit Customer</h2>
                    <div className="mb-4">
                        <label htmlFor="companyName" className="block mb-2">Company Name</label>

                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={customer.companyName || ''}
                            onChange={handleChange}
                            className="w-full border p-2 mb-4 bg-transparent"
                            placeholder="Company Name"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={customer.email || ''}
                            onChange={handleChange}
                            className="w-full border p-2 mb-4 bg-transparent"
                            placeholder="Email"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="web" className="block mb-2">Website</label>
                        <input
                            type="text"
                            id="web"
                            name="web"
                            value={customer.web || ''}
                            onChange={handleChange}
                            className="w-full border p-2 mb-4 bg-transparent"
                            placeholder="Website"
                        />
                    </div>
                    {/* Add more fields as necessary */}
                    {customer.contacts && customer.contacts.map((contact, index) => (
                        <div key={index} className="mb-4">
                            <div className="mb-2">
                                <label htmlFor={`contactName_${index}`} className="block mb-2">Contact Name</label>
                                <input
                                    type="text"
                                    id={`contactName_${index}`}
                                    name={`contactName_${index}`}
                                    value={contact.name}
                                    onChange={(e) => handleChange(e, index, 'name')}
                                    className="w-full border p-2 mb-2 bg-transparent"
                                    placeholder="Contact Name"
                                />
                            </div>
                            <div>
                                <label htmlFor={`contactNumber_${index}`} className="block mb-2">Contact Number</label>
                                <input
                                    type="text"
                                    id={`contactNumber_${index}`}
                                    name={`contactNumber_${index}`}
                                    value={contact.number}
                                    onChange={(e) => handleChange(e, index, 'number')}
                                    className="w-full border p-2 bg-transparent"
                                    placeholder="Contact Number"
                                />
                            </div>
                        </div>
                    ))}
                    <button onClick={handleSave} className="bg-slate-200 font-bold text-black px-4 py-2 rounded w-full">
                        UPDATE
                    </button>
                </div>
            )}
        </div>
    );
}

export default CustomerEdit;
