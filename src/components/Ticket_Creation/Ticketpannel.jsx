import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Settings from './Settings';


function Ticketpannel() {
    // const color = "rgb(0 197 255)"

    return (
        <div className=''>
            <div className="hidden md:block bg-panel-gradient/ shadow-md shadow-gray-300 bg-white text-black w-fit text-center p-6 h-screen  overflow-auto">
                {/* <h1 className="relative z-10 font-semibold font-sans text-3xl">Ticket Setings</h1> */}
                <div className=" ">
                    <div className="">
                        <ul>
                          <Settings />
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ticketpannel;
