import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo';

function TopNav() {


    const [pop, setPop] = useState(false);

    const popUp = () => {
        setPop(!pop);
        navigator.vibrate(60);
    };

    return (
        <div className='hidden md:flex text-black /bg-[#ffffff]   justify-between  items-center bg-[rgb(245 245 245)] sticky top-0 z-30'>
            <div className=''>
                <Logo/>
            </div>
            <div>
                <ul className='flex gap-12 font-bold text-xl mr-14'>
                    <li><Link to="/server/Home">Home</Link></li>
                    <li><Link to="/updates">Updates</Link></li>
                    {/* <li className='font-bold text-xl text-[#ff3f3f]'><Link to="/">Logout</Link></li> */}
                </ul>
            </div>
        </div>
    );
}

export default TopNav;
