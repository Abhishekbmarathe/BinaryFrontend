import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../modules/Api';
import Search from '../../assets/Search'; // Ensure this path is correct
import Clientbranches from '../modules/getClientbranches';

const PermitedCompany = () => {
  const [clients, setClients] = useState([]); // Original client list from API
  const [filteredCustomers, setFilteredCustomers] = useState([]); // Filtered list for display
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const creator = JSON.parse(localStorage.getItem('userDet'))?.username || 'unknown';

  // Function to fetch clients
  const getAllClientsForTech = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${api}api/getAllClientsForTech`, {
        headers: {
          'Content-Type': 'application/json',
          'updatedby': creator,
        },
      });
      setClients(response.data); // Set clients from API
      setFilteredCustomers(response.data); // Initialize filtered list
      console.log(response.data)
      Clientbranches();

    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to fetch clients. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch clients on component mount
  useEffect(() => {
    getAllClientsForTech();
  }, []);

  // Handle search functionality
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter customers by company name or address
    const filtered = clients.filter(customer =>
      customer.companyName?.toLowerCase().includes(query) ||
      customer.address?.toLowerCase().includes(query)
    );
    setFilteredCustomers(filtered);
  };

  // Handle navigation to detailed view
  const handleExpand = (customerId) => {
    navigate(`/customer/${customerId}`);
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      {/* Search Input */}
      <div className='flex relative mb-8'>
        <input
          type="text"
          className='bg-transparent border-b border-gray-500 p-2 outline-none w-full'
          placeholder="Search by company name or address"
          value={searchQuery}
          onChange={handleSearch}
        />
        <button className='absolute right-4 top-2'>
          <Search />
        </button>
      </div>

      {/* Loading and Error States */}
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        // Customer List Display
        <div className="space-y-4">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer, index) => (
              <div
                key={customer._id || index} // Fallback for missing IDs
                className="flex items-center bg-cyan-50 shadow-md rounded-lg p-4 cursor-pointer hover:bg-cyan-100 transition"
                onClick={() => handleExpand(customer._id)}
              >
                {/* Company Initial */}
                <div className="bg-customColor w-12 h-12 rounded-full flex items-center justify-center text-white text-xl">
                  {customer.companyName ? customer.companyName[0].toUpperCase() : '?'}
                </div>
                {/* Company Details */}
                <div className="ml-4">
                  <h2 className="font-bold text-lg">{customer.companyName || 'Unnamed Company'}</h2>
                  <p className="text-gray-600 text-sm">{customer.address || 'No Address Available'}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No customers found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PermitedCompany;
