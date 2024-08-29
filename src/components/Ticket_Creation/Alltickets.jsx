import React, { useEffect, useState } from 'react';
import Nav from '../TopNav';
import { useNavigate } from 'react-router-dom';
import Settings from '../../assets/Settings';
import getTickets from '../modules/getAllTickets';
import Ticket from '../../assets/Ticket';
import History from '../../assets/History';
import Calender from '../../assets/Calender';
import Technician from '../../assets/Technician'
import getTicketsettings from '../modules/getTicketSetting'

function Alltickets() {

    const [settings, setSetting] = useState(false);
    const [allTickets, setAlltickets] = useState([]);
    const [isAdmin, setAdmin] = useState(false);
    const [dateTime, setDateTime] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("AllTickets")); // Assuming data is stored as a stringified JSON
        const users = JSON.parse(localStorage.getItem("userDet"));
        if (data) {
            const dateTimeArray = data.map((item) => {
                const [date, time] = item.updatedDate.split(' ');
                return { date, time };
            });
            setDateTime(dateTimeArray);
            console.log("Alltickets ", dateTimeArray)
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
    getTicketsettings();

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

            <div className="px-3 md:w-fit m-auto">
                {allTickets.length > 0 ? (
                    <ul className='md:flex md:gap-4 md:flex-wrap items-center m-auto'>
                        {allTickets.map((ticket, index) => (
                            <li
                                key={index}
                                className='my-4 bg-white py-4 px-5 rounded-lg shadow-md flex items-center justify-between cursor-pointer min-w-80'
                                onClick={() => openTicket(ticket._id)}
                            >
                                <div className='text-[16px] font-sans'>
                                    <h2 className='text-gray-600'>{ticket.ticketNumber} <span className='text-[10px] text-gray-400'>●</span> <span className={`${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span></h2>
                                    <span className='text-customColor text-xl'>{ticket.companyName}</span>
                                    <div className='my-1 text-customColor flex items-center gap-2'>
                                        <span className={`text-white px-2 w-fit rounded-md ${ticket.ticketStatus === "Assigned" ? "bg-red-400" : "bg-yellow-400"}`}>
                                            {ticket.ticketStatus}
                                        </span>
                                        <span className='flex gap-[2px] items-center'>
                                            {ticket.ticketStatus === "Assigned" && <>
                                                <Technician /> {ticket.assignedTo}
                                            </>}
                                        </span>
                                    </div>
                                    <div className='text-gray-600 flex items-center'>
                                        {dateTime[index] && (
                                            <div className='flex gap-2'>
                                                <div className='flex'>
                                                    <History size={18} />
                                                    <span className='text-customColor'>{dateTime[index].time}</span>
                                                </div>
                                                <div className='flex gap-1'>
                                                    <Calender />
                                                    <span className='text-customColor '>{dateTime[index].date}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='bg-[#E2FEFB] rounded-full h-fit p-3 mt-4'>
                                    <Ticket size={25} color="rgb(0 197 255)" />
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
