// CapturePhoto.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CapturePhoto() {
    const navigate = useNavigate();

    return (
        <div>
            <h1 className='w-fit m-auto font-bold text-2xl mt-3'>Storing <span className='text-customColor'>Log</span></h1>
            <button
                className='bg-neutral-500 py-2 px-3 rounded-xl my-9 fixed bottom-0 right-8 flex justify-between w-20 items-center'
                onClick={() => navigate('/add-record')}
            >
                <span className='text-customColor font-bold text-xl'>+</span> New
            </button>
        </div>
    );
}

export default CapturePhoto;
