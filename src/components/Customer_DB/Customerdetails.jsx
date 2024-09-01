// CustomerDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Allassets from './Allassets'
import Edit from '../../assets/Edit'
import Company from '../../assets/Companyicon'
import Link from '../../assets/Link'
import Email from '../../assets/Email'

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

    const handleNewCustomer = () => {
        navigate('/customer/new', { state: { companyName: customer?.companyName, customerId: customerId } });
    };

    const home = () => {
        navigate('/Server/Home')
        navigator.vibrate(60);
    };

    if (!customer) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-0 sm:max-w-[50vw]">
            <div className=" rounded-lg overflow-hidden mb-4 p-4">
                <div className='flex justify-between'>
                    <h2 className="text-2xl mb-4 items-center w-fit font-bold ">Customer <span className='text-customColor'>Details</span></h2>
                    <button onClick={handleEdit} className="scale-[1.5]">
                        <Edit />
                    </button>
                </div>
                <div className='w-fit scale-[3.5] my-8 m-auto'>
                    <Company />
                </div>

                <div className="mb-4 flex flex-col items-center">
                    <p className="">{customer.companyName}</p>
                    <div className='flex'>
                        <Link />
                        <p className="">{customer.email}</p>
                    </div>
                    <div className='flex'>
                        <Email />
                        <p className="">{customer.web}</p>
                    </div>
                </div>
                <h1 className='text-customColor text-xl'>Assets</h1>
            </div>
            <Allassets companyName={customer?.companyName} />

            <button
                className='bg-slate-400 py-2 px-3 rounded-xl my-9 fixed bottom-0 right-8 flex justify-between w-20 items-center'
                onClick={handleNewCustomer}
            >
                <span className='text-white text-xl font-bold'>+</span> New
            </button>
            <div className='fixed md:hidden /bg-bottom-gradient bottom-0 py-2 overflow-y-auto w-full -z-10'>
                <nav className='w-screen flex items-center justify-center px-16 py-2  '>
                    <button onClick={home}>
                        <lord-icon
                            src="https://cdn.lordicon.com/cnpvyndp.json"
                            trigger="click"
                            colors="primary:black"
                        >
                        </lord-icon>
                        {/* <br /><span>Home</span> */}
                    </button>
                </nav>
            </div>
        </div>
    );
}

export default CustomerDetail;
