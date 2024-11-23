import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Settings from './Settings';
import Edit from '../../assets/Edit'

function Ticketpannel() {
    // const color = "rgb(0 197 255)"
    const [zvalue, setZvalue] = useState(true);


    return (
        <div className=''>
            <div className="hidden md:block bg-panel-gradient/ shadow-md shadow-gray-300 bg-white text-black w-fit text-center p-6 h-screen  overflow-auto relative">
                <div className='w-full flex justify-end px-5'>
                    <button className={`px-3 py-2  ${zvalue ? '' : 'bg-blue-400'} transition-all border-black rounded border `} onClick={() => setZvalue(!zvalue)}>
                        <Edit />
                    </button>
                </div>
                <div className=" ">
                    <div className="">
                        <ul>
                            <div className={`h-full bg-white w-full opacity-10 ${zvalue ? 'z-10' : '-z-10'} absolute`}> </div>
                            <Settings />
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ticketpannel;
