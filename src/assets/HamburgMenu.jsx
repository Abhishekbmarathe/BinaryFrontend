import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, createContext } from 'react';
import Edit from '../assets/Edit';
import Info from '../assets/info';
import User from '../assets/User';

const HamburgMenu = () => {
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

    const handlePrivateData = () => {
        navigate('/customer/private-data', { state: { customerId: customerId, companyName: customer?.companyName } });
    };
    const handleCompanyassign = () => {
        navigate('/customer/companyAssign', { state: { companyName: customer?.companyName } });
    }
    return (
        <div className='flex md:items-center gap-5 flex-col  md:flex-row absolute md:static top-12 right-0 shadow-customShadow md:shadow-none bg-gray-100 z-10 p-3 md:p-0'>
            <button onClick={handleEdit} className="flex items-center gap-1">
                <div className='scale-[1.5]'>
                </div>
                <Edit color="rgb(0 197 255)" size={21} /> <span>Edit Company</span>
            </button>
            <button onClick={handlePrivateData} className=' flex items-center gap-1'>
                <div>
                </div>
                <Info color="rgb(0 197 255)" size={21} /><span>Global data</span>
            </button>
            <button onClick={handleCompanyassign} className="flex items-center gap-1">
                <div className='scale-[1.5]'>
                </div>
                <User color="rgb(0 197 255)" size={21} /><span>Company Permission</span>
            </button>
        </div>
    )
}

export default HamburgMenu
