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
        const getUsers = localStorage.getItem("allUsers");
        const usersArray = getUsers ? JSON.parse(getUsers) : [];
        const adminUsers = usersArray.filter(user => user.role === 'admin');
        const technicianUsers = usersArray.filter(user => user.role === 'technician');
        setUserCount(usersArray.length);
        setAdminUsersCount(adminUsers.length);
        setTechnicianUsersCount(technicianUsers.length);
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
                                alert("Something went wrong fetching all assets.");
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
                                alert("Something went wrong fetching all clients.");
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
                                alert("Something went wrong fetching all tickets.");
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


    const renderCard = (title, count1, label1, count2, label2, count3, label3) => (
        <div className="relative md:w-72">
            <div className="w-[350px] /md:fit bg-cardcolor shadow-lg border-b-[5px] border-customColor text-black rounded-lg transition-transform duration-300 transform rotate-0 z-30 p-2 font-semibold font-sans whitespace-nowrap">
                <h2 className='mt-1 m-auto w-fit text-xl'>{title}</h2>
                <div className="p-5 text-center flex gap-8 ">
                    <div className='flex flex-col items-center justify-center rounded mx-auto'>
                        <h1 className='text-5xl mb-5 text-customColor font-bold'>{count1}</h1>
                        <span className='text-md '>{label1}</span>
                    </div>
                    {count2 !== undefined && (
                        <div className='flex flex-col items-center justify-center my-2 rounded mx-auto'>
                            <h1 className='text-5xl mb-5 text-customColor font-bold'>{count2}</h1>
                            <span className='text-md'>{label2}</span>
                        </div>
                    )}
                    {count3 !== undefined && (
                        <div className='flex flex-col items-center justify-center rounded mx-auto'>
                            <h1 className='text-5xl mb-5 text-customColor font-bold'>{count3}</h1>
                            <span className='text-md'>{label3}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderCards = () => {
        return (
            <div className='flex md:gap-20 gap-10 justify-center md:justify-start flex-wrap items-center mt-8 m-auto w-fit'>


                {/* If user is "Master", render all cards without conditions */}
                {userName === "Master" ? (
                    <>
                        {renderCard('User Details', userCount, 'Total users', adminUsersCount, 'Admins', technicianUsersCount, 'Technicians')}
                        {renderCard('Ticket Details', adminUsersCount, 'Total Tickets', technicianUsersCount, 'Open Tickets')}
                        {renderCard('Customer Details', adminUsersCount, 'Total Customers')}
                        {renderCard('Asset Details', adminUsersCount, 'Categories Created', technicianUsersCount, 'Products Created')}
                    </>
                ) : (
                    /* Else, render cards based on conditions */
                    <>
                        {createTicket && renderCard('Ticket Details', adminUsersCount, 'Total Tickets', technicianUsersCount, 'Open Tickets')}
                        {createClient && renderCard('Customer Details', adminUsersCount, 'Total Customers')}
                        {createAsset && renderCard('Asset Details', adminUsersCount, 'Categories Created', technicianUsersCount, 'Products Created')}
                    </>
                )}
            </div>
        );
    };


    return (
        <div className='text-gray-300 md:mx-[40%] lg:mx-[30%] md:w-[70%]'>
            <div className='md:hidden gap-2 flex justify-between items-center bg-white sticky top-0 z-30'>
                <img src="/src/assets/logo.jpeg" alt="Logo..." className='w-24' />
                <div className='flex gap-2 items-center px-3'>
                    <Edit />
                    <span className='text-black'><Link to="/Server/Home">Edit Profile</Link></span>
                </div>
            </div>

            <div className='flex flex-col w-fit md:mt-5 sticky top-12 z-10'>
                <div className='flex gap-3 md:w-fit w-screen px-6 py-3 md:py-0 md:p-6 items-center border-customColor border-b-[3px]  md:bg-cardcolor  bg-cardBlack shadow-lg m-auto md:m-0 md:rounded-xl'>
                    <div className='user'>
                        <User size='130' color='rgb(0 197 255)' />
                        <div className='px-8'>
                            <h1 className='text-2xl text-white md:text-black'>{userName}</h1>
                            <h4 className='text-customColor'>{role}</h4>
                        </div>
                    </div>
                    <div className=''>
                        <div className='flex md:flex-row md:text-2xl md:my-4'>
                            <label className='text-white md:text-black'>Name:</label>
                            <span className='text-customColor'>{currentUser}</span>
                        </div>
                        <div className='flex md:flex-row md:text-2xl md:my-4'>
                            <label className='text-white md:text-black whitespace-nowrap'>Phone no:</label>
                            <span className='text-customColor'>{phone}</span>
                        </div>
                        <div className='flex md:flex-row md:text-2xl md:my-4'>
                            <label className='text-white md:text-black'>Email:</label>
                            <span className='whitespace-nowrap text-customColor'>{email}@gmail.com</span>
                        </div>
                    </div>
                </div>
            </div>

            {renderCards()}
        </div>
    );
}

export default Userdetails;
