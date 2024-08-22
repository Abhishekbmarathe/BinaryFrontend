import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Ticket from '../assets/Ticket.jsx';
import Assign from '../assets/Assignticket.jsx';
import Customerdb from '../assets/Customerdb.jsx';
import User from '../assets/User.jsx';

const BottomNavbar = () => {
    const [cardData, setCardData] = useState([
        { content: 'Manage User', endpoint: '/manage-user', permission: 'manageUser', icon: <User size={28} color="white" /> },
        { content: 'Manage Ticket', endpoint: '/create-ticket', permission: 'createTicket', icon: <Ticket size={28} color="white" /> },
        // { content: 'Manage Ticket', endpoint: '/manage-ticket', permission: 'assignTicket', icon: <Assign size={28} color="rgb(0 197 255)" /> },
        { content: 'Customer DB', endpoint: '/customer-db', permission: 'createClient', icon: <Customerdb size={28} color="white" /> },
        { content: 'Asset DB', endpoint: '/asset-db', permission: 'createAsset', icon: <Ticket size={28} color="white" /> }, // Adjust the icon as needed
        // { content: 'Manage Finance', endpoint: '/report', permission: 'manageFinance', icon: <Ticket size={28} color="rgb(0 197 255)" /> }, // Adjust the icon as needed
        // { content: 'Assigned Ticket', endpoint: '/assigned-ticket', permission: 'assignTicket', icon: <Assign /> },
    ]);

    const [filteredCardData, setFilteredCardData] = useState([]);
    const navigate = useNavigate();
    const [pop, setPop] = useState(false);

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

    const home = () => {
        navigate('/Server/Home')
        navigator.vibrate(60);
    };

    const bahuth = () => {
        alert("You clicked Notifications ting ting ting");
        navigator.vibrate(60);
    };

    const logout = () => {
        const conf = confirm("Are you sure to Logout ?")
        if (conf) {
            localStorage.clear()
            navigate('/');
        }
    };

    return (
        <div className=' md:hidden'>
            <div className='fixed bg-white /bg-bottom-gradient bottom-0 py-2 overflow-y-auto w-full z-50'>
                <nav className='w-screen flex items-center justify-between px-16 py-2  '>
                    <button onClick={home}>
                        <lord-icon
                            src="https://cdn.lordicon.com/cnpvyndp.json"
                            trigger="click"
                            colors="primary:black"
                        >
                        </lord-icon>
                        <br /><span>Home</span>
                    </button>
                    <button onClick={popUp}>
                        <lord-icon
                            src="https://cdn.lordicon.com/dwoxxgps.json"
                            trigger="click"
                            colors="primary:black"
                        >
                        </lord-icon>
                        <br /><span className='opacity-0'>Up</span>
                    </button>
                    <button onClick={bahuth}>
                        <lord-icon
                            src="https://cdn.lordicon.com/vspbqszr.json"
                            trigger="hover"
                            colors="primary:black"
                        >
                        </lord-icon>
                        <br /><span>Updates</span>
                    </button>
                </nav>
                <div className={`fixed inset-x-0 bottom-0 /bg-neutral-800 bg-white bg-panel-gradient/ border-t-2 border-customColor text-cyan-50 p-4 transition-transform duration-500 rounded-t-3xl ${pop ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className='my-6 text-center text-black font-semibold'>Control Panel</div>
                    <div className="cards flex gap-4 justify-center   items-center flex-wrap">
                        {filteredCardData.map((card, index) => (
                            <button
                                key={index}
                                className="card p-3 w-[170px] rounded-md bg-customColor text-white text-center flex items-center gap-2"
                                onClick={() => navigate(card.endpoint)}
                            >
                                <span>{card.icon}</span>
                                <p className="text-[14px]">{card.content}</p>
                            </button>
                        ))}
                    </div>
                    <button onClick={logout} className='text-red-500 font-semibold text-xl mb-8 mt-10 font-sans  m-auto block'> Logout</button>
                    <button onClick={popUp} className='m-auto block p-3 rounded-lg'>
                        <lord-icon
                            src="https://cdn.lordicon.com/rmkahxvq.json"
                            trigger="hover"
                            colors="primary:black"
                        >
                        </lord-icon>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BottomNavbar;
