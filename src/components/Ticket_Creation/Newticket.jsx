import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

const NewTicket = () => {
  const { handleSubmit, control, register } = useForm();
  const [step, setStep] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const users = ["User 1", "User 2", "User 3"]; // Add more users as needed

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleUserSelection = (user) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(user)
        ? prevSelected.filter((u) => u !== user)
        : [...prevSelected, user]
    );
  };

  const onSubmit = (data) => {
    data.collaborators = selectedUsers; // Include selected users in the form data
    console.log(data);
    // Send data to backend
    fetch('https://your-backend-url.com/api/newTicket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Success:', result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-center text-blue-400">
        New <span className="text-blue-600">Ticket</span>
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-blue-200">
        {step === 1 && (
          <div className="w-full max-w-md p-8 rounded-lg border-2 border-red-600 mb-2">
            <div className="mb-4">
              <label className="block text-2xl mb-2">Customer Info</label>
              <div className="flex items-center mb-2">
                <span className="mr-2">Call Based</span>
                <input
                  type="checkbox"
                  {...register('isCallBased')}
                  className="toggle-checkbox"
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
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="contactDetail">Contact Detail</label>
              <input className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('contactDetail')} type="text" id="contactDetail" />
            </div>
            <button type="button" onClick={() => setStep(2)} className="w-full py-2 bg-transparent hover:bg-gray-700 rounded text-blue-400 hover:text-blue-500 font-semibold">
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-md p-8 rounded-lg border-2 border-red-600 mb-2">
            <div className="mb-4">
              <label className="block text-2xl mb-2">Ticket Info</label>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="productName">Product Name</label>
              <input className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('productName')} type="text" id="productName" />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="ticketSource">Ticket Source</label>
              <input className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('ticketSource')} type="text" id="ticketSource" />
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
          <div className="w-full max-w-md p-8 rounded-lg border-2 border-red-600 mb-2">
            <div className="mb-4">
              <label className="block text-2xl mb-2">Response</label>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="cannedResponse">Canned Response</label>
              <select className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('cannedResponse')} id="cannedResponse">
                <option value="">Select Canned</option>
                <option value="response1">Response 1</option>
                <option value="response2">Response 2</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="issueDescription">Issue Description</label>
              <textarea className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('issueDescription')} id="issueDescription"></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="priority">Priority</label>
              <select className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500" {...register('priority')} id="priority">
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
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
