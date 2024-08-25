import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ticketSettings from '../modules/getTicketSetting';

const NewTicket = () => {

  const { handleSubmit, control, register, setValue } = useForm();
  const [step, setStep] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [ticketStatus, setStatus] = useState('Open')
  const [companyType, setCompanyType] = useState('Call Based');

  const [helpTopics, setHelpTopics] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [slaPlans, setSlaPlans] = useState([]);
  const [cannedResponse, setCannedResponses] = useState([]);
  const [creator, setCreator] = useState(JSON.parse(localStorage.getItem('userDet')).username);

  ticketSettings()

  useEffect(() => {
    const storedSettings = localStorage.getItem("TicketSettings");
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);

        if (Array.isArray(parsedSettings)) {
          // Filter and set the settings based on type
          setHelpTopics(parsedSettings.filter(setting => setting.type === 'Help topic').map(setting => setting.data));
          setDepartments(parsedSettings.filter(setting => setting.type === 'Department').map(setting => setting.data));
          setSlaPlans(parsedSettings.filter(setting => setting.type === 'SLA Plan').map(setting => setting.data));
          setCannedResponses(parsedSettings.filter(setting => setting.type === 'Canned Responses').map(setting => setting.data));
        }
      } catch (error) {
        console.error("Failed to parse settings from localStorage:", error);
      }
    }
  }, []);


  const navigate = useNavigate();


  const checkCompany = (isChecked) => {
    const type = isChecked ? 'Contract Based' : 'Call Based';
    console.log(type)
    setCompanyType(type);
  };


  const checkStatus = (val) => {
    console.log(val)
    setStatus('Assigned')
  }

  useEffect(() => {
    setValue('ticketStatus', ticketStatus)
  }, [ticketStatus, setValue])


  const [users, setUsers] = useState([]); // Collaborators
  const [ticketAss, setAssign] = useState([]); // Technicians

  useEffect(() => {
    const data = localStorage.getItem("onlyUsers");
    if (data) {
      const parsedData = JSON.parse(data);
      const adminUsers = parsedData.filter((item) => item.role === "admin").map((item) => item.username);
      const technicianUsers = parsedData.filter((item) => item.role === "technician").map((item) => item.username);

      setUsers(adminUsers);
      setAssign(technicianUsers);
    }
  }, []);


  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleUserSelection = (user) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(user)
        ? prevSelected.filter((u) => u !== user)
        : [...prevSelected, user]
    );
  };

  const currentDateTime = new Date();
  console.log(currentDateTime)

  const onSubmit = (data) => {
    data.collaborator = selectedUsers;
    data.senderCompanyType = companyType;

    // Get current date and time
    const currentDateTime = new Date();

    // Format the date as dd-mm-yyyy hh:mm:ss
    const formattedDate = `${String(currentDateTime.getDate()).padStart(2, '0')}/${String(currentDateTime.getMonth() + 1).padStart(2, '0')}/${currentDateTime.getFullYear()} ${String(currentDateTime.getHours()).padStart(2, '0')}:${String(currentDateTime.getMinutes()).padStart(2, '0')}:${String(currentDateTime.getSeconds()).padStart(2, '0')}`;

    // Combine form data with the contacts array and ensure the key matches the schema
    const formData = {
      ...data,
      contact: contacts,  // Use `contact` to match your schema
      updatedDate: formattedDate,  // Use formatted date and time
    };

    console.log(formData);

    axios.post('https://binarysystemsbackend-mtt8.onrender.com/api/createTicket', formData)
      .then((response) => {
        console.log('Success:', response.data);
        alert('Ticket Created Successfully');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error Creating Ticket');
      });
  };




  const [contacts, setContacts] = useState([{ name: '', number: '' }]);

  const handleAddContact = () => {
    setContacts([...contacts, { name: '', number: '' }]);
  };

  const handleRemoveContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleContactChange = (index, field, value) => {
    const newContacts = contacts.map((contact, i) =>
      i === index ? { ...contact, [field]: value } : contact
    );
    setContacts(newContacts);
  };



  return (
    <div className="min-h-screen">
      <h1 className='my-6 font-bold text-3xl  text-center sticky top-0 z-10 bg-[#f5f5f5]'>New<span className='text-customColor'>Ticket</span></h1>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        {step === 1 && (
          <div className="w-full max-w-md p-8 rounded-lg mb-2">
            <label className="block text-2xl mb-6">Customer Info</label>
            <div className="mb-4">
              <label htmlFor="" className='font-semibold'>Company Type:</label>
              <div className="flex items-center mb-2">
                <span className="mr-2">Call Based</span>
                <input
                  type="checkbox"
                  // {...register('senderCompanyType')}
                  className="toggle-checkbox"
                  onChange={(e) => checkCompany(e.target.checked)}
                />
                <span className="ml-2">Contract Based</span>
              </div>
              <style>{`
            .toggle-checkbox {
              appearance: none;
              width: 40px;
              height: 20px;
              background-color: green;
              border-radius: 9999px;
              position: relative;
              outline: none;
              cursor: pointer;
            }
            .toggle-checkbox:checked::before {
              left: 20px;
            }
            .toggle-checkbox::before {
              content: '';
              position: absolute;
              top: 2px;
              left: 2px;
              width: 16px;
              height: 16px;
              background-color: white;
              border-radius: 9999px;
              transition: left 0.3s;
            }
          `}</style>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="clientName">Company Name</label>
              <input className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('companyName')} type="text" id="clientName" />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="address">Address</label>
              <input className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('address')} type="text" id="address" />
              <br /><br />
              <input className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('creator')}
                type="text" id="address"
                value={creator}
                hidden="true"
              />
            </div>
            {/* Contact Detail section in the form */}
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="contactDetail">Contact Detail</label>
              {contacts.map((contact, index) => (
                <div key={index} className="mb-4 flex gap-1">
                  <input
                    className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                    type="text"
                    placeholder='Contact Name'
                    value={contact.name}
                    onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                  />
                  <input
                    className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                    type="text"
                    placeholder='Phone Number'
                    value={contact.number}
                    onChange={(e) => handleContactChange(index, 'number', e.target.value)}
                  />
                  {index > 0 && (
                    <div>

                      <button type="button" className="text-red-500 mt-2" onClick={() => handleRemoveContact(index)}>Remove</button>
                    </div>
                  )}
                </div>
              ))}
              <button type="button" className="text-blue-500" onClick={handleAddContact}>+ Add Contact</button>
            </div>
            <button type="button" onClick={() => setStep(2)} className="w-full py-2 bg-transparent hover:bg-gray-700 rounded text-blue-400 hover:text-blue-500 font-semibold">
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-md p-8 rounded-lg  mb-2">
            <div className="mb-4">
              <label className="block text-2xl mb-2">Ticket Info</label>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="productName">Product Name</label>
              <input className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('productName')} type="text" id="productName" />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="ticketSource">Ticket Source</label>
              <select className='w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500' {...register('ticketSource')} >
                <option value="">Select source</option>
                <option value="Email">Email</option>
                <option value="Call">Call</option>
                <option value="Whatsapp">Whatsapp</option>
                <option value="Whatsapp">others</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="helpTopic">Help Topic</label>
              <select className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('helpTopic')} id="helpTopic">
                <option value="">Select Help Topic</option>
                {helpTopics.map((topic, index) => (
                  <option key={index} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="department">Department</label>
              <select className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('department')} id="department">
                <option value="">Select Department</option>
                {departments.map((department, index) => (
                  <option key={index} value={department}>{department}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="slaPlan">SLA</label>
              <select className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('slaPlan')} id="slaPlan">
                <option value="">Select SLA</option>
                {slaPlans.map((sla, index) => (
                  <option key={index} value={sla}>{sla}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              {/* <label className="block text-sm mb-2" htmlFor="">Due Date</label> */}
              <input className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('dueDate')} type="text" id="ticketSource"
                value={"00/00/0000"}
                hidden={true}
              />
            </div>


            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="py-2 bg-transparent hover:bg-gray-700 rounded text-blue-400 hover:text-blue-500 font-semibold">
                Previous
              </button>
              <button type="button" onClick={() => setStep(3)} className="py-2 bg-transparent hover:bg-gray-700 rounded text-blue-400 hover:text-blue-500 font-semibold">
                Next
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className='w-full max-w-md p-8 rounded-lg  mb-2'>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="priority">Priority</label>
              <div className="flex gap-3 items-center">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="Low"
                    {...register('priority')}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2">Low</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="Normal"
                    {...register('priority')}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2">Normal</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="High"
                    {...register('priority')}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2">High</span>
                </label>
              </div>
            </div>


            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="">Assign Technician</label>
              <select className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('assignedTo')} id=""
                onChange={(e) => checkStatus(e.target.value)}
              >
                <option value="">Select</option>
                {ticketAss.map((user, index) => (
                  <option key={index} value={user}>{user}</option>
                ))}
              </select>
            </div>
            <div className="mb-4 relative">
              <label className="block text-sm mb-2" htmlFor="collaborators">Collaborators</label>
              <div
                className="w-full p-2 bg-transparent border border-gray-600 rounded cursor-pointer"
                onClick={toggleDropdown}
              >
                {selectedUsers.length > 0 ? selectedUsers.join(", ") : "Select Collaborators"}
              </div>

              {isDropdownOpen && (
                <div className="absolute mt-2 w-full bg-white border border-gray-600 rounded shadow-lg z-10">
                  {users.map((user, index) => (
                    <div key={index} className="px-4 py-2 flex items-center">
                      <input
                        type="checkbox"
                        id={`user-${index}`}
                        checked={selectedUsers.includes(user)}
                        onChange={() => handleUserSelection(user)}
                        className="mr-2"
                      />
                      <label htmlFor={`user-${index}`} className="text-sm">
                        {user}
                      </label>
                    </div>
                  ))}
                </div>

              )}
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(2)} className="py-2 bg-transparent hover:bg-gray-700 rounded text-blue-400 hover:text-blue-500 font-semibold">
                Previous
              </button>
              <button type="button" onClick={() => setStep(4)} className="py-2 bg-transparent hover:bg-gray-700 rounded text-blue-400 hover:text-blue-500 font-semibold">
                Next
              </button>
            </div>
          </div>


        )}

        {step === 4 && (
          <div className="w-full max-w-md p-8 rounded-lg  mb-2">
            <div className="mb-4">
              <label className="block text-2xl mb-2">Response</label>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="cannedResponse">Canned Response</label>
              <select className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('cannedResponse')} id="cannedResponse">
                <option value="">Select Canned</option>
                {cannedResponse.map((canned, index) => (
                  <option key={index} value={canned}>{canned}</option>
                ))}
                {/* <option value="response2">Response 2</option> */}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="issueDescription">Issue Description</label>
              <textarea className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('issueDescription')} id="issueDescription"></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="">Additional Info</label>
              <textarea className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('additionalInfo')} id=""></textarea>
            </div>

            {/* hiden fields */}

            <div className="mb-4">
              <input
                className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                {...register('updatedDate')}
                type="text"
                id="updatedDate"
                value={new Date().toLocaleDateString()}
                readOnly
                hidden="true"
              />
              <input
                className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                {...register('ticketStatus')}
                type="text"
                value={ticketStatus}
                hidden="true"
                contentEditable="false"
              />
            </div>



            {/* hidden fields end */}

            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(2)} className="py-2 bg-transparent hover:bg-gray-700 rounded text-blue-400 hover:text-blue-500 font-semibold">
                Previous
              </button>
              <button type="submit" className="py-2 bg-transparent hover:bg-gray-700 rounded text-blue-400 hover:text-blue-500 font-semibold">
                Save
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewTicket;
