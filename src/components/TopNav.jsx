import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function TopNav() {
  

    const [pop, setPop] = useState(false);

    const popUp = () => {
        setPop(!pop);
        navigator.vibrate(60);
    };

    return (
        <div className='hidden sm:flex text-white justify-between px-9 items-center bg-slate-500 py-5 sticky top-0 z-30'>
            <div>
                <h1 className='text-3xl font-bold'>Binary systems...</h1>
            </div>
            <div>
                <ul className='flex gap-12'>
                    <li><Link to="/server/Home">Home</Link></li>
                    <li><Link to="/updates">Updates</Link></li>
                    <li className='font-bold text-xl text-[#ff3f3f]'><Link to="/">Logout</Link></li>
                </ul>
            </div>
        </div>
    );
}

export default TopNav;
