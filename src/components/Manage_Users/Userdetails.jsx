import React, { useEffect, useState } from 'react';
import User from '../../assets/User';
import Edit from '../../assets/Edit';
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo';
import getAllAsset from '../modules/getTicketSetting';
import getAllCustomers from '../modules/getAllcustomers';
import getAlltickets from '../modules/getAllTickets';
import api from '../modules/Api'
import axios from 'axios'

function Userdetails() {
    // Total number of Users, Admins, and Technicians
    const [userCount, setUserCount] = useState(0);
    const [adminUsersCount, setAdminUsersCount] = useState(0);
    const [technicianUsersCount, setTechnicianUsersCount] = useState(0);
    const [ticketCount, setTicketcount] = useState(0);
    const [ticketStatus, setTicketstatus] = useState(0);
    const [closedTicket, setClosedticket] = useState(0);
    const [customerDetails, setCustomerdetails] = useState(0);
    const [assets, setAssetcount] = useState(0);

    const [assignTicket, setAssignTicket] = useState(false);
    const [createAsset, setCreateAsset] = useState(false);
    const [createClient, setCreateClient] = useState(false);
    const [createTicket, setCreateTicket] = useState(false);

    const [currentUser, setCurrentuser] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [userName, setUsername] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        const getTickets = localStorage.getItem("AllTickets");
        const getUsers = localStorage.getItem("allUsers");
        const getCustomers = localStorage.getItem("AllClients");
        const getAllAssets = localStorage.getItem("getAllAssets");

        const ticketsArray = getTickets ? JSON.parse(getTickets) : [];
        const usersArray = getUsers ? JSON.parse(getUsers) : [];
        const customerArray = getCustomers ? JSON.parse(getCustomers) : [];

        const totaltickets = ticketsArray.length
        const adminUsers = usersArray.filter(user => user.role === 'admin');
        const technicianUsers = usersArray.filter(user => user.role === 'technician');
        const rTicket = ticketsArray.filter(ticket => ticket.ticketStatus === 'Reopened');
        const oTicket = ticketsArray.filter(ticket => ticket.ticketStatus === 'Open');
        const aTicket = ticketsArray.filter(ticket => ticket.ticketStatus === 'Assigned');

        // console.log(rTicket,oTicket)
        setUserCount(usersArray.length);
        setAdminUsersCount(adminUsers.length);
        setTechnicianUsersCount(technicianUsers.length);

        setTicketcount(ticketsArray.length)
        setTicketstatus((rTicket.length) + (oTicket.length) + (aTicket.length));
        setClosedticket(ticketsArray.filter(ticket => ticket.ticketStatus === 'Closed').length)

        setCustomerdetails(customerArray.length)

        setAssetcount((getAllAssets ? JSON.parse(getAllAssets) : []).length)

    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentUserdet = JSON.parse(localStorage.getItem("userDet")) || {};
                setCurrentuser(currentUserdet.name || 'Unknown');
                setPhone(currentUserdet.phoneNum || 'N/A');
                setEmail(currentUserdet.email || 'N/A');
                setUsername(currentUserdet.username || 'Guest');
                setRole(currentUserdet.role || 'User');
                setAssignTicket(currentUserdet.assignTicket || false);
                setCreateAsset(currentUserdet.createAsset || false);
                setCreateClient(currentUserdet.createClient || false);
                setCreateTicket(currentUserdet.createTicket || false);

                // Fetch data if the user is not "Master"
                if (currentUserdet.name !== "Master") {
                    if (currentUserdet.createAsset) {
                        getAllAsset();
                        await axios.get(api + "api/getAllAsset")
                            .then((response) => {
                                localStorage.setItem("getAllAssets", JSON.stringify(response.data));
                            })
                            .catch((error) => {
                                console.error("Error fetching all assets:", error);
                                // alert("Something went wrong fetching all assets.");
                            });
                    }

                    if (currentUserdet.createClient) {
                        getAllCustomers();
                        await axios.get(api + "api/getAllClients")
                            .then((response) => {
                                localStorage.setItem("AllClients", JSON.stringify(response.data));
                            })
                            .catch((error) => {
                                console.error("Error fetching all clients:", error);
                                // alert("Something went wrong fetching all clients.");
                            });
                    }

                    if (currentUserdet.createTicket) {
                        getAlltickets();
                        await axios.post(api + "api/getAllTickets", { username: currentUserdet.username })
                            .then((response) => {
                                localStorage.setItem("AllTickets", JSON.stringify(response.data));
                            })
                            .catch((error) => {
                                console.error("Error fetching all tickets:", error);
                                // alert("Something went wrong fetching all tickets.");
                            });
                    }
                } else {
                    console.log("User is Master, no data fetching required");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        // Call the async function
        fetchData();
    }, []);  // Empty dependency array ensures the effect runs once on mount


    const renderCard = (title, count1, label1, count2, label2, count3, label3, navLink) => {
        // Conditionally wrap the div in a Link only if navLink is provided
        const cardContent = (
            <div className="w-full md:w-[400px] bg-cardcolor shadow-lg border-b-[5px] border-customColor text-black rounded-lg z-30 p-2 font-semibold font-sans">
                <h2 className='mt-1 italic w-fit /text-xl'>{title}</h2>
                <div className="p-5 text-center flex gap whitespace-nowrap">
                    <div className='flex flex-col items-center justify-center rounded mx-auto'>
                        <h1 className='text-5xl mb-5 text-customColor font-bold'>{count1}</h1>
                        <span className='text-sm '>{label1}</span>
                    </div>
                    {count2 !== undefined && (
                        <div className='flex flex-col items-center justify-center my-2 rounded mx-auto'>
                            <h1 className='text-5xl mb-5 text-customColor font-bold'>{count2}</h1>
                            <span className='text-sm'>{label2}</span>
                        </div>
                    )}
                    {count3 !== undefined && (
                        <div className='flex flex-col items-center justify-center rounded mx-auto'>
                            <h1 className='text-5xl mb-5 text-customColor font-bold'>{count3}</h1>
                            <span className='text-sm'>{label3}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    
        // If navLink is provided, wrap cardContent in a Link, otherwise return the cardContent
        return navLink ? (
            <Link to={navLink} className="relative w-full md:w-72 px-2">
                {cardContent}
            </Link>
        ) : (
            <div className="relative w-full md:w-72 px-2">
                {cardContent}
            </div>
        );
    };
    
    const renderCards = () => {
        return (
            <div className='flex md:gap-40 gap-10 justify-center md:justify-start flex-wrap items-center mt-8 m-auto w-full'>
                {/* If user is "Master", render all cards without conditions */}
                {userName === "Master" ? (
                    <>
                        {renderCard('User Details', userCount, 'Total users', adminUsersCount, 'Admins', technicianUsersCount, 'Technicians', '/manage-user')}
                        {renderCard('Ticket Details', ticketCount, 'Total Tickets', ticketStatus, 'Open Tickets', closedTicket, 'Closed Tickets', '/create-ticket')}
                        {renderCard('Customer Details', customerDetails, 'Total Customers', undefined, undefined, undefined, undefined, '/customer-db')}
                        {renderCard('Asset Details', assets, 'Products Created', undefined, undefined, undefined, undefined, '/asset-db')}
                    </>
                ) : (
                    /* Else, render cards based on conditions */
                    <>
                        {createTicket && renderCard('Ticket Details', ticketCount, 'Total Tickets', ticketStatus, 'Open Tickets', closedTicket, 'Closed Tickets', '/create-ticket')}
                        {createClient && renderCard('Customer Details', customerDetails, 'Total Customers', undefined, undefined, undefined, undefined, '/customer-db')}
                        {createAsset && renderCard('Asset Details', assets, 'Products Created', undefined, undefined, undefined, undefined, '/asset-db')}
                    </>
                )}
            </div>
        );
    };
    


    return (
        <div className='text-gray-300 md:mx-[40%] lg:mx-[30%] md:w-[70%] mb-24 md:mb-0'>
            <div className='md:hidden gap-2 flex justify-between items-center bg-white sticky top-0 z-30'>
                <img src="/src/assets/logo.jpeg" alt="Logo..." className='w-24' />
                <div className='flex gap-2 items-center px-3'>
                    <Edit />
                    <span className='text-black'><Link to="/Server/Home">Edit Profile</Link></span>
                </div>
            </div>

            <div className='flex flex-col md:w-fit md:mt-5 sticky top-12 z-10'>
                <div className='flex gap-3 md:w-fit w-screen px-6 py-3 md:py-0 md:p-6 items-center border-customColor border-b-[3px]  bg-cardcolor  bg-cardBlack/ shadow-lg m-auto md:m-0 md:rounded-xl'>
                    <div className='user'>
                        <User size='130' color='rgb(0 197 255)' />
                        <div className='px-8'>
                            <h1 className='text-2xl text-black'>{userName}</h1>
                            <h4 className='text-customColor'>{role}</h4>
                        </div>
                    </div>
                    <div className=''>
                        <div className='flex md:flex-row md:text-2xl md:my-4'>
                            <label className='text-black'>Name:</label>
                            <span className='text-customColor'>{currentUser}</span>
                        </div>
                        <div className='flex md:flex-row md:text-2xl md:my-4'>
                            <label className='text-black whitespace-nowrap'>Phone no:</label>
                            <span className='text-customColor'>{phone}</span>
                        </div>
                        <div className='flex md:flex-row md:text-2xl md:my-4'>
                            <label className='text-black'>Email:</label>
                            <span className='whitespace-nowrap text-customColor'>{email}</span>
                        </div>
                    </div>
                </div>
            </div>

            {renderCards()}
        </div>
    );
}

export default Userdetails;
