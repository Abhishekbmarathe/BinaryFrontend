import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Ticket from '../assets/Ticket.jsx';
import Assign from '../assets/Assignticket.jsx';
import Customerdb from '../assets/Customerdb.jsx';
import User from '../assets/User.jsx';
import { Link } from 'react-router-dom';
import Edit from '../assets/Edit.jsx'

function Sidepannel() {
    const [cardData, setCardData] = useState([
        { content: 'Manage User', endpoint: '/manage-user', permission: 'manageUser', icon: <User size={28} color="rgb(0 197 255)" /> },
        { content: 'Create Ticket', endpoint: '/create-ticket', permission: 'createTicket', icon: <Ticket size={28} color="rgb(0 197 255)" /> },
        { content: 'Manage Ticket', endpoint: '/manage-ticket', permission: 'assignTicket', icon: <Assign size={28} color="rgb(0 197 255)" /> },
        { content: 'Manage Finance', endpoint: '/report', permission: 'manageFinance', icon: <Ticket size={28} color="rgb(0 197 255)" /> }, // Adjust the icon as needed
        { content: 'Customer DB', endpoint: '/customer-db', permission: 'createClient', icon: <Customerdb size={28} color="rgb(0 197 255)" /> },
        { content: 'Asset DB', endpoint: '/asset-db', permission: 'createAsset', icon: <Ticket size={28} color="rgb(0 197 255)" /> }, // Adjust the icon as needed
        // { content: 'Assigned Ticket', endpoint: '/assigned-ticket', permission: 'assignTicket', icon: <Assign /> },
    ]);

    const [filteredCardData, setFilteredCardData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userDet = JSON.parse(localStorage.getItem('userDet'));
        const user = userDet.user || userDet;
        const permissions = {
            createTicket: user.createTicket,
            assignTicket: user.assignTicket,
            createClient: user.createClient,
            createAsset: user.createAsset,
            manageFinance: user.manageFinance,
            manageUser: user.manageUser,
            role: user.role
        };

        // Filter card data based on permissions and role
        const filteredData = cardData.filter(card => {
            if (user.role === 'mAdmin') {
                return true;
            }
            return permissions[card.permission];
        });

        setFilteredCardData(filteredData);
    }, [cardData]);

    return (
        <div className=''>
            <div className="hidden md:block bg-slate-700 text-white w-fit text-center p-6 h-screen fixed overflow-auto">
                <h1 className="relative z-10 font-bold">Control panel</h1>
                <div className="top-full p-4 rounded-md ">
                    <div className="cards w-48 flex flex-col gap-4">
                        {filteredCardData.map((card, index) => (
                            <button
                                key={index}
                                className="card p-3 rounded-md bg-[#0E0E0E] text-center flex items-center gap-2"
                                onClick={() => navigate(card.endpoint)}
                            >
                                <span className="icon w-6 h-6 mr-2">{card.icon}</span>
                                <p className="text-[14px] text-left">{card.content}</p>
                            </button>
                        ))}
                    </div>
                </div>
                <ul className='w-fit text-left px-4 mt-28'>
                    <div className='flex items-center gap-2'>
                    <User size={28} color="rgb(0 197 255)"/>
                    <li className='  my-5 '><Link to="/">Logout</Link></li>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Edit />
                        <li className=' '><Link to="/">Edit Profile</Link></li>
                    </div>
                </ul>
            </div>
        </div>
    );
}

export default Sidepannel;
