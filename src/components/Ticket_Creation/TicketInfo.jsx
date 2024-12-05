import React, { useState, useEffect } from 'react';
import Sendbtn from '../../assets/Sendbtn';
import api from '../modules/Api';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Ticketimg from '../Ticket_Creation/TicketImg';
import TicketHistory from './TicketHistory';

const TicketInfo = () => {
    const location = useLocation();
    const { ticketNumber } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [ticketDesc, setTicketDesc] = useState([]);
    const [currentUsername, setCurrentUsername] = useState('');
    const [message, setMessage] = useState('');  // State for the input box value
    const [activeTab, setActiveTab] = useState('notes');  // State to manage active tab

    const [creator, setCreator] = useState(JSON.parse(localStorage.getItem('userDet')).username);


    // Function to fetch ticket details
    const getTechTicketDesc = async () => {
        setLoading(true);
        try {
            const response = await axios.post(api + 'api/getTechTicketDesc', { ticketNumber });
            setTicketDesc(response.data);
        } catch (error) {
            console.error('Error fetching ticket description:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch username from localStorage on component mount
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('userDet'));
        if (storedUser && storedUser.username) {
            setCurrentUsername(storedUser.username);
        }
    }, []);

    // Fetch ticket details on component mount
    useEffect(() => {
        if (ticketNumber) {
            getTechTicketDesc();
        }
    }, [ticketNumber]);

    // Handle sending a message
    const handleSendMessage = async () => {
        if (!message.trim()) return;  // Prevent sending empty messages
        try {
            await axios.post(api + 'api/updateTechTicketDesc', {
                ticketNumber,
                description: message,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'updatedby': creator,
                }
            });
            setMessage('');  // Clear the input box after sending
            getTechTicketDesc();  // Refresh the messages list
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Function to extract and display the first letter of a username
    const getInitial = (name) => name.charAt(0).toUpperCase();

    return (
        <div className="p-6 bg-white rounded-lg h-screen font-sans">
            <h1 className="font-sans font-semibold text-2xl mb-4">
                Ticket <span className="text-customColor">Info</span>
            </h1>

            {/* Tabs Section */}
            <div className="flex space-x-8 border-b pb-2 font-sans ">
                <button
                    className={`text-lg font-medium cursor-pointer ${activeTab === 'notes' ? 'text-customColor' : ''}`}
                    onClick={() => setActiveTab('notes')}
                >
                    Notes
                </button>
                <button
                    className={`text-lg font-medium cursor-pointer ${activeTab === 'images' ? 'text-customColor' : ''}`}
                    onClick={() => setActiveTab('images')}
                >
                    Images
                </button>
                <button
                    className={`text-lg font-medium cursor-pointer ${activeTab === 'history' ? 'text-customColor' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    History
                </button>
            </div>

            {/* Content Section */}
            <div className="border-2 h-[70vh] border-gray-300 rounded-lg p-4 overflow-auto bg-gray-50">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="loader border-4 border-t-4 border-customColor rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Conditionally render content based on active tab */}
                        {activeTab === 'notes' && (
                            ticketDesc.length > 0 ? (
                                ticketDesc.map((item, index) => {
                                    const isCurrentUser = item.username === currentUsername;
                                    const initial = getInitial(item.username);

                                    return (
                                        <div
                                            key={index}
                                            className={`flex items-center ${isCurrentUser ? 'justify-end w-full' : 'justify-start w-full'}`}
                                        >
                                            {!isCurrentUser && (
                                                <div className="w-8 h-8 flex items-center justify-center rounded-full text-white font-bold bg-customColor mr-2">
                                                    {initial}
                                                </div>
                                            )}
                                            <div className="p-2 border rounded-md bg-white shadow-md max-w-xs w-5/6">
                                                <h1 className='font-semibold'>{item.username}</h1>
                                                <p className="text-gray-800">{item.description || 'No description provided'}</p>
                                                <span className='float-end text-sm'>{item.time}</span>
                                            </div>
                                            {isCurrentUser && (
                                                <div className="w-8 h-8 flex items-center justify-center rounded-full text-white font-bold bg-customColor ml-2">
                                                    {initial}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (

                                <p>No ticket data available.</p>
                            )
                        )}

                        {activeTab === 'images' && (
                            <div>
                                <Ticketimg />
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <TicketHistory />
                        )}
                    </div>
                )}
            </div>

            {/* Input Section (Only for Notes) */}
            {activeTab === 'notes' && (
                <div className="flex items-center gap-2 mt-4">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-customColor"
                        placeholder="Type your message..."
                    />
                    <button onClick={handleSendMessage}>
                        <Sendbtn />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TicketInfo;
