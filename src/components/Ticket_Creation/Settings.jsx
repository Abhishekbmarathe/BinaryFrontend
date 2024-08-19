import React, { useState } from 'react'
import Arrowdown from '../../assets/Arrowdown'
import Arrowup from '../../assets/Arrowup'


function Settings() {
  const [toggle, setToggle] = useState(false);
  const changeToggle = () => {
    setToggle(!toggle);
  }

  return (
    <div>
      <h1 className='my-6 font-semibold text-3xl font-sans text-center sticky top-0 z-10 bg-[#f5f5f5] text-customColor'>Settings</h1>

      <div className='text-customColor font-semibold font-sans flex gap-3 relative justify-center px-3'>
        <label htmlFor="">Select a Field: </label>
        <button onClick={changeToggle}>
          <Arrowdown />
        </button>
        {/* <button onClick={changeToggle}>
          <Arrowup />
        </button> */}
      </div>
      {toggle && (
        <div className='absolute shadow-2xl  p-5 z-20 top-15 right-4 flex flex-col items-start'>
          <button onClick={()=>{setToggle(!toggle)}} className='p-2 m-2'>Help topic</button>
          <button onClick={()=>{setToggle(!toggle)}} className='p-2 m-2'>Department</button>
          <button onClick={()=>{setToggle(!toggle)}} className='p-2 m-2'>SLA Plan</button>
          <button onClick={()=>{setToggle(!toggle)}} className='p-2 m-2'>Canned Response</button>
        </div>
      )}
    </div>
  )
}

export default Settings
