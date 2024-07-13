import React, { useEffect, useState } from 'react';

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
        <div className="relative w-[90vw] sm:w-72">
            <div className="w-full  bg-gray-800 /shadow-custom-red rounded-lg transition-transform duration-300 transform rotate-0 z-30">
                    <h2 className='mt-1 italic font-extrabold'>{title}</h2>
                <div className="p-5 text-center flex ">
                    <div className='flex flex-col items-center justify-center shadow-lg w-[80px] rounded mx-auto'>
                        <h1 className='text-5xl font-bold'>{count1}</h1>
                        <span className='text-sm'>{label1}</span>
                    </div>
                    {count2 !== undefined && (
                        <div className='flex flex-col items-center justify-center shadow-lg my-2 w-[80px] rounded mx-auto'>
                            <h1 className='text-5xl font-bold'>{count2}</h1>
                            <span className='text-sm'>{label2}</span>
                        </div>
                    )}
                    {count3 !== undefined && (
                        <div className='flex flex-col items-center justify-center shadow-lg w-[80px] rounded mx-auto'>
                            <h1 className='text-5xl font-bold'>{count3}</h1>
                            <span className='text-sm'>{label3}</span>
                        </div>
                    )}
                </div>
            </div>
           
        </div>
    );

    return (
        <div className='text-gray-300 sm:mx-[25%] sm:w-[70%]'>
            <div className='flex gap-3 w-fit px-6 items-center mt-8'>
                <div className='user'>
                    <lord-icon
                        className="user"
                        src="https://cdn.lordicon.com/hrjifpbq.json"
                        trigger="hover"
                        colors="primary:#d7d7d7ba"
                    >
                    </lord-icon>
                </div>
                <div>
                    <div className='flex flex-col sm:flex-row sm:text-2xl sm:my-4'>
                        <label className='text-red-400'>Name:</label>
                        <span className='mx-3'>{currentUser}</span>
                    </div>
                    <div className='flex flex-col sm:flex-row sm:text-2xl sm:my-4'>
                        <label className='text-red-400'>Phone no:</label>
                        <span className='mx-3 '>{phone}</span>
                    </div>
                    <div className='flex flex-col sm:flex-row sm:text-2xl sm:my-4'>
                        <label className='text-red-400'>Email:</label>
                        <span className='mx-3 '>{email}@gmail.com</span>
                    </div>
                </div>
            </div>
            <div className='px-8'>
                <h1 className='text-2xl'>{userName}</h1>
                <h4 className='text-red-400'>{role}</h4>
            </div>

            <hr className='border-2 w-3/5 m-auto rounded-full my-8 sm:w-[100%] ' />

            {userName === "Master" && (
                <div className='flex sm:gap-20 gap-10 justify-center flex-wrap items-center m-auto w-fit'>
                    {renderCard('User Details', userCount, 'Total users', adminUsersCount, 'Admins', technicianUsersCount, 'Technicians')}
                    {renderCard('Ticket Details', adminUsersCount, 'Total Tickets', technicianUsersCount, 'Open Tickets')}
                    {renderCard('Finance Details', adminUsersCount, 'Settled Tickets', technicianUsersCount, 'Un-Settled Tickets')}
                    {renderCard('Customer Details', adminUsersCount, 'Total Customers')}
                    {renderCard('Ticket Details', adminUsersCount, 'Admins', technicianUsersCount, 'Technicians')}
                    {renderCard('Asset Details', adminUsersCount, 'Categories Created', technicianUsersCount, 'Products Created')}
                </div>
            )}
        </div>
    );
}

export default Userdetails;
