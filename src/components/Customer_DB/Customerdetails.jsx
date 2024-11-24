import React, { useState, useEffect, createContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Allassets from './Allassets';
import Edit from '../../assets/Edit';
import Company from '../../assets/Companyicon';
import Link from '../../assets/Link';
import Email from '../../assets/Email';
import Info from '../../assets/info';
import User from '../../assets/User';
import Hammenu from '../../assets/HamburgMenu';
import Hamburg from '../../assets/Hamburg';

// Create and export CompanyContext
export const CompanyContext = createContext();
function CustomerDetail() {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const navigate = useNavigate();
    const [menupop, setMenupop] = useState(false);

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
        navigate('/Server/Home');
        navigator.vibrate(60);
    };

    const handlePrivateData = () => {
        navigate('/customer/private-data', { state: { customerId: customerId, companyName: customer?.companyName } });
    };
    const handleCompanyassign = () => {
        navigate('/customer/companyAssign', { state: { companyName: customer?.companyName } });
    }

    if (!customer) {
        return <div>
            NO customers found!
        </div>;
    }

    return (
        // Provide the companyName context with a fallback value
        <CompanyContext.Provider value={{ companyName: customer?.companyName || 'Unknown Company' }}>
            <div className="max-w-md mx-auto mt-0 sm:max-w-[50vw] md:shadow-customShadow md:bg-white md:h-screen">
                <div className="rounded-lg overflow-hidden mb-4 p-4">
                    <div className='flex justify-between items-center mb-10'>
                        <h2 className="text-2xl w-fit font-bold">Customer <span className='text-customColor'>Details</span></h2>
                        <div className='md:flex items-center gap-5 hidden text-gray-600'>
                            <button onClick={handleEdit} className="flex items-center gap-1 shadow-customShadow px-3 py-1 bg-gray-100 hover:bg-gray-300 transition-all">
                                <div className='scale-[1.5]'>
                                </div>
                                <Edit color="rgb(0 197 255)" size={21} /> <span>Edit Company</span>
                            </button>
                            <button onClick={handlePrivateData} className=' flex items-center gap-1 shadow-customShadow px-3 py-1 bg-gray-100 hover:bg-gray-300 transition-all'>
                                <div>
                                </div>
                                <Info color="rgb(0 197 255)" size={21} /><span>Global data</span>
                            </button>
                            <button onClick={handleCompanyassign} className="flex items-center gap-1 shadow-customShadow px-3 py-1 bg-gray-100 hover:bg-gray-300 transition-all">
                                <div className='scale-[1.5]'>
                                </div>
                                <User color="rgb(0 197 255)" size={21} /><span>Company Permission</span>
                            </button>
                        </div>
                        <button className='scale-110 md:hidden'
                            onClick={() => setMenupop(!menupop)}
                        >
                            <Hamburg />
                        </button>
                        {menupop && (
                            <Hammenu />
                        )}
                    </div>
                    <div className='w-fit scale-[3.5] my-8 m-auto'>
                        <Company />
                    </div>
                    <div className="mb-4 flex flex-col items-center">
                        <p>{customer.companyName || 'Unknown Company'}</p>
                        <div className='flex'>
                            <Link />
                            <p>{customer.email}</p>
                        </div>
                        <div className='flex'>
                            <Email />
                            <p>{customer.web}</p>
                        </div>
                    </div>
                    <h1 className='text-customColor text-xl'>Assets</h1>
                </div>

                <Allassets companyName={customer?.companyName} />

                <button
                    className='bg-white shadow-customShadow  py-2 px-5 rounded-xl my-9 fixed bottom-0 right-8 flex justify-between items-center'
                    onClick={handleNewCustomer}
                >
                    <span className='text-customColor text-3xl font-bold '>+</span>
                </button>
                <div className='fixed md:hidden /bg-bottom-gradient bottom-0 py-2 overflow-y-auto w-full -z-10'>
                    <nav className='w-screen flex items-center justify-center px-16 py-2'>
                        <button onClick={home}>
                            <lord-icon
                                src="https://cdn.lordicon.com/cnpvyndp.json"
                                trigger="click"
                                colors="primary:black"
                            >
                            </lord-icon>
                        </button>
                    </nav>
                </div>
            </div>
        </CompanyContext.Provider>
    );
}

export default CustomerDetail;
