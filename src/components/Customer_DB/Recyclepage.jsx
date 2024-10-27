import React, { useEffect, useState } from 'react';
import Recycle from '../../assets/Recycle'; // Assuming this is for future use
import api from '../modules/Api';
import axios from 'axios';
import History from '../../assets/History';
import Delete from '../../assets/Delete';

const Recyclepage = () => {
    const [companys, setCompanys] = useState([]);
    const [firstLetters, setFirstLetters] = useState([]); // To store the first letters
    const [creator, setCreator] = useState(JSON.parse(localStorage.getItem('userDet')).username);


    // Function to fetch deleted companies
    const fetchDeletedCompanies = async () => {
        try {
            const response = await axios.get(api + 'api/getDeletedCompany');
            setCompanys(response.data); // Store the response data in companys state

            // Extract the first letter of each company name
            const letters = response.data.map(company => company.companyName[0].toUpperCase());
            setFirstLetters(letters);
            console.log('First letters of company names:', letters);
        } catch (error) {
            console.error('Error fetching deleted companies:', error);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchDeletedCompanies();
    }, []); // Empty dependency array ensures this runs once when the component mounts

    // Function to handle history click
    const restoreCompany = async (companyName) => {
        if (confirm("Are sure you want to restore the company ?")) {
            try {
                const response = await axios.post(api + 'api/restoreClient', { companyName },
                    {
                        headers: {
                            'Content-Type': 'application/json', // Specify the content type
                            'updatedby': creator // Add the `creater` value in the headers
                        }
                    }
                );
                console.log('Company restored successfully:', response.data);
                // Optionally refetch the deleted companies to update the list
                fetchDeletedCompanies();
            } catch (error) {
                console.error('Error restoring company:', error);
            }
        }
    };


    // Function to handle delete click
    const handleDeleteClick = async (companyName) => {
        if (confirm("Are your sure you want to delete company from recycle bin ?")) {
            try {
                const response = await axios.post(api + 'api/deleteClientRecycle', { companyName },
                    {
                        headers: {
                            'Content-Type': 'application/json', // Specify the content type
                            'updatedby': creator // Add the `creater` value in the headers
                        }
                    }
                );
                console.log('Company deleted successfully:', response.data);
                // Optionally refetch the deleted companies to update the list
                fetchDeletedCompanies();
            } catch (error) {
                console.error('Error deleting company:', error);
            }
        }

    };


    return (
        <div className='px-4'>
            <div className='flex items-center justify-between my-6'>
                <h1 className='font-semibold font-sans text-3xl w-fit'>Recycle <span className='text-customColor'>Bin</span></h1>
                <button>
                    {/* <Recycle /> Optional recycle button functionality */}
                </button>
            </div>
            <div>
                {companys.length > 0 ? (
                    companys.map((company, index) => (
                        <div key={company._id} className="flex justify-between items-center mb-3 px-2 border-b-2">
                            <div className="flex items-center font-sans gap-2">
                                <div className='bg-customColor  rounded-full flex items-center justify-center text-white w-7 h-7 scale-[1.5] mr-3'>
                                    <h1>{firstLetters[index]}</h1>
                                </div>
                                <div>
                                    <span className="font-bold text-xl">{company.companyName}</span><br />
                                    <span className='text-sm font-semibold'>{company.address}</span>
                                </div>
                            </div>
                            <div className='flex gap-2'>
                                <button onClick={() => restoreCompany(company.companyName)}>
                                    <History />
                                </button>
                                <button onClick={() => handleDeleteClick(company.companyName)}>
                                    <Delete />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No deleted companies found.</p>
                )}
            </div>
        </div>
    );
};

export default Recyclepage;
