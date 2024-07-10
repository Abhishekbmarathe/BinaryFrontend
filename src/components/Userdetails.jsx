import React, { useEffect, useState } from 'react'

function Userdetails() {

    // total number of Users Admins and Technicians
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

    const [currentUser, setCurrentuser] = useState(0);
    const [phone, setPhone] = useState(0);
    const [email, setEmail] = useState(0);
    const [userName, setUsername] = useState(0);
    const [role, setRole] = useState(0);
    useEffect(() => {
        const currentUserdet = JSON.parse(localStorage.getItem("userDet"));
        setCurrentuser(currentUserdet.name)
        setPhone(currentUserdet.phoneNum)
        setEmail(currentUserdet.email)
        setUsername(currentUserdet.username)
        setRole(currentUserdet.role)
    })

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
                        <span className='mx-3 '>{email}@gmail.com  </span>
                    </div>
                </div>
            </div>
            <div className='px-8'>
                <h1 className='text-2xl'>{userName}</h1>
                <h4 className='text-red-400'>{role}</h4>
            </div>


            <hr className='border-2 w-3/5 m-auto rounded-full my-8 sm:w-[100%]' />

            {userName === "Master" && (
                <div className='sm:flex sm:gap-3 sm:flex-wrap items-center  m-auto w-fit'>
                    <div className='rounded-xl border-2 border-green-400 w-[94vw] m-auto  px-3 my-3 sm:max-w-96'>
                        <h2 className=' mt-1 italic'>User Details</h2>
                        <div className='flex justify-around py-2 '>
                            <div className='flex flex-col items-center justify-center'>
                                <h1 className='text-5xl font-bold '>{userCount}</h1>
                                <span className='text-sm'>Total users</span>
                            </div>
                            <div className='flex flex-col items-center justify-center'>
                                <h1 className='text-5xl font-bold '>{adminUsersCount}</h1>
                                <span className='text-sm'>Admins</span>
                            </div>
                            <div className='flex flex-col items-center justify-center'>
                                <h1 className='text-5xl font-bold '>{technicianUsersCount}</h1>
                                <span className='text-sm'>Technicians</span>
                            </div>
                        </div>
                    </div>
                    <div className='rounded-xl border-2 border-yellow-400 w-[94vw] m-auto  px-3 my-3 sm:max-w-96'>
                        <h1 className=' mt-1 italic'>Ticket Details</h1>
                        <div className='flex justify-around list-none'>
                            <div className='flex flex-col items-center justify-center'>
                                <h1 className='text-5xl font-bold '>{adminUsersCount}</h1>
                                <span className='text-sm'>Total Ticket</span>
                            </div>
                            <div className='flex flex-col items-center justify-center'>
                                <h1 className='text-5xl font-bold '>{technicianUsersCount}</h1>
                                <span className='text-sm'>Open Tickets</span>
                            </div>
                        </div>

                    </div>
                    <div className='rounded-xl border-2 border-green-600 w-[94vw] m-auto  px-3 my-3 sm:max-w-96'>
                        <h1 className=' mt-1 italic'>Finance Details</h1>
                        <div className='flex justify-around list-none'>
                            <div className='flex flex-col items-center justify-center'>
                                <h1 className='text-5xl font-bold '>{adminUsersCount}</h1>
                                <span className='text-sm'>Settled Tickets</span>
                            </div>
                            <div className='flex flex-col items-center justify-center'>
                                <h1 className='text-5xl font-bold '>{technicianUsersCount}</h1>
                                <span className='text-sm'>Un-Settled Tickets</span>
                            </div>
                        </div>

                    </div>
                    <div className='rounded-xl border-2 border-gray-400 w-[94vw] m-auto  px-3 my-3 sm:max-w-96'>
                        <h1 className=' mt-1 italic'>Customer Details</h1>
                        <div className='flex justify-around list-none'>
                            <div className='flex flex-col items-center justify-center'>
                                <h1 className='text-5xl font-bold '>{adminUsersCount}</h1>
                                <span className='text-sm'>Total Customers</span>
                            </div>
                        </div>

                    </div>
                    <div className='rounded-xl border-2  w-[94vw] m-auto  px-3 my-3 sm:max-w-96'>
                        <h1 className=' mt-1 italic'>Ticket Details</h1>
                        <div className='flex justify-around list-none'>
                            <div className='flex flex-col items-center justify-center'>
                                <h1 className='text-5xl font-bold '>{adminUsersCount}</h1>
                                <span className='text-sm'>Admins</span>
                            </div>
                            <div className='flex flex-col items-center justify-center'>
                                <h1 className='text-5xl font-bold '>{technicianUsersCount}</h1>
                                <span className='text-sm'>Technicians</span>
                            </div>
                        </div>

                    </div>
                    <div className='rounded-xl border-2 border-purple-400 w-[94vw] m-auto  px-3 my-3 sm:max-w-96 mb-28 sm:mb-3'>
                        <h1 className=' mt-1 italic'>Asset Details</h1>
                        <div className='flex justify-around list-none'>
                            <div className='flex flex-col items-center justify-center'>
                                <h1 className='text-5xl font-bold '>{adminUsersCount}</h1>
                                <span className='text-sm'>Categories Created</span>
                            </div>
                            <div className='flex flex-col items-center justify-center'>
                                <h1 className='text-5xl font-bold '>{technicianUsersCount}</h1>
                                <span className='text-sm'>Products Created</span>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>

    )
}

export default Userdetails
