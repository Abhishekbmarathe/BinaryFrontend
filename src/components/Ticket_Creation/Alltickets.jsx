import React from 'react'
import Nav from '../TopNav';
import {useNavigate} from 'react-router-dom'

function Alltickets() {
    const navigate = useNavigate();
    const newTicket =()=>{
        navigate('/newticket')
    }




    return (
        <div>
            <Nav />
            <button
                className='bg-neutral-500 py-2 px-3 rounded-xl my-9 fixed bottom-0 right-8 flex justify-between w-20 items-center'
            onClick={() => newTicket()}
            >
                <span className='text-customColor font-bold text-xl'>+</span> New
            </button>
        </div>
    )
}

export default Alltickets
