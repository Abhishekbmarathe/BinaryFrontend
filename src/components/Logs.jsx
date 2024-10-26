import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from './modules/Api';
import Topnav from '../components/TopNav';

const Logs = () => {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await axios.post(api + 'api/getLogs');
                setRecords(response.data);
                setFilteredRecords(response.data); // Initialize filtered records
            } catch (error) {
                console.error('Error fetching records:', error);
            }
        };

        fetchRecords();
    }, []);

    // Update search results when searchTerm changes
    useEffect(() => {
        const results = records.filter(record => 
            record.updatedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.updatedDate.includes(searchTerm) ||
            record.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            Object.values(record.data).some(value => 
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredRecords(results);
    }, [searchTerm, records]);

    return (
        <>
            <Topnav />
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold font-sans mb-4">Logs</h2>
                
                {/* Search Input */}
                <div className="mb-4">
                    <input 
                        type="text" 
                        placeholder="Search logs..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        className="p-2 border border-gray-300 rounded w-full font-sans"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 font-sans">
                        <thead>
                            <tr className=''>
                                <th className="px-4 py-2 border-b">Updated Date</th>
                                <th className="px-4 py-2 border-b">Updated By</th>
                                <th className="px-4 py-2 border-b">Action</th>
                                <th className="px-4 py-2 border-b text-left">Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.length > 0 ? (
                                filteredRecords.map((record, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="px-4 py-2 border-b text-center">{record.updatedDate}</td>
                                        <td className="px-4 py-2 border-b text-center">{record.updatedBy}</td>
                                        <td className="px-4 py-2 border-b text-center capitalize">{record.action}</td>
                                        <td className="px-4 py-2 border-b text-left">
                                            {Object.entries(record.data).map(([key, value]) => (
                                                <div key={key} className="text-sm text-gray-700">
                                                    <strong>{key}:</strong> {value}
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center p-4">No records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Logs;
