import React, { useEffect, useState } from 'react';
import Nav from '../TopNav';
import { useNavigate } from 'react-router-dom';
import Settings from '../../assets/Settings';
import getTickets from '../modules/getAllTickets';

function Alltickets() {

    const [settings, setSetting] = useState(false);
    const [allTickets, setAlltickets] = useState([]);
    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("AllTickets")); // Assuming data is stored as a stringified JSON
        const users = JSON.parse(localStorage.getItem("userDet"));
        if (data) {
            setAlltickets(data);
            if (users.role === "mAdmin") {
                setAdmin(true);
            }
        }
    }, []);

    const navigate = useNavigate();

    const newTicket = () => {
        navigate('/newticket');
    }

    const toggleSettings = () => {
        navigate('/openSettings');
    }

    const home = () => {
        navigate('/Server/Home')
        navigator.vibrate(60);
    };

    getTickets();

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'text-red-500';
            case 'Normal':
                return 'text-green-500';
            case 'Low':
                return 'text-yellow-500';
            default:
                return 'text-gray-600';
        }
    }

    const openTicket = (ticketId) => {
        navigate('/open-ticket', { state: { ticketId } });
    }

    return (
        <div>
            <Nav />
            <div className='my-6 flex items-center justify-between px-3 relative'>
                <h1 className=' font-semibold font-sans text-3xl sticky top-0 z-10 bg-[#f5f5f5]'>Manage<span className='text-customColor'>Ticket</span></h1>

                {isAdmin && (
                    <button onClick={toggleSettings}>
                        <Settings />
                    </button>
                )}

            </div>

            <div className="px-3">
                {allTickets.length > 0 ? (
                    <ul className='space-y-4'>
                        {allTickets.map((ticket, index) => (
                            <li
                                key={index}
                                className='bg-white py-4 px-2 rounded-lg shadow-md flex justify-between cursor-pointer'
                                onClick={() => openTicket(ticket._id)}
                            >
                                <div className='text-[16px] font-sans'>
                                    <h2 className=''>{ticket.ticketNumber} | <span className='text-customColor'>{ticket.companyName}</span></h2>
                                    <p className='text-gray-600'>Updated On: <span className='text-customColor'>{ticket.updatedDate}</span></p>
                                    <p className='text-gray-600'>Assigned To: <span className='text-customColor'>{ticket.ticketStatus}</span></p>
                                </div>
                                <div className='flex text-[14px]'>
                                    <span className={`${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>&nbsp;|&nbsp;<span className='text-customColor'>{ticket.ticketStatus}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No tickets available.</p>
                )}
            </div>

            <button
                className='bg-slate-400 py-2 px-3 rounded-xl my-9 fixed bottom-0 right-8 flex justify-between w-20 items-center text-white'
                onClick={newTicket}
            >
                <span className='text-white font-bold text-xl'>+</span> New
            </button>
            <div className='fixed md:hidden /bg-bottom-gradient bottom-0 py-2 overflow-y-auto w-full -z-10'>
                <nav className='w-screen flex items-center justify-center px-16 py-2  '>
                    <button onClick={home}>
                        <lord-icon
                            src="https://cdn.lordicon.com/cnpvyndp.json"
                            trigger="click"
                            colors="primary:black"
                        >
                        </lord-icon>
                        {/* <br /><span>Home</span> */}
                    </button>
                </nav>
            </div>
        </div>
    );
}

export default Alltickets;
