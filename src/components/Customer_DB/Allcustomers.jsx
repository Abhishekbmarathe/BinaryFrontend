import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from '../../assets/Search';

function CustomerProfile() {
    const [allcustomers, setAllcustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [firstLetter, setFirstLetter] = useState([]); // To store the first letters

    const navigate = useNavigate();

    useEffect(() => {
        const customerDetails = JSON.parse(localStorage.getItem("AllClients"));
        if (customerDetails) {
            setAllcustomers(customerDetails);
            setFilteredCustomers(customerDetails); // Initially show all customers

            // Extract the first letter of each company name
            const letters = customerDetails.map(customer => customer.companyName[0].toUpperCase());
            setFirstLetter(letters);
            console.log('First letters of company names:', letters);
        }
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter customers by company name or address
        const filtered = allcustomers.filter(customer =>
            customer.companyName.toLowerCase().includes(query) ||
            customer.address.toLowerCase().includes(query)
        );
        setFilteredCustomers(filtered);
    };

    const handleExpand = (customerId) => {
        navigate(`/customer/${customerId}`);
    };

    return (
        <div className="max-w-md mx-auto sm:max-w-[50vw] ">
            <div className='flex relative mb-8'>
                <input
                    type="text"
                    className='bg-transparent border border-t-0 border-l-0 border-r-0 border-b-gray-500 p-2 outline-none w-full'
                    placeholder="Search by company name or address"
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <button className='absolute right-6 top-2'>
                    <Search />
                </button>
            </div>

            {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                    <div key={index} className="/border-customColor bg-cyan-50/ overflow-hidden flex items-center">
                        <div className='bg-customColor w-12 h-11 rounded-full flex items-center justify-center text-white text-2xl'>
                            <h1>{firstLetter[index]}</h1>
                        </div>
                        <div
                            className="w-[90vw] sm:max-w-full rounded-[8px] p-4 py-2 cursor-pointer  items-center"
                            onClick={() => handleExpand(customer._id)}
                        >
                            <span className='font-bold text-[19px] font-sans '>{customer.companyName}</span><br />
                            <span className='text-sm'>{customer.address}</span>
                        </div>
                    </div>
                ))
            ) : (
                <p>No customers found.</p>
            )}
        </div>
    );
}

export default CustomerProfile;
