import React, { useEffect, useState } from 'react';
import Nav from '../TopNav';
import { useNavigate } from 'react-router-dom';
import Settings from '../../assets/Settings';
import getTickets from '../modules/getAllTickets';
import Ticket from '../../assets/Ticket';
import History from '../../assets/History';
import Calender from '../../assets/Calender';
import Technician from '../../assets/Technician';
import getTicketsettings from '../modules/getTicketSetting';
import Search from '../../assets/Search';
import Home from '../../assets/Home';
import Ticketpannel from './Ticketpannel';
import axios from 'axios';
import api from '../../components/modules/Api'

function Alltickets() {
    const [settings, setSetting] = useState(false);
    const [allTickets, setAlltickets] = useState([]);
    const [isAdmin, setAdmin] = useState(false);
    const [dateTime, setDateTime] = useState([]);
    const [searchInput, setSearchInput] = useState(''); // State for search input
    const [filteredTickets, setFilteredTickets] = useState([]); // State for filtered tickets
    const [role, setRole] = useState('');
    const [userName, setUsername] = useState('');



    useEffect(() => {
        const currentUserdet = JSON.parse(localStorage.getItem("userDet")) || {};
        setRole(currentUserdet.role || 'User');
        setUsername(currentUserdet.username || 'Guest');
        const data = JSON.parse(localStorage.getItem("AllTickets")); // Assuming data is stored as a stringified JSON
        const users = JSON.parse(localStorage.getItem("userDet"));
        if (data) {
            const dateTimeArray = data.map((item) => {
                const [date, time] = item.updatedDate.split(' ');
                return { date, time };
            });
            setDateTime(dateTimeArray);
            setAlltickets(data);
            setFilteredTickets(data); // Initialize filteredTickets with all tickets
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
        navigate('/Server/Home');
        navigator.vibrate(60);
    };

    if (role !== "technician") {
        getTickets();
    } else {
        const getTechTicket = async () => {
            try {
                localStorage.removeItem('AllTickets'); // Clear old data
                const response = await axios.post(`${api}api/getTechTicket`, {
                    username: userName, // Payload
                });

                localStorage.setItem('AllTickets', JSON.stringify(response.data)); // Store the new data
                console.log('Response:', response.data);
            } catch (error) {
                console.error('Error fetching tech ticket:', error);
            }
        };
        getTechTicket();
    }
    getTicketsettings();

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'text-red-500';
            case 'Normal':
                return 'text-yellow-500';
            case 'Low':
                return 'text-green-500';
            default:
                return 'text-gray-600';
        }
    }

    const statusColor = (status) => {
        switch (status) {
            case 'Assigned':
                return 'bg-yellow-500';
            case 'Closed':
                return 'bg-green-500';
            case 'Reopened':
                return 'bg-blue-500'
            default:
                return 'bg-red-400';
        }
    }

    const openTicket = (ticketId) => {
        navigate('/open-ticket', { state: { ticketId } });
    }

    // Function to handle search input change
    const handleSearchInputChange = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchInput(searchValue);

        // Filter tickets based on company name or ticket number
        const filtered = allTickets.filter(ticket =>
            ticket.companyName.toLowerCase().includes(searchValue) ||
            ticket.ticketNumber.toLowerCase().includes(searchValue)
        );
        setFilteredTickets(filtered);
    };

    return (
        <div className='mb-16 '>
            {role !== 'technician' && (
                <Nav />
            )}
            <h1 className='font-semibold font-sans text-3xl sticky top-0 z-10 hidden whitespace-nowrap md:block px-3'>
                {/* Manage<span className='text-customColor '>Ticket</span> */}
            </h1>
            <div className='md:flex'>
                {role !== "technician" && (
                    <>
                        <Ticketpannel />
                    </>

                )}
                <div className='my-6 flex items-center justify-between md:justify-start md:gap-16 px-3 relative md:opacity-0 md:-z-10 md:hidden'>
                    {role !== "technician" && (

                        <h1 className='font-semibold font-sans text-3xl sticky top-0 z-10 bg-[#f5f5f5]'>
                            Manage<span className='text-customColor'>Ticket</span>
                        </h1>
                    )}

                    {isAdmin && (
                        <button onClick={toggleSettings}>
                            <Settings />
                        </button>
                    )}
                </div>
                {/* Search Input */}
                <div className=' p-4 rounded-sm '>
                    <div className='px-3 flex relative md:max-w-[700px] md:px-0 md:rounded-lg md:mx-3 /md:shadow-inner shadow- md:shadow-gray-400/ /md:bg-white h-11'>
                        <input
                            type="text"
                            className='bg-transparent border  border-gray-500 bg-white /md:border-none p-2 outline-none w-full rounded focus:border-blue-400'
                            placeholder="Search by company name or ticket number"
                            value={searchInput}
                            onChange={handleSearchInputChange} // Handle input change
                        />
                        <button className='bg-white shadow-customShadow  py-1  px-5 rounded-xl md:flex mx-10 hidden' onClick={newTicket}>
                            <span className='text-customColor  text-3xl'>
                                +
                            </span>
                        </button>
                    </div>
                    <div className="px-3  md:overflow-auto  md:h-[750px]">
                        {filteredTickets.length > 0 ? (
                            <ul className='md:flex md:flex-wrap items-center m-auto'>
                                {filteredTickets.map((ticket, index) => (
                                    <li
                                        key={index}
                                        className='my-2 bg-white py-4 px-5 rounded-lg shadow-m/d border border-gray-500 shadow-gray-300 flex items-center justify-between cursor-pointer min-w-80 md:w-full transition-all'
                                        onClick={() => openTicket(ticket._id)}
                                    >
                                        <div className='text-[16px] font-sans'>
                                            <div className='text-gray-600 flex items-center gap-1'>
                                                {ticket.ticketNumber} <span className='text-[10px] text-gray-400'>●</span> <span className={`${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                                            </div>
                                            <span className='text-customColor text-xl'>{ticket.companyName}</span>
                                            <div className='my-1 text-customColor flex items-center gap-2'>
                                                <span className={`text-white text-xs px-3 py-1 w-20 text-center rounded-md ${statusColor(ticket.ticketStatus)}`}>
                                                    {ticket.ticketStatus}
                                                </span>
                                                <span className='flex gap-[2px] items-center'>
                                                    {(ticket.ticketStatus === "Assigned" || ticket.ticketStatus === "Reopened") && (
                                                        <>
                                                            <Technician /> {ticket.assignedTo}
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                            <div className='text-gray-600 flex items-center'>
                                                {dateTime[index] && (
                                                    <div className='flex gap-2'>
                                                        <div className='flex items-center'>
                                                            <History size={18} />
                                                            <span className='text-customColor'>{dateTime[index].time}</span>
                                                        </div>
                                                        <div className='flex gap-1'>
                                                            <Calender />
                                                            <span className='text-customColor'>{dateTime[index].date}</span>
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
                            <p>No matching tickets found.</p>
                        )}
                    </div>
                </div>


                <button
                    className='md:hidden bg-slate-400 py-2 px-3 rounded-xl my-9 fixed bottom-0 right-8 flex justify-between w-20 items-center
                 text-white z-50'
                    onClick={newTicket}
                >
                    <span className='text-white font-bold text-xl'>+</span> New
                </button>


                <div className='fixed md:hidden bottom-0 py-2 overflow-y-auto w-full z-90 bg-white'>
                    <nav className='w-screen flex items-center justify-center px-16 py-2'>
                        <button onClick={home}>
                            <Home />
                        </button>
                    </nav>
                </div>
            </div>

        </div>
    );
}

export default Alltickets;
