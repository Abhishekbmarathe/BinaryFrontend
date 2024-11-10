import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../modules/Api';
import Close from '../../assets/Close';

function Settings() {
  const [topic, setToggle] = useState('Help');
  const [helpTopics, setHelpTopics] = useState([]);
  const [slaPlans, setSlaPlans] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cannedResponses, setCannedResponses] = useState([]);
  const [creator, setCreator] = useState(JSON.parse(localStorage.getItem('userDet')).username);


  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();

  // Function to navigate to Home
  const home = () => {
    navigate('/Server/Home');
    navigator.vibrate(60); // Vibrates for 60ms (may not work in all browsers)
  };

  // Fetch settings from the API on component mount
  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        const response = await axios.get(api + 'api/getTicketSetting');

        const settingsData = response.data || [];

        // Filter the settings data based on the 'type' field
        const helpTopics = settingsData.filter(item => item.type === 'Help').map(item => item.data);
        const slaPlans = settingsData.filter(item => item.type === 'SLA').map(item => item.data);
        const departments = settingsData.filter(item => item.type === 'Department').map(item => item.data);
        const cannedResponses = settingsData.filter(item => item.type === 'Canned').map(item => item.data);

        // Set state with the filtered data
        setHelpTopics(helpTopics);
        setSlaPlans(slaPlans);
        setDepartments(departments);
        setCannedResponses(cannedResponses);
      } catch (error) {
        console.error('Error fetching settings data:', error);
      }
    };

    fetchSettingsData();
  }, []);




  // Function to handle adding topics dynamically
  const handleAddTopic = (data) => {
    const { addTopic } = data;
    if (addTopic.trim()) {
      if (topic === 'Help') setHelpTopics([...helpTopics, addTopic]);
      if (topic === 'SLA') setSlaPlans([...slaPlans, addTopic]);
      if (topic === 'Department') setDepartments([...departments, addTopic]);
      if (topic === 'Canned') setCannedResponses([...cannedResponses, addTopic]);

      setValue('addTopic', ''); // Clear the input box
    }
  };

  // Get the current list of topics based on selected category
  const getCurrentList = () => {
    switch (topic) {
      case 'Help': return helpTopics;
      case 'SLA': return slaPlans;
      case 'Department': return departments;
      case 'Canned': return cannedResponses;
      default: return [];
    }
  };

  // Remove topic from the selected category list
  const handleRemoveTopic = (index) => {
    if (topic === 'Help') setHelpTopics(helpTopics.filter((_, i) => i !== index));
    if (topic === 'SLA') setSlaPlans(slaPlans.filter((_, i) => i !== index));
    if (topic === 'Department') setDepartments(departments.filter((_, i) => i !== index));
    if (topic === 'Canned') setCannedResponses(cannedResponses.filter((_, i) => i !== index));
  };

  // Handle form submission to append new settings data
  const onSubmit = async () => {
    const settingsData = [
      ...helpTopics.map(item => ({ type: 'Help', data: item })),
      ...slaPlans.map(item => ({ type: 'SLA', data: item })),
      ...departments.map(item => ({ type: 'Department', data: item })),
      ...cannedResponses.map(item => ({ type: 'Canned', data: item })),
    ];

    try {
      // Use POST to append new data while keeping the existing settings intact
      await axios.post(api + 'api/updateTicketSettings', settingsData,
        {
          headers: {
            'Content-Type': 'application/json', // Specify the content type
            'updatedby': creator // Add the `creater` value in the headers
          }
        }
      );
      alert('Settings updated successfully!');
      window.location.reload(); // Refresh after submission
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div>
      <h1 className='my-6/ font-semibold text-3xl font-sans  z-10 bg-[#f5f5f5]/'>
        Ticket <span className='text-customColor'>Settings</span>
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className='px-3 /md:w-1/2 md:m-auto/ w-full'>
        <div className='text-customColor font-semibold font-sans flex gap-3 relative justify-center'>
          <div className='my-5 flex w-full overflow-auto'>
            {['Help', 'SLA', 'Department', 'Canned'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setToggle(type)}
                className={`p-2 mx-1 whitespace-nowrap border transition hover:border-none border-gray-400 px-3 rounded-lg ${topic === type ? 'bg-customColor text-white border-none' : 'hover:bg-customColor hover:text-white'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className=' rounded-md flex items-center gap-3'>
          <input
            type="text"
            className='bg-transparent  px-3 border-2 py-2  w-11/12 block rounded-md focus:border-customColor outline-none border-gray-300'
            placeholder={`Enter ${topic}`}
            {...register('addTopic')}
          />
          <button
            type="button"
            onClick={handleSubmit(handleAddTopic)}
            className="py-2  px-5 text-white   rounded-md bg-blue-400 hover:bg-blue-500"
          >
            Add
          </button>
        </div>

        <hr className='w-1/2 h-[2px] bg-gray-500 m-auto my-6 rounded-lg' />

        {/* <p className='px-5'>{topic}</p> */}
        <ul className='px-5'>
          {getCurrentList().map((item, index) => (
            <li key={index} className='border my-1 p-2 border-gray-500 rounded-lg flex justify-between items-center w-1/2'>
              {item}
              <button
                type="button"
                onClick={() => handleRemoveTopic(index)}
                className='text-white text-xl bg-red-600 rounded-[3px]'
              >
                <Close />
              </button>
            </li>
          ))}
        </ul>

        <button type="submit" className='bg-blue-400 py-1 px-3 w-full rounded my-9  items-center text-white hover:bg-blue-500'>
          Save
        </button>
      </form>

      <div className='fixed md:hidden bottom-0 py-2 w-full'>
        <nav className='w-screen flex items-center justify-center px-16 py-2'>
          <button onClick={home}>
            <lord-icon src="https://cdn.lordicon.com/cnpvyndp.json" trigger="click" colors="primary:black" />
          </button>
        </nav>
      </div>
    </div>
  );
}

export default Settings;
