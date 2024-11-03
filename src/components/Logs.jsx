import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from './modules/Api';
import Topnav from '../components/TopNav';
import Calender from '../assets/Calender';
import Update from '../assets/Update';
import Created from '../assets/Created';
import Delete from '../assets/Delete';
import Restored from '../assets/History';
import Company from '../assets/Companyicon';
import Settings from '../assets/Settings';
import User from '../assets/User';
import Ticket from '../assets/Ticket';

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

    // Function to get initials and random background color
    const getInitials = (name) => {
        const initials = name.slice(0, 2).toUpperCase();
        const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return { initials, color };
    };

    const Icon = ({ action }) => {
        switch (action) {
            case "updated": return <Update />
            case "created": return <Created />
            case "deleted": return <Delete color="red" height='18' />
            case "restored": return <Restored size='18' />
            case "Final": return <Delete color="red" height='18' />

            default: return <Update />
        }
    }
    const bg = (action) => {
        switch (action) {
            case "updated": return "bg-green-50 border-green-200"
            case "created": return "bg-blue-50 border-blue-200"
            case "deleted": return "bg-red-50 border-red-200"
            case "restored": return "bg-cyan-50 border-cyan-200"
            case "Final": return "bg-red-100 border-red-200"

            default: return "bg-white"
        }
    }
    const Logo = ({ k }) => {
        switch (k) {
            case "company": return <Company />
            case "Company": return <Company />
            case "ticketSettings": return <Settings color='rgb(0 197 255)'/>
            case "ticketNumber": return <Ticket size='18'/>
            case "User": return <User color='rgb(0 197 255)' size='20'/>
        }
    }

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
                        className="p-2 border-2 rounded-lg border-gray-300  w-full md:w-1/2  font-sans outline-none focus:border-green-300"
                    />
                </div>

                <div className="overflow-auto h-screen">
                    <table className="min-w-full bg-white  border-gray-300 font-sans">
                        <thead className='top-0 sticky bg-white  z-10'>
                            <tr>
                                <th className="px-4 py-2 border-b text-left/ ">Updated Date</th>
                                <th className="px-4 py-2 border-b text-left">Updated By</th>
                                <th className="px-4 py-2 border-b text-left">Action</th>
                                <th className="px-4 py-2 border-b text-left">Info</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-500">
                            {filteredRecords.length > 0 ? (
                                [...filteredRecords].reverse().map((record, index) => {  // Use reverse() here
                                    const { initials, color } = getInitials(record.updatedBy);
                                    return (
                                        <tr key={index} className={`hover:bg-gray-100  border font-semibold text-sm ${bg(record.action)}`}>
                                            <td className="px-4 py-2 ">
                                                <div className="flex gap-1 justify-center items-center">
                                                    <Calender color={"gray"} />
                                                    <span>{record.updatedDate}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                            <div className='flex items-center justify-start space-x-2'>
                                                <div className={`w-8 h-8 flex items-center justify-center text-white rounded-full ${color}`}>
                                                    {initials}
                                                </div>
                                                <span>{record.updatedBy}</span>
                                            </div>
                                            </td>
                                            <td className="px-4 py-2 text-left capitalize">
                                                <div className="flex items-center">
                                                    <Icon action={record.action} />
                                                    <span className="ml-2">{record.action}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 text-left">
                                                {Object.entries(record.data).map(([key, value]) => (
                                                    <div key={key} className="text-sm text-gray-600">
                                                        <strong className='flex items-center gap-1'>
                                                            <Logo k={key} /> {key === 'ticketNumber' ? 'Ticket Number'
                                                                : key === 'ticketSettings' ? 'Ticket Settings'
                                                                    : key}:
                                                        </strong> {value}
                                                    </div>
                                                ))}


                                            </td>
                                        </tr>
                                    );
                                })
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
