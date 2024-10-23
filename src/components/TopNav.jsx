import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo';
import User from '../assets/User';

function TopNav() {

    const color = "black"
    const [pop, setPop] = useState(false);

    const popUp = () => {
        setPop(!pop);
        navigator.vibrate(60);
    };

    return (
        <div className='hidden md:flex text-black bg-[#ffffff]   justify-between  items-center bg-[rgb(245 245 245)] sticky top-0 z-30'>
            <div className=''>
                {/* <Logo /> */}
                <img src="/src/assets/logo2.jpeg" alt="Logo..." className='w-[300px]'/>
            </div>
            <div>
                <ul className='flex gap-12 items-center font-semibold font-sans mr-14'>
                    <li><Link to="/server/Home">Home</Link></li>
                    <li><Link to="/updates">Updates</Link></li>
                    <div className='flex items-center gap-2'>
                        <User size={28} color={color} />
                        <li className='my-5 text-red-500 '><Link to="/">Logout</Link></li>
                    </div>
                </ul>
            </div>
        </div>
    );
}

export default TopNav;
