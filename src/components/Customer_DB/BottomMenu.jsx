import React from 'react';
import { useNavigate } from 'react-router-dom';
import Imag from '../../assets/img';
import Info from '../../assets/info';
import Serial from '../../assets/serial';

const BottomNavbar = () => {
    const navigate = useNavigate();

    const capturePhoto = () => {
        navigate('/capturePhoto');
    };

    return (
        <div>
            <div className='fixed bg-[#1d1b1b] bottom-0 py-2 w-full sm:max-w-[48%] left-1/2 -translate-x-1/2  z-50'>
                <nav className='w-full flex items-center justify-between px-5 py-2 md:px-10'>
                    <button className='flex flex-col items-center text-white hover:opacity-80 transition-all duration-200'>
                        <Serial className="w-6 h-6 md:w-8 md:h-8" />
                        <span className="text-xs md:text-sm">Serial No.</span>
                    </button>
                    <button
                        className='flex flex-col items-center text-white hover:opacity-80 transition-all duration-200'
                        onClick={capturePhoto}
                    >
                        <Imag className="w-6 h-6 md:w-8 md:h-8" />
                        <span className="text-xs md:text-sm">Image</span>
                    </button>
                    <button className='flex flex-col items-center text-white hover:opacity-80 transition-all duration-200'>
                        <Info className="w-6 h-6 md:w-8 md:h-8" />
                        <span className="text-xs md:text-sm">Info</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default BottomNavbar;
