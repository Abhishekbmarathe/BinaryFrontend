import React, { useState } from 'react';

function Settings() {
  // Initialize state for different settings
  const [topic, setToggle] = useState('Help topic');
  const [addTopic, setAdd] = useState('');
  const [helpTopics, setHelpTopics] = useState([]);
  const [slaPlans, setSlaPlans] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cannedResponses, setCannedResponses] = useState([]);

  // Function to handle adding a topic to the appropriate list
  const handleAddTopic = () => {
    if (addTopic.trim()) {
      if (topic === 'Help topic') {
        setHelpTopics([...helpTopics, addTopic]);
      } else if (topic === 'SLA Plan') {
        setSlaPlans([...slaPlans, addTopic]);
      } else if (topic === 'Department') {
        setDepartments([...departments, addTopic]);
      } else if (topic === 'Canned Responses') {
        setCannedResponses([...cannedResponses, addTopic]);
      }
      setAdd(''); // Clear the input box
    }
  };

  // Function to display the appropriate list based on the selected topic
  const getCurrentList = () => {
    if (topic === 'Help topic') {
      return helpTopics;
    } else if (topic === 'SLA Plan') {
      return slaPlans;
    } else if (topic === 'Department') {
      return departments;
    } else if (topic === 'Canned Responses') {
      return cannedResponses;
    }
  };

  // Function to handle removing a topic from the appropriate list
  const handleRemoveTopic = (index) => {
    if (topic === 'Help topic') {
      setHelpTopics(helpTopics.filter((_, i) => i !== index));
    } else if (topic === 'SLA Plan') {
      setSlaPlans(slaPlans.filter((_, i) => i !== index));
    } else if (topic === 'Department') {
      setDepartments(departments.filter((_, i) => i !== index));
    } else if (topic === 'Canned Responses') {
      setCannedResponses(cannedResponses.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      <h1 className='my-6 font-semibold text-3xl font-sans text-center sticky top-0 z-10 bg-[#f5f5f5]'>
        Ticket<span className='text-customColor'> Settings</span>
      </h1>

      <button className='bg-slate-400 py-2 px-3 rounded-xl my-9 fixed bottom-0 right-8  w-20 items-center text-white'>Save</button>

      <div className='text-customColor font-semibold font-sans flex gap-3 relative justify-center px-3'>
        <div className='px-2 my-5 flex w-full overflow-auto'>
          <button
            onClick={() => setToggle('Help topic')}
            className={`p-2 mx-1 whitespace-nowrap border transition hover:border-none border-gray-400 px-3 rounded-lg ${topic === 'Help topic' ? 'bg-customColor text-white border-none' : 'hover:bg-customColor hover:text-white'}`}
          >
            Help topic
          </button>
          <button
            onClick={() => setToggle('SLA Plan')}
            className={`p-2 mx-1 whitespace-nowrap border transition hover:border-none border-gray-400 px-3 rounded-lg ${topic === 'SLA Plan' ? 'bg-customColor text-white border-none' : 'hover:bg-customColor hover:text-white'}`}
          >
            SLA Plan
          </button>
          <button
            onClick={() => setToggle('Department')}
            className={`p-2 mx-1 whitespace-nowrap border transition hover:border-none border-gray-400 px-3 rounded-lg ${topic === 'Department' ? 'bg-customColor text-white border-none' : 'hover:bg-customColor hover:text-white'}`}
          >
            Department
          </button>
          <button
            onClick={() => setToggle('Canned Responses')}
            className={`p-2 mx-1 whitespace-nowrap border transition hover:border-none border-gray-400 px-3 rounded-lg ${topic === 'Canned Responses' ? 'bg-customColor text-white border-none' : 'hover:bg-customColor hover:text-white'}`}
          >
            Canned Responses
          </button>
        </div>
      </div>

      <div className='border border-gray-400 w-11/12 m-auto rounded-md hover:border-customColor flex items-center gap-3'>
        <input
          type="text"
          className='bg-transparent border-none border-gray-400 p-3 w-11/12 block rounded-md focus:border-customColor outline-none'
          placeholder={`Enter ${topic}`}
          value={addTopic}
          onChange={(e) => setAdd(e.target.value)}
        />
        <button onClick={handleAddTopic} className="p-2 px-5 text-customColor rounded-md">+</button>
      </div>

      <hr className='w-1/2 h-1 bg-gray-500 m-auto my-6 rounded-lg' />

      <p className='px-5'>{topic}</p>
      <ul className='px-5'>
        {getCurrentList().map((item, index) => (
          <li
            key={index}
            className='bg-gray-400 my-1 p-2 w-36 text-slate-900 rounded-lg'
          >
            {item}
            <button onClick={() => handleRemoveTopic(index)} className='text-white float-end text-xl '>
              x
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Settings;
