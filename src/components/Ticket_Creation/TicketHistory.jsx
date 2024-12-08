import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../modules/Api';
import Location from '../../assets/Location';

const TicketHistory = () => {
    const [responseData, setResponseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ticketNumber, setTicketNumber] = useState(localStorage.getItem('ticketNumber'));

    useEffect(() => {
        setLoading(true);

        axios
            .post(api + 'api/getAllStartStop', { ticketNumber })
            .then((response) => {
                setResponseData(response.data);
            })
            .catch((err) => {
                setError(err.message || 'Something went wrong');
            })
            .finally(() => {
                setLoading(false);
            });

        // Adding ticketNumber as a dependency ensures it fetches data whenever ticketNumber changes
    }, [ticketNumber]);

    const formatDate = (dateTime) => {
        const datePart = dateTime.split(' ')[0]; // Extract the date part (dd:mm:yyyy)
        const [day, month, year] = datePart.split(':'); // Split the date into components
        return `${day}/${month}/${year}`; // Return in dd/mm/yyyy format
    };


    const formatTime = (dateTime) => {
        // Extracts the time from the datetime string
        return dateTime.split(' ')[1];
    };

    return (
        <div className="p-4/">
            {/* <button onClick={handleFetch} className="btn bg-blue-500 text-white px-4 py-2 rounded mb-4">
                Fetch Data
            </button> */}
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            <div className="grid gap-4 font-sans">
                {responseData && responseData.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 shadow-md bg-gray-200">
                        {/* Top Row: Username and Start Date */}
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold">{item.username}</span>
                            <span className="font-semibold">{formatDate(item.startTime)}</span>
                        </div>
                        {/* Middle Row: Start Time, Stop Time, Total Time */}
                        <div className="mb-2 flex justify-center gap-6">
                            <span className="flex flex-col items-center">
                                <p className="text-gray-600 font-semibold">Start Time</p>
                                <p className='text-customColor font-bold'>{formatTime(item.startTime).slice(0, 5)}</p>
                            </span>
                            <span className="flex flex-col items-center">
                                <p className="text-gray-600 font-semibold">End Time</p>
                                <p className='text-customColor font-bold'>{formatTime(item.stopTime).slice(0, 5)}</p>
                            </span>
                            <span className="flex flex-col items-center">
                                <p className="text-gray-600 font-semibold">Total Time</p>
                                <p className='text-customColor font-bold'>{item.totalTime.slice(0, 5)}</p> {/* Directly remove seconds for Total Time */}
                            </span>

                        </div>
                        <hr className="my-4 border-t-2 w-7/12 m-auto border-gray-400" />

                        {/* Bottom Row: Locations */}
                        <div className="flex justify-center gap-5 text-sm">

                            <p className='bg-white text-black shadow-customShadow px-2 rounded py-1 flex items-center justify-center'>
                                <Location pinFill='green' />
                                <a href={item.startLocation} target="_blank" rel="noopener noreferrer" className=" whitespace-nowrap">
                                    Start Location
                                </a>
                            </p>
                            <p className='bg-white text-black shadow-customShadow px-2 rounded py-1 flex items-center justify-center'>
                                <Location pinFill='red' />
                                <a href={item.stopLocation} target="_blank" rel="noopener noreferrer" className=" whitespace-nowrap">
                                    Stop Location
                                </a>
                            </p>


                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TicketHistory;
