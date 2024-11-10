import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../modules/Api';
import Delete from '../../assets/Delete';
import useAdminStatus from '../modules/IsAdmin';

function CustomerEdit() {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [branches, setBranches] = useState([]);
    const isAdmin = useAdminStatus();
    const [creator, setCreator] = useState(JSON.parse(localStorage.getItem('userDet')).username);

    useEffect(() => {
        const allCustomers = JSON.parse(localStorage.getItem("AllClients"));
        if (allCustomers) {
            const foundCustomer = allCustomers.find(c => c._id === customerId);
            setCustomer(foundCustomer || {});
            if (foundCustomer) {
                const allClientbranches = JSON.parse(localStorage.getItem("Clientbranches"));
                if (allClientbranches) {
                    const foundClientBranches = allClientbranches.filter(branch => branch.companyName === foundCustomer.companyName);
                    setBranches(foundClientBranches);
                }
            }
        }
    }, [customerId]);

    const handleChange = (e, index = null, field = null) => {
        const { name, value, type, checked } = e.target;
        if (index !== null && field) {
            const updatedContacts = [...customer.contacts];
            updatedContacts[index] = { ...updatedContacts[index], [field]: value };
            setCustomer({ ...customer, contacts: updatedContacts });
        } else {
            setCustomer({ ...customer, [name]: type === 'checkbox' ? checked : value });
        }
    };

    const handleUpdate = async () => {
        if (confirm("Are you sure to update the changes?")) {
            setLoading(true);
            try {
                const response = await axios.post(`${api}api/updateClient`, {
                    id: customerId,
                    ...customer
                }, {
                    headers: { 'Content-Type': 'application/json', 'updatedby': creator }
                });

                if (response.status === 200) {
                    alert('Updated customer details successfully');
                    await handleBranchUpdate();
                    navigate(-1);
                } else {
                    alert('Failed to update customer details');
                }
            } catch (error) {
                alert('Error: ' + error.message);
                console.error('Update error:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleBranchUpdate = async () => {
        try {
            const response = await axios.post(`${api}api/updateClientbranches`, {
                companyName: customer.companyName,
                newData: branches
            });
            if (response.status === 200) {
                alert('Branches updated successfully');
            } else {
                alert('Failed to update branches');
            }
        } catch (error) {
            alert('Error updating branches: ' + error.message);
            console.error('Branch update error:', error);
        }
    };

    const handleAddBranch = () => {
        setBranches([...branches, { companyName: customer.companyName, location: '', department: '' }]);
    };

    const handleBranchChange = (index, event) => {
        const newBranches = [...branches];
        newBranches[index][event.target.name] = event.target.value;
        setBranches(newBranches);
    };

    const handleRemoveBranch = (index) => {
        setBranches(branches.filter((_, i) => i !== index));
    };

    const companyDelete = async (companyName) => {
        const confirmation = `Delete Company ${companyName}`;
        const userConfirmation = prompt(`Are you sure to delete? This will delete the entire company details including its assets, images, and private data. Please type "${confirmation}"`);

        if (userConfirmation === confirmation) {
            try {
                const response = await axios.post(`${api}api/deleteClient`, { companyName }, {
                    headers: { 'Content-Type': 'application/json', 'updatedby': creator }
                });
                alert('Company deleted successfully');
                navigate(-2);
            } catch (error) {
                console.error('Error deleting company:', error);
                alert('Failed to delete company');
            }
        } else {
            alert("Confirmation text does not match");
        }
    };

    if (!customer) return <div>Loading...</div>;

    return (
        <div className="max-w-md mx-auto mt-2 sm:max-w-[50vw]">
            {loading ? (
                <div className="flex justify-center items-center gap-3">
                    <div className="spinner-border animate-spin w-8 h-8 border-4 border-dotted rounded-full"></div>
                    <span>Loading...</span>
                </div>
            ) : (
                <div className="rounded-lg p-4">
                    <div className='flex items-center justify-between mb-5'>
                        <h2 className="text-3xl font-semibold">Edit <span className='text-customColor'>Company</span></h2>
                        {isAdmin && (
                            <button onClick={() => companyDelete(customer.companyName)}>
                                <Delete />
                            </button>
                        )}
                    </div>
                    {step === 1 ? (
                        <div>
                            {/* Company and Contact Info */}
                            {/* Similar Code as Before */}
                            <div>
                                <div className="mb-4">
                                    <label htmlFor="companyName" className="block font-medium mb-2">Company Name:</label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        name="companyName"
                                        value={customer.companyName || ''}
                                        onChange={handleChange}
                                        className="w-full border-2 p-3 mb-4 bg-transparent outline-none hover:border-customColor rounded border-gray-400"
                                        placeholder="Company Name"
                                        readOnly={true}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block font-medium mb-2">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={customer.email || ''}
                                        onChange={handleChange}
                                        className="w-full border-2 p-3 mb-4 bg-transparent outline-none hover:border-customColor rounded border-gray-400"
                                        placeholder="Email"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="web" className="block font-medium mb-2">Website:</label>
                                    <input
                                        type="text"
                                        id="web"
                                        name="web"
                                        value={customer.web || ''}
                                        onChange={handleChange}
                                        className="w-full border-2 p-3 mb-4 bg-transparent outline-none hover:border-customColor rounded border-gray-400"
                                        placeholder="Website"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="address" className="block font-medium mb-2">Address:</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={customer.address || ''}
                                        onChange={handleChange}
                                        className="w-full border-2 p-3 mb-4 bg-transparent outline-none hover:border-customColor rounded border-gray-400"
                                        placeholder="Address"
                                    />
                                </div>
                                {customer.contacts && customer.contacts.map((contact, index) => (
                                    <div key={index} className="mb-4">
                                        <label className='block font-medium mb-2 text-customColor text-xl'>Contact Details</label>
                                        <div className='flex gap-2'>
                                            <div className="mb-2">
                                                <label htmlFor={`contactName_${index}`} className="block font-medium mb-2">Contact Name</label>
                                                <input
                                                    type="text"
                                                    id={`contactName_${index}`}
                                                    name={`contactName_${index}`}
                                                    value={contact.name}
                                                    onChange={(e) => handleChange(e, index, 'name')}
                                                    className="w-full border-2 p-3 mb-2 bg-transparent outline-none hover:border-customColor rounded border-gray-400"
                                                    placeholder="Contact Name"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`contactNumber_${index}`} className="block font-medium mb-2">Contact Number</label>
                                                <input
                                                    type="text"
                                                    id={`contactNumber_${index}`}
                                                    name={`contactNumber_${index}`}
                                                    value={contact.number}
                                                    onChange={(e) => handleChange(e, index, 'number')}
                                                    className="w-full border-2 p-3 bg-transparent outline-none hover:border-customColor rounded border-gray-400"
                                                    placeholder="Contact Number"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* <button onClick={() => setStep(2)} className="text-white rounded-md bg-blue-400 mb-3 px-4 py-1 shadow-md shadow-gray-400">
                                    Next
                                </button> */}
                            </div>
                            <button onClick={() => setStep(2)} className="text-white bg-blue-400 mb-3 px-4 py-1">Next</button>
                        </div>
                    ) : (
                        <div>
                            <div className='text-customColor flex justify-between cursor-pointer'>
                                <label>Sub Branches</label>
                                <span onClick={handleAddBranch}>+ Add</span>
                            </div>
                            {branches.map((branch, index) => (
                                <div key={index} className='mt-4 flex'>
                                    <input
                                        type='text'
                                        name='location'
                                        placeholder='Location'
                                        value={branch.location}
                                        onChange={(e) => handleBranchChange(index, e)}
                                        className='mr-2 p-2 border rounded bg-transparent border-gray-400 w-full'
                                    />
                                    <input
                                        type='text'
                                        name='department'
                                        placeholder='Department'
                                        value={branch.department}
                                        onChange={(e) => handleBranchChange(index, e)}
                                        className='mr-2 p-2 border rounded bg-transparent border-gray-400 w-full'
                                    />
                                    <button onClick={() => handleRemoveBranch(index)} className='p-1'>
                                        <Delete color='red' />
                                    </button>
                                </div>
                            ))}
                            <div className="mt-4">
                                <button onClick={() => setStep(1)} className="text-white bg-blue-400 mb-3 px-4 py-1 mr-3">Previous</button>
                                <button onClick={handleUpdate} className="text-white bg-blue-400 mb-3 px-4 py-1">Save</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CustomerEdit;
