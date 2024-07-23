import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Imag from '../../assets/img'
import Info from '../../assets/info'
import Serial from '../../assets/serial'

const BottomNavbar = () => {

    const navigate = useNavigate();
    const capturePhoto = () => {
        navigate('/capturePhoto')

    }

    return (
        <div className=' sm:hidden'>
            <div className='fixed bg-[#1d1b1b] bottom-0 py-2 overflow-y-auto w-full z-50'>
                <nav className='w-screen flex items-center justify-between px-10 py-2 '>
                    <button className='flex flex-col items-center'>
                        <Serial />
                        <span>Serial No.</span>
                    </button>
                    <button className='flex flex-col items-center'
                        onClick={capturePhoto}
                    >
                        <Imag />
                        <span>Image</span>
                    </button>
                    <button className='flex flex-col items-center'>
                        <Info />
                        <span>Info</span>

                    </button>
                </nav>
            </div>
        </div>
    );
};

export default BottomNavbar;
