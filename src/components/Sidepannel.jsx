import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Sidepannel() {
    const [cardData, setCardData] = useState([
        { content: 'Manage User', endpoint: '/manage-user', permission: 'manageUser' },
        { content: 'Create Ticket', endpoint: '/create-ticket', permission: 'createTicket' },
        { content: 'Manage Ticket', endpoint: '/manage-ticket', permission: 'assignTicket' },
        { content: 'Manage Finance', endpoint: '/report', permission: 'manageFinance' },
        { content: 'Customer DB', endpoint: '/customer-db', permission: 'createClient' },
        { content: 'Asset DB', endpoint: '/asset-db', permission: 'createAsset' },
        // { content: 'Assigned Ticket', endpoint: '/assigned-ticket', permission: 'assignTicket' },
    ]);

    const [filteredCardData, setFilteredCardData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userDet = JSON.parse(localStorage.getItem('userDet'));

        const permissions = {
            createTicket: userDet.createTicket,
            assignTicket: userDet.assignTicket,
            createClient: userDet.createClient,
            createAsset: userDet.createAsset,
            manageFinance: userDet.manageFinance,
            manageUser: userDet.manageUser,
            role: userDet.role
        };

        // Filter card data based on permissions and role
        const filteredData = cardData.filter(card => {
            if (userDet.role === 'mAdmin') {
                return userDet.role;
            }
            return permissions[card.permission];
        });

        setFilteredCardData(filteredData);
    }, [cardData]);

    return (
        <div className=''>
            <div className="hidden sm:block bg-slate-700 text-white w-fit text-center p-6 h-screen fixed">
                <h1 className="relative z-10 font-bold">Control panel</h1>
                <div className="top-full p-4 rounded-md">
                    <div className="cards w-48 flex flex-col gap-4">
                        {filteredCardData.map((card, index) => (
                            <button
                                key={index}
                                className="card p-3 rounded-md bg-[#0E0E0E] text-center"
                                onClick={() => navigate(card.endpoint)}
                            >
                                <p className="text-[14px] text-left">{card.content}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidepannel;
