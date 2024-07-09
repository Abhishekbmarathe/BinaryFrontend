import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BottomNavbar = () => {
    const [cardData, setCardData] = useState([
        { content: 'Manage User', endpoint: '/manage-user', permission: 'manageUser' },
        { content: 'Create Ticket', endpoint: '/create-ticket', permission: 'createTicket' },
        { content: 'Manage Ticket', endpoint: '/manage-ticket', permission: 'assignTicket' },
        { content: 'Manage Finance', endpoint: '/report', permission: 'manageFinance' },
        { content: 'Customer DB', endpoint: '/customer-db', permission: 'createClient' },
        { content: 'Asset DB', endpoint: '/asset-db', permission: 'createAsset' },
    ]);

    const [filteredCardData, setFilteredCardData] = useState([]);
    const navigate = useNavigate();
    const [pop, setPop] = useState(false);

    useEffect(() => {
        const userDet = JSON.parse(localStorage.getItem('userDet'));
        const user = userDet.user || userDet;
        console.log("alluserssssss : ", userDet);
        const permissions = {
            createTicket: user.createTicket,
            assignTicket: user.assignTicket,
            createClient: user.createClient,
            createAsset: user.createAsset,
            manageFinance: user.manageFinance,
            manageUser: user.manageUser,
            role: user.role
        };

        const filteredData = cardData.filter(card => {
            if (user.role === 'mAdmin') {
                return true;
            }
            return permissions[card.permission];
        });

        setFilteredCardData(filteredData);
    }, [cardData]);

    const popUp = () => {
        setPop(!pop);
        navigator.vibrate(60);
    };

    const danger = () => {
        alert("You clicked danger button ha ha ha 💀");
        navigator.vibrate(60);
    };

    const bahuth = () => {
        alert("You clicked Notifications ting ting ting");
        navigator.vibrate(60);
    };

    const logout = () => {
        localStorage.clear()
        navigate('/');
    };

    return (
        <div className='sm:hidden'>
            <div className='fixed bottom-4 overflow-y-auto w-full'>
                <nav className='w-screen flex items-center justify-between px-16 py-2 '>
                    <button onClick={danger}>
                        <lord-icon
                            src="https://cdn.lordicon.com/cnpvyndp.json"
                            trigger="click"
                            colors="primary:#ffffff"
                        >
                        </lord-icon>
                        <br /><span>Home</span>
                    </button>
                    <button onClick={popUp}>
                        <lord-icon
                            src="https://cdn.lordicon.com/dwoxxgps.json"
                            trigger="click"
                            colors="primary:#ffffff"
                        >
                        </lord-icon>
                        <br /><span className='opacity-0'>Up</span>
                    </button>
                    <button onClick={bahuth}>
                        <lord-icon
                            src="https://cdn.lordicon.com/vspbqszr.json"
                            trigger="hover"
                            colors="primary:#ffffff"
                        >
                        </lord-icon>
                        <br /><span>Updates</span>
                    </button>
                </nav>
                <div className={`fixed inset-x-0 bottom-0 bg-neutral-800 text-cyan-50 p-4 transition-transform duration-500 rounded-t-3xl ${pop ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className='my-5 text-center'>Control Panel</div>
                    <div className="cards flex gap-6 justify-center flex-wrap">
                        {filteredCardData.map((card, index) => (
                            <button
                                key={index}
                                className="card p-3 min-w-[150px] max-w-[300px] rounded-md bg-[#0E0E0E] text-center"
                                onClick={() => navigate(card.endpoint)}
                            >
                                <p className="text-[14px]">{card.content}</p>
                            </button>
                        ))}
                    </div>
                    <button onClick={logout} className='text-red-500 my-16 block m-auto'>Logout</button>
                    <button onClick={popUp} className='m-auto block p-3 rounded-lg'>
                        <lord-icon
                            src="https://cdn.lordicon.com/rmkahxvq.json"
                            trigger="hover"
                            colors="primary:#ffffff"
                        >
                        </lord-icon>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BottomNavbar;
