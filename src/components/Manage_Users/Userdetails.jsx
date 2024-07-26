import React, { useEffect, useState } from 'react';
import User from '../../assets/User'
import Edit from '../../assets/Edit'
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo'


function Userdetails() {
    // Total number of Users Admins and Technicians
    const [userCount, setUserCount] = useState(0);
    const [adminUsersCount, setAdminUsersCount] = useState(0);
    const [technicianUsersCount, setTechnicianUsersCount] = useState(0);

    useEffect(() => {
        const getUsers = localStorage.getItem("allUsers");
        const usersArray = getUsers ? JSON.parse(getUsers) : [];
        const adminUsers = usersArray.filter(user => user.role === 'admin');
        const technicianUsers = usersArray.filter(user => user.role === 'technician');
        setUserCount(usersArray.length);
        setAdminUsersCount(adminUsers.length);
        setTechnicianUsersCount(technicianUsers.length);
    }, []);

    const [currentUser, setCurrentuser] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [userName, setUsername] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        const currentUserdet = JSON.parse(localStorage.getItem("userDet"));
        setCurrentuser(currentUserdet.name);
        setPhone(currentUserdet.phoneNum);
        setEmail(currentUserdet.email);
        setUsername(currentUserdet.username);
        setRole(currentUserdet.role);
    }, []);

    const renderCard = (title, count1, label1, count2, label2, count3, label3) => (
        <div className="relative w-[90vw] md:w-72">
            <div className="w-[350px] /md:fit bg-cardcolor shadow-lg text-black rounded-lg transition-transform duration-300 transform rotate-0 z-30 p-2 font-semibold font-sans whitespace-nowrap">
                <h2 className='mt-1 m-auto w-fit text-xl'>{title}</h2>
                <div className="p-5 text-center flex gap-8 ">
                    <div className='flex flex-col items-center justify-center   rounded mx-auto'>
                        <h1 className='text-5xl mb-5 text-customColor font-bold'>{count1}</h1>
                        <span className='text-md '>{label1}</span>
                    </div>
                    {count2 !== undefined && (
                        <div className='flex flex-col items-center justify-center my-2  rounded mx-auto'>
                            <h1 className='text-5xl mb-5 text-customColor font-bold'>{count2}</h1>
                            <span className='text-md'>{label2}</span>
                        </div>
                    )}
                    {count3 !== undefined && (
                        <div className='flex flex-col items-center justify-center  rounded mx-auto'>
                            <h1 className='text-5xl mb-5 text-customColor font-bold'>{count3}</h1>
                            <span className='text-md'>{label3}</span>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );

    return (
        <div className='text-gray-300 md:mx-[25%] md:w-[70%]'>
            <div className='md:hidden gap-2 flex justify-between items-center bg-white sticky top-0 z-30 shadow-md'>
                <img src="/src/assets/logo.jpeg" alt="Logo..." className='w-24' />
                <div className='flex gap-2 items-center px-3'>
                    <Edit />
                    <span className='text-black'><Link to="/Server/Home">Edit Profile</Link></span>
                </div>
            </div>


            {userName === "Master" && (
                <div className=' flex flex-col w-fit mt-5'>
                    <div className='flex gap-3 w-fit px-6 md:p-6 items-center mt-8 bg-cardcolor shadow-lg m-auto md:m-0 rounded-xl'>
                        <div className='user'>
                            <User size='130' color='rgb(0 197 255)' />
                            <div className='px-8'>
                                <h1 className='text-2xl text-black'>{userName}</h1>
                                <h4 className='text-customColor'>{role}</h4>
                            </div>
                        </div>
                        <div className=''>
                            <div className='flex  md:flex-row md:text-2xl md:my-4'>
                                <label className='text-black '>Name:</label>
                                <span className='text-customColor'>{currentUser}</span>
                            </div>
                            <div className='flex  md:flex-row md:text-2xl md:my-4'>
                                <label className='text-black whitespace-nowrap'>Phone no:</label>
                                <span className=' text-customColor '>{phone}</span>
                            </div>
                            <div className='flex  md:flex-row md:text-2xl md:my-4'>
                                <label className='text-black '>Email:</label>
                                <span className='whitespace-nowrap text-customColor '>{email}@gmail.com</span>
                            </div>
                        </div>
                    </div>
                    <hr className='border-2 w-3/5 m-auto rounded-full my-8 md:hidden ' />

                    <div className='flex md:gap-20 gap-10 justify-center md:justify-start flex-wrap items-center mt-8 m-auto w-fit'>

                        {renderCard('User Details', userCount, 'Total users', adminUsersCount, 'Admins', technicianUsersCount, 'Technicians')}
                        {renderCard('Ticket Details', adminUsersCount, 'Total Tickets', technicianUsersCount, 'Open Tickets')}
                        {renderCard('Customer Details', adminUsersCount, 'Total Customers')}
                        {renderCard('Ticket Details', adminUsersCount, 'Admins', technicianUsersCount, 'Technicians')}
                        {renderCard('Asset Details', adminUsersCount, 'Categories Created', technicianUsersCount, 'Products Created')}
                        {renderCard('Finance Details', adminUsersCount, 'Settled Tickets', technicianUsersCount, 'Un-Settled Tickets')}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Userdetails;
