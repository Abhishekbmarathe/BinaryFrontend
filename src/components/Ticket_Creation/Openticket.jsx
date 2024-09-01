import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import getAlltickets from '../modules/getAllTickets';
import axios from 'axios';
import History from '../../assets/History';
import Delete from '../../assets/Delete';

const NewTicket = () => {
  const { handleSubmit, register, setValue } = useForm();
  const [step, setStep] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [ticketStatus, setTicketStatus] = useState('Not Assigned');
  const [companyType, setCompanyType] = useState('Call');
  const [contacts, setContacts] = useState([{ name: '', number: '' }]);
  const [ticketNumber, setTicketnumber] = useState();
  const [isAdmin, setAdmin] = useState(false);
  const [allowEdit, setEdit] = useState(false); // Default to true for editing
  const [ticketOC, setTicketOC] = useState();

  const location = useLocation();
  const { ticketId } = location.state; // Get ticketId from state
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userDet"));
    if (user.role === "mAdmin") {
      setAdmin(true);
    }

    // Fetch the ticket from local storage
    const allTickets = JSON.parse(localStorage.getItem('AllTickets'));
    const currentTicket = allTickets.find(ticket => ticket._id === ticketId);
    if (currentTicket) {
      setTicket(currentTicket);
      setTicketOC(currentTicket.ticketStatus);

      // Populate form fields with existing ticket data
      Object.keys(currentTicket).forEach((key) => {
        setValue(key, currentTicket[key]);
      });
      // Set additional state based on ticket data
      setContacts(currentTicket.contact || [{ name: '', number: '' }]);
      setSelectedUsers(currentTicket.collaborators || []);
      setCompanyType(prevType => (prevType === 'Call' ? 'Contract' : 'Call'));
      setTicketStatus(currentTicket.ticketStatus || 'Not Assigned');
      setTicketnumber(currentTicket.ticketNumber);
    }


    // Edit option enable/disable
    if (user.username !== currentTicket.creator && user.role !== "mAdmin") {
      console.log("current user = ", currentTicket.creator)
      setEdit(true); // Disable editing for non-admin users or non-creators
    } else {
      setEdit(false); // Enable editing for admin users or creators
    }


  }, [ticketId, setValue]);

  const handleCompanyTypeToggle = (e) => {
    setCompanyType(e.target.checked ? 'Contract' : 'Call');
  };

  const handleAssignedToChange = (e) => {
    const value = e.target.value;
    setTicketStatus(value ? 'Assigned' : 'Not Assigned');
  };

  const handleAddContact = () => {
    setContacts([...contacts, { name: '', number: '' }]);
  };

  const handleRemoveContact = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = contacts.map((contact, i) =>
      i === index ? { ...contact, [field]: value } : contact
    );
    setContacts(updatedContacts);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleUserSelection = (user) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(user)
        ? prevSelected.filter((u) => u !== user)
        : [...prevSelected, user]
    );
  };




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

  const [helpTopics, setHelpTopics] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [slaPlans, setSlaPlans] = useState([]);
  const [cannedResponse, setCannedResponses] = useState([]);
  const [creator, setCreator] = useState(JSON.parse(localStorage.getItem('userDet')).username);

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



  const [closeData, setClosedata] = useState();

  const onSubmit = (data) => {
    if (!allowEdit) {
      // Get current date and time
      const currentDateTime = new Date();

      // Format the date as dd-mm-yyyy hh:mm:ss
      const formattedDate = `${String(currentDateTime.getDate()).padStart(2, '0')}/${String(currentDateTime.getMonth() + 1).padStart(2, '0')}/${currentDateTime.getFullYear()} ${String(currentDateTime.getHours()).padStart(2, '0')}:${String(currentDateTime.getMinutes()).padStart(2, '0')}:${String(currentDateTime.getSeconds()).padStart(2, '0')}`;
      const formData = {
        ...data,
        contactDetails: contacts,
        collaborators: selectedUsers,
        companyType,
        ticketStatus,
        ticketNumber,
        updatedDate: formattedDate // Only the date portion  
      };


      setClosedata(formData)
      console.log(formData);

      axios
        .post('https://binarysystemsbackend-mtt8.onrender.com/api/updateTicket', formData)
        .then((response) => {
          alert('Ticket updated successfully');
          console.log(response);
          // Instead of reloading the page, consider navigating to another page or updating the state
          window.location.reload();
          navigate(-1); // Replace '/some-page' with the actual route you want to navigate to
        })
        .catch((error) => {
          console.error('Error updating ticket:', error);
        });
    }
  };


  const handleDelete = () => {
    const conf = confirm("Are sure to delete this ticket?");
    if (conf) {
      axios.post('https://binarysystemsbackend-mtt8.onrender.com/api/deleteTicket', { ticketNumber })
        .then((response) => {
          alert("Ticket deleted successfully");
          navigate(-1);
        })
        .catch((error) => {
          alert("Error deleting ticket");
        });
    }
  };

  getAlltickets();






  const changeStatus = (status) => {
    const mv = status.split('ed')[0]
    console.log(mv);
    const conf = confirm("Are you sure want to " + (mv === "Clos" ? "Close" : mv) + " the ticket ?")
    if (conf) {
      const currentDateTime = new Date();

      // Format the date as dd-mm-yyyy hh:mm:ss
      const formattedDate = `${String(currentDateTime.getDate()).padStart(2, '0')}/${String(currentDateTime.getMonth() + 1).padStart(2, '0')}/${currentDateTime.getFullYear()} ${String(currentDateTime.getHours()).padStart(2, '0')}:${String(currentDateTime.getMinutes()).padStart(2, '0')}:${String(currentDateTime.getSeconds()).padStart(2, '0')}`;
      const formData = {
        ...closeData,
        contactDetails: contacts,
        collaborators: selectedUsers,
        companyType,
        ticketStatus: status,
        ticketNumber,
        updatedDate: formattedDate // Only the date portion  
      };


      console.log(formData);

      axios
        .post('https://binarysystemsbackend-mtt8.onrender.com/api/updateTicket', formData)
        .then((response) => {
          alert('Ticket ' + status + ' successfully');
          console.log(response);
          // Instead of reloading the page, consider navigating to another page or updating the state
          window.location.reload();
          navigate(-1); // Replace '/some-page' with the actual route you want to navigate to
        })
        .catch((error) => {
          alert('Error' + status + ' ticket:', error);
          console.error('Error' + status + ' ticket:', error);
        });
    }
  }

  if (!ticket) return <div>Loading...</div>; // Show a loading message until the ticket is fetched

  return (
    <div className="min-h-screen bg-gray-100 p-3">
      <div className='flex items-center justify-between px-2'>
        <h1 className='my-3 font-bold text-2xl text-center sticky top-0 z-10 bg-[#f5f5f5]'>Edit <span className='text-customColor'>Ticket</span></h1>
        <div className='flex gap-2'>
          {isAdmin && (
            <>
              {ticketOC === "Open" && (
                <button className='bg-blue-500 px-3 py-1 rounded-md text-white' onClick={() => changeStatus('Closed')}>Close</button>
              )}
              {ticketOC === "Closed" ? (
                <button className='bg-blue-500 px-3 py-1 rounded-md text-white' onClick={() => changeStatus('Reopened')}>Reopen</button>
              ) : (
                <button className='bg-blue-500 px-3 py-1 rounded-md text-white' onClick={() => changeStatus('Closed')}>Close</button>
              )}
              <button className='mx-2' onClick={handleDelete}>
                <Delete />
              </button>
            </>
          )}
          <button className='mx-2'>
            <History />
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-8 rounded">
        {/* Step Indicators */}
        <div className="flex justify-between mb-8">
          <div className={`w-1/3 text-center pb-2 ${step === 1 ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
            Customer Info
          </div>
          <div className={`w-1/3 text-center pb-2 ${step === 2 || step === 3 ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
            Ticket Info
          </div>
          <div className={`w-1/3 text-center pb-2 ${step === 4 ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
            Response
          </div>
        </div>

        {/* Step 1: Customer Info */}
        {step === 1 && (
          <div>
            {/* Company Type */}
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">Company Type</label>
              <div className="flex items-center">
                <span className="mr-4">Call Based</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={companyType === 'Contract'}
                    onChange={handleCompanyTypeToggle}
                    disabled={allowEdit}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className="ml-4">Contract Based</span>
              </div>
            </div>

            {/* Company Name */}
            <div className="mb-6">
              <label htmlFor="companyName" className="block text-lg font-medium mb-2">
                Company Name
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded"
                {...register('companyName', { required: true })}
                readOnly={allowEdit}
              />
            </div>

            {/* Address */}
            <div className="mb-6">
              <label htmlFor="address" className="block text-lg font-medium mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                {...register('address', { required: true })}
                className="w-full p-3 border border-gray-300 rounded"
                readOnly={allowEdit}
              />
            </div>

            {/* Creator */}
            <div className="mb-6">
              {/* <label htmlFor="creator" className="block text-lg font-medium mb-2">
                Creator
              </label> */}
              <input
                type="text"
                id="creator"
                {...register('creator', { required: true })}
                className="w-full p-3 border border-gray-300 rounded"
                hidden={true}
              />
            </div>

            {/* Contacts */}
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">Contacts</label>
              {contacts.map((contact, index) => (
                <div key={index} className="flex items-center mb-4">
                  <input
                    type="text"
                    className="w-1/2 p-3 border border-gray-300 rounded mr-4"
                    value={contact.name}
                    onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                    placeholder="Name"
                    readOnly={allowEdit}
                  />
                  <input
                    type="text"
                    className="w-1/2 p-3 border border-gray-300 rounded mr-4"
                    value={contact.number}
                    onChange={(e) => handleContactChange(index, 'number', e.target.value)}
                    placeholder="Number"
                    readOnly={allowEdit}
                  />
                  {!allowEdit && (
                    <button
                      type="button"
                      onClick={() => handleRemoveContact(index)}
                      className=" text-red-500 hover:text-red-700"
                    >
                      <Delete />
                    </button>
                  )}
                </div>
              ))}
              {!allowEdit && (
                <button
                  type="button"
                  onClick={handleAddContact}
                  className="text-blue-500 hover:text-blue-700"
                >
                  + Add another contact
                </button>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setStep(2)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Ticket Info */}
        {step === 2 && (
          <div>
            {/* Product Name */}
            <div className="mb-6">
              <label htmlFor="productName" className="block text-lg font-medium mb-2">
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                {...register('productName', { required: true })}
                className="w-full p-3 border border-gray-300 rounded"
                readOnly={allowEdit}
              />
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

            {/* Help Topic */}
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="helpTopic">Help Topic</label>
              <select className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('helpTopic')} id="helpTopic" readOnly={allowEdit}>
                <option value="">Select Help Topic</option>
                {helpTopics.map((topic, index) => (
                  <option key={index} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="department">Department</label>
              <select className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('department')} id="department" readOnly={allowEdit}>
                <option value="">Select Department</option>
                {departments.map((department, index) => (
                  <option key={index} value={department}>{department}</option>
                ))}
              </select>
            </div>

            {/* SLA Plan */}
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="slaPlan">SLA</label>
              <select className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('slaPlan')} id="slaPlan"
                readOnly={allowEdit}>
                <option value="">Select SLA</option>
                {slaPlans.map((sla, index) => (
                  <option key={index} value={sla}>{sla}</option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            {/* <div className="mb-6">
              <label htmlFor="dueDate" className="block text-lg font-medium mb-2">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                {...register('dueDate', { required: true })}
                className="w-full p-3 border border-gray-300 rounded"
                readOnly={allowEdit}
              />
            </div> */}

            {/* Assigned To */}


            <div className="flex justify-between">
              <button
                type="button"
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setStep(1)}
              >
                Previous
              </button>
              <button
                type="button"
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setStep(3)}
              >
                Next
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            {/* Priority */}
            <div className="mb-4">
              <label className="block mb-2 text-lg font-medium" htmlFor="priority">Priority</label>
              <div className="flex gap-3 items-center">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="Low"
                    {...register('priority')}
                    className="form-radio text-blue-600"
                    readOnly={allowEdit}
                  />
                  <span className="ml-2">Low</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="Normal"
                    {...register('priority')}
                    className="form-radio text-blue-600"
                    readOnly={allowEdit}
                  />
                  <span className="ml-2">Normal</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="High"
                    {...register('priority')}
                    className="form-radio text-blue-600"
                    readOnly={allowEdit}
                  />
                  <span className="ml-2">High</span>
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="assignedTo" className="block   mb-2 text-lg font-medium">
                Assigned To
              </label>
              <input
                type="text"
                id="assignedTo"
                {...register('assignedTo')}
                className="w-full p-3 border border-gray-300 rounded"
                readOnly={allowEdit}
                onChange={handleAssignedToChange}
              />
            </div>
            <div className="mb-4 relative">
              <label className="block mb-2 text-lg font-medium" htmlFor="collaborators">Collaborators</label>
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
              <button
                type="button"
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setStep(2)}
              >
                Previous
              </button>
              <button
                type="button"
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setStep(4)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Response */}
        {step === 4 && (
          <div>
            {/* Canned Response */}
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="cannedResponse">Canned Response</label>
              <select className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('cannedResponse')} id="cannedResponse">
                <option value="">Select Canned</option>
                {cannedResponse.map((canned, index) => (
                  <option key={index} value={canned}>{canned}</option>
                ))}
                <option value="response2">Response 2</option>
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



            <div className="flex justify-between">
              <button
                type="button"
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setStep(3)}
              >
                Previous
              </button>
              {!allowEdit && (
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"

                >
                  update
                </button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewTicket;
