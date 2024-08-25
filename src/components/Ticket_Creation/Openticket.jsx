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

  const onSubmit = (data) => {
    if (allowEdit) {
      const formData = {
        ...data,
        contactDetails: contacts,
        collaborators: selectedUsers,
        companyType,
        ticketStatus,
        updatedDate: new Date() // Only the date portion
      };

      axios
        .post('https://binarysystemsbackend-mtt8.onrender.com/api/updateTicket', formData)
        .then((response) => {
          alert('Ticket updated Successfully');
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error Updating ticket:', error);
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

  if (!ticket) return <div>Loading...</div>; // Show a loading message until the ticket is fetched

  return (
    <div className="min-h-screen bg-gray-100 p-3">
      <div className='flex items-center justify-between px-2'>
        <h1 className='my-3 font-bold text-3xl text-center sticky top-0 z-10 bg-[#f5f5f5]'>Edit <span className='text-customColor'>Ticket</span></h1>
        <div className='flex gap-2'>
          {isAdmin && (
            <button className='mx-2' onClick={handleDelete}>
              <Delete />
            </button>
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
          <div className={`w-1/3 text-center pb-2 ${step === 2 ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
            Ticket Info
          </div>
          <div className={`w-1/3 text-center pb-2 ${step === 3 ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
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

            {/* Help Topic */}
            <div className="mb-6">
              <label htmlFor="helpTopic" className="block text-lg font-medium mb-2">
                Help Topic
              </label>
              <input
                type="text"
                id="helpTopic"
                {...register('helpTopic', { required: true })}
                className="w-full p-3 border border-gray-300 rounded"
                readOnly={allowEdit}
              />
            </div>

            {/* Department */}
            <div className="mb-6">
              <label htmlFor="department" className="block text-lg font-medium mb-2">
                Department
              </label>
              <input
                type="text"
                id="department"
                {...register('department', { required: true })}
                className="w-full p-3 border border-gray-300 rounded"
                readOnly={allowEdit}
              />
            </div>

            {/* SLA Plan */}
            <div className="mb-6">
              <label htmlFor="slaPlan" className="block text-lg font-medium mb-2">
                SLA Plan
              </label>
              <input
                type="text"
                id="slaPlan"
                {...register('slaPlan', { required: true })}
                className="w-full p-3 border border-gray-300 rounded"
                readOnly={allowEdit}
              />
            </div>

            {/* Due Date */}
            <div className="mb-6">
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
            </div>

            {/* Assigned To */}
            <div className="mb-6">
              <label htmlFor="assignedTo" className="block text-lg font-medium mb-2">
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

        {/* Step 3: Response */}
        {step === 3 && (
          <div>
            {/* Canned Response */}
            <div className="mb-6">
              <label htmlFor="cannedResponse" className="block text-lg font-medium mb-2">
                Canned Response
              </label>
              <textarea
                id="cannedResponse"
                {...register('cannedResponse')}
                className="w-full p-3 border border-gray-300 rounded"
                rows="5"
                readOnly={allowEdit}
              />
            </div>

            {/* Issue Description */}
            <div className="mb-6">
              <label htmlFor="issueDescription" className="block text-lg font-medium mb-2">
                Issue Description
              </label>
              <textarea
                id="issueDescription"
                {...register('issueDescription', { required: true })}
                className="w-full p-3 border border-gray-300 rounded"
                rows="5"
                readOnly={allowEdit}
              />
            </div>

            {/* Priority */}
            <div className="mb-6">
              <label htmlFor="priority" className="block text-lg font-medium mb-2">
                Priority
              </label>
              <select
                id="priority"
                {...register('priority', { required: true })}
                className="w-full p-3 border border-gray-300 rounded"
                disabled={allowEdit}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setStep(2)}
              >
                Previous
              </button>
              {!allowEdit && (
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={onSubmit}
                >
                  Save
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
