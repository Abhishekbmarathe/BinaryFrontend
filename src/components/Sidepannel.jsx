import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Sidepannel() {
    const [cardData, setCardData] = useState([
        { content: 'Create Ticket', endpoint: '/create-ticket' },
        { content: 'Manage Ticket', endpoint: '/manage-ticket' },
        { content: 'Manage User', endpoint: '/manage-user' },
        { content: 'Customer DB', endpoint: '/customer-db' },
        { content: 'Asset DB', endpoint: '/asset-db' },
        { content: 'Report', endpoint: '/report' },
        { content: 'Assigned Ticket', endpoint: '/assigned-ticket' },
    ]);

    const navigate = useNavigate();

    return (
        <div className=''>
            <div className="hidden sm:block bg-slate-700 text-white w-fit text-center p-6 h-screen fixed">
                <h1  className="relative z-10 font-bold">Control panel</h1>    
                <div className="top-full p-4 rounded-md">
                    <div className="cards w-48 flex flex-col gap-4">
                        {cardData.map((card, index) => (
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