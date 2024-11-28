import React from 'react'
import Camera from '../../assets/camera'
import Attach from '../../assets/Attachment';

const TicketImg = () => {
    return (
        <div className='flex gap-4'>
            <button className='shadow-customShadow py-2 px-4 flex items-center gap-2 rounded-sm bg-gray-100'>
                <Camera />
                <span>Capture</span>
            </button>
            <button className='flex items-center shadow-customShadow py-2 px-4 rounded-sm gap-2 bg-gray-100'>
                <div className='bg-customColor block w-fit rounded-md p-[1px]'>
                    <Attach />
                </div>
                <span>Attach</span>
            </button>
        </div>
    )
}

export default TicketImg
