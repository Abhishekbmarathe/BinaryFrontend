import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ticketSettings from '../modules/getTicketSetting';
import Attachment from '../../assets/Attachment';
import api from '../modules/Api';
import Remove from '../../assets/Close';
import File from '../../assets/File';

const NewTicket = () => {

  const { handleSubmit, control, register, setValue, reset } = useForm();
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

  const [selectedFiles, setSelectedFiles] = useState([]);

  // suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [filteredAddresses, setFilteredAddresses] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [companyData, setCompanyData] = useState({});
  const [selectedCompany, setSelectedCompany] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [productInput, setProductInput] = useState('');
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);

  // Fetch company data (company names, addresses, and products) from the API
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(api + 'api/optionsForTicketDropdown');
        const data = response.data;

        // Store the entire response in localStorage
        localStorage.setItem('companyData', JSON.stringify(data));

        // Extract company names and store them in suggestions
        const companyNames = Object.keys(data);
        setSuggestions(companyNames);

        // Store the full data in state for later address and product filtering
        setCompanyData(data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    fetchCompanyData();
  }, []);

  // Handle when a company is selected
  const handleCompanySelection = (companyName) => {
    setSelectedCompany(companyName);
    setShowCompanySuggestions(false); // Hide the company suggestions list

    // Update the address field based on the selected company
    if (companyData[companyName]) {
      const addresses = Object.keys(companyData[companyName]);
      setFilteredAddresses(addresses);
    } else {
      setFilteredAddresses([]);
    }

    // Clear address and product inputs when a new company is selected
    setAddressInput('');
    setProductInput('');
    setFilteredProducts([]);
    setValue('companyName', companyName);
  };

  // Handle when an address is selected
  const handleAddressSelection = (address) => {
    setAddressInput(address);
    setShowAddressSuggestions(false); // Hide the address suggestions list

    // Update the product suggestions based on the selected address
    if (companyData[selectedCompany] && companyData[selectedCompany][address]) {
      const products = companyData[selectedCompany][address];
      setFilteredProducts(products);
    } else {
      setFilteredProducts([]);
    }

    setValue('address', address);  // Register selected address in the form
  };

  // Handle when a product is selected
  const handleProductSelection = (product) => {
    setProductInput(product);
    console.log(product)
    setShowProductSuggestions(false); // Hide the product suggestions list
    setValue('productName', product);  // Register selected product in the form
  };

  const handleCompanyInputChange = (e) => {
    const value = e.target.value;
    setSelectedCompany(value);
    handleCompanySelection(value);  // Filter addresses based on the selected company
    setShowCompanySuggestions(true); // Show suggestions when typing in the company field
    setValue('companyName', value); // Register company name field in the form
  };

  const handleAddressInputChange = (e) => {
    const value = e.target.value;
    setAddressInput(value);
    setShowAddressSuggestions(true); // Show suggestions when typing in the address field
    setValue('address', value); // Register address field in the form
  };

  const handleProductInputChange = (e) => {
    const value = e.target.value;
    setProductInput(value);
    setShowProductSuggestions(true); // Show suggestions when typing in the product field
    setValue('productName', value); // Register product field in the form
  };



  ticketSettings()


  useEffect(() => {
    const storedSettings = localStorage.getItem("TicketSettings");

    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);

        if (Array.isArray(parsedSettings)) {
          // Filter and set the settings based on type
          setHelpTopics(parsedSettings.filter(setting => setting.type === 'Help').map(setting => setting.data));
          setDepartments(parsedSettings.filter(setting => setting.type === 'Department').map(setting => setting.data));
          setSlaPlans(parsedSettings.filter(setting => setting.type === 'SLA').map(setting => setting.data));
          setCannedResponses(parsedSettings.filter(setting => setting.type === 'Canned').map(setting => setting.data));
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
      // attachedFiles
    };


    axios.post(api + 'api/createTicket', formData)
      .then((response) => {
        const ticketNumber = response.data.ticketNumber;
        if (ticketNumber) {
          submitFiles(selectedFiles, ticketNumber);
          alert('Ticket Created Successfully');
        } else {
          throw new Error('No ticket number returned from API');
        }
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




  // const [selectedFiles, setSelectedFiles] = useState([]);
  // Reusable file handling functions
  const handleFileChange = (e, selectedFiles, setSelectedFiles) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  const removeFile = (index, selectedFiles, setSelectedFiles) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  const submitFiles = async (selectedFiles, ticketFileId) => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('ticketFileId', ticketFileId);
    try {
      const response = await axios.post(api + 'api/fileAttach', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Files successfully submitted:', response.data);
      // Optionally, clear the selected files after successful upload
      setSelectedFiles([]);
    } catch (error) {
      alert('Error submitting files:', error);
    }
  };



  return (
    <div className="md:w-1/2 m-auto">
      <h1 className='mt-6 font-bold text-2xl text-center sticky top-0 z-10'>New<span className='text-customColor'>Ticket</span></h1>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        {step === 1 && (
          <div className="w-full max-w-md p-8 rounded-lg mb-2">
            <label className="block text-2xl mb-6 text-customColor">Customer Info</label>
            <div className="mb-4">
              <label htmlFor="" className='block text-xl text-customColor font-sans  font-medium mb-2'>Company Type:</label>
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
            {/* Company Name Field */}
            <div className="mb-4 relative">
              <label className="block text-xl text-customColor font-sans  font-medium mb-2" htmlFor="companyName">Company Name</label>
              <input
                className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500"
                type="text"
                id="companyName"
                value={selectedCompany}
                onChange={handleCompanyInputChange}
                onFocus={() => setShowCompanySuggestions(true)} // Show suggestions when focused
                onBlur={() => setTimeout(() => setShowCompanySuggestions(false), 100)} // Hide suggestions on blur with a delay
                autoComplete='off'
              />
              {/* Display company name suggestions */}
              {showCompanySuggestions && suggestions.length > 0 && (
                <ul className="suggestions-list bg-slate-200 absolute z-10 w-full">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => handleCompanySelection(suggestion)} className='p-1'>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Address Field */}
            <div className="mb-4 relative">
              <label className="block text-xl text-customColor font-sans  font-medium mb-2" htmlFor="address">Address</label>
              <input
                className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500"
                {...register('address')}
                type="text"
                id="address"
                value={addressInput}
                onChange={handleAddressInputChange}
                onFocus={() => setShowAddressSuggestions(true)} // Show suggestions when focused
                onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 100)} // Hide suggestions on blur with a delay
                autoComplete='off'
              />
              {/* Display address suggestions based on the selected company */}
              {showAddressSuggestions && filteredAddresses.length > 0 && (
                <ul className="suggestions-list bg-slate-200 absolute w-full">
                  {filteredAddresses.map((address, index) => (
                    <li key={index} onClick={() => handleAddressSelection(address)} className='py-1 px-2'>
                      {address}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Hidden Creator Field */}
            <input
              className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              {...register('creator')}
              type="text"
              id="creator"
              value={creator}
              hidden={true}
            />
            <div className='mb-4'>
              <label className="block text-xl text-customColor font-sans  font-medium mb-2" htmlFor="contactDetail">Email</label>
              <input
                className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500"
                {...register('email')}
                type="email"
                id="email"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xl text-customColor font-sans  font-medium mb-2" htmlFor="ticketSource">Ticket Source</label>
              <select className='w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500' {...register('ticketSource')} >
                <option value="">Select source</option>
                <option value="Email">Email</option>
                <option value="Call">Call</option>
                <option value="Whatsapp">Whatsapp</option>
                <option value="Whatsapp">others</option>
              </select>
            </div>
            {/* Contact Detail section in the form */}
            <div className="mb-4">
              <label className="block text-xl text-customColor font-sans  font-medium mb-2" htmlFor="contactDetail">Contact Detail</label>
              {contacts.map((contact, index) => (
                <div key={index} className="mb-4 flex gap-2">
                  <input
                    className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500"
                    type="text"
                    placeholder='Contact Name'
                    value={contact.name}
                    onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                    autoComplete='off'
                  />
                  <input
                    className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500"
                    type="text"
                    placeholder='Phone Number'
                    value={contact.number}
                    onChange={(e) => handleContactChange(index, 'number', e.target.value)}
                    autoComplete='off'
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
            <button type="button" onClick={() => setStep(2)} className="py-1 bg-blue-500 hover:bg-gray-700 text-white w-20 rounded float-end hover:text-blue-500 font-semibold">
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-md p-8 rounded-lg  mb-2">
            <div className="mb-4">
              <label className="block text-2xl mb-2 text-customColor">Ticket Info</label>
            </div>
            {/* Product Field */}
            <div className="mb-4 relative">
              <label className="block text-xl text-customColor font-sans  font-medium mb-2" htmlFor="product">Product</label>
              <input
                className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500"
                {...register('productName')}
                type="text"
                id="product"
                placeholder='Select product'
                value={productInput}
                onChange={handleProductInputChange}
                onFocus={() => setShowProductSuggestions(true)} // Show suggestions when focused
                onBlur={() => setTimeout(() => setShowProductSuggestions(false), 100)} // Hide suggestions on blur with a delay
              />
              {/* Display product suggestions based on the selected address */}
              {showProductSuggestions && filteredProducts.length > 0 && (
                <ul className="suggestions-list bg-slate-200 absolute w-full">
                  {filteredProducts.map((product, index) => (
                    <li key={index} onClick={() => handleProductSelection(product)} className='px-2 py-1'>
                      {product}
                    </li>
                  ))}
                </ul>
              )}
            </div>


            <div className="mb-4">
              <label className="block text-xl text-customColor font-sans  font-medium mb-2" htmlFor="helpTopic">Help Topic</label>
              <select className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500" {...register('helpTopic')} id="helpTopic">
                <option value="">Select Help Topic</option>
                {helpTopics.map((topic, index) => (
                  <option key={index} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-xl text-customColor font-sans  font-medium mb-2" htmlFor="department">Department</label>
              <select className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500" {...register('department')} id="department">
                <option value="">Select Department</option>
                {departments.map((department, index) => (
                  <option key={index} value={department}>{department}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-xl text-customColor font-sans  font-medium mb-2" htmlFor="slaPlan">SLA</label>
              <select className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500" {...register('slaPlan')} id="slaPlan">
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


            <div className="flex justify-between mt-16">
              <button type="button" onClick={() => setStep(1)} className=" h-fit py-2 font-sans w-20 bg-blue-500  rounded text-white font-semibold">
                Previous
              </button>
              <button type="button" onClick={() => setStep(3)} className="h-fit py-2 font-sans w-20 bg-blue-500  rounded text-white font-semibold">
                Next
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className='w-full max-w-md p-8 rounded-lg  mb-2'>
            <div className="mb-4">
              <label className="block text-xl text-customColor font-sans  font-medium mb-2" htmlFor="priority">Priority</label>
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
              <label className="block text-xl text-customColor font-sans  font-medium mb-2" htmlFor="issueDescription">Issue Description</label>
              <textarea className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500" {...register('issueDescription')} id="issueDescription"></textarea>
            </div>

            <div className="mb-4 relative">
              <label className="block text-xl text-customColor font-sans  font-medium mb-2" htmlFor="collaborators">Collaborators</label>
              <div
                className="w-full p-3 bg-transparent border-2 border-gray-400 rounded cursor-pointer"
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
            <div className="flex justify-between mt-16">
              <button type="button" onClick={() => setStep(2)} className="h-fit py-1 font-sans w-20 bg-blue-500  rounded text-white font-semibold">
                Previous
              </button>
              <button type="button" onClick={() => setStep(4)} className="h-fit py-1 font-sans w-20 bg-blue-500  rounded text-white font-semibold">
                Next
              </button>
            </div>
          </div>


        )}

        {step === 4 && (
          <div className="w-full max-w-md p-8 rounded-lg  mb-2">
            <div className="mb-4">
              <label className="block text-xl text-customColor font-sans  font-medium mb-2">Response</label>
            </div>
            <div className="mb-4">
              <label className="block text-xl text-customColor font-sans  font-medium mb-2" htmlFor="cannedResponse">Canned Response</label>
              <select className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500" {...register('cannedResponse')} id="cannedResponse">
                <option value="">Select Canned</option>
                {cannedResponse.map((canned, index) => (
                  <option key={index} value={canned}>{canned}</option>
                ))}
                {/* <option value="response2">Response 2</option> */}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-xl text-customColor font-sans  font-medium mb-2" htmlFor="">Assign Technician</label>
              <select className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500" {...register('assignedTo')} id=""
                onChange={(e) => checkStatus(e.target.value)}
              >
                <option value="">Select</option>
                {ticketAss.map((user, index) => (
                  <option key={index} value={user}>{user}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-xl text-customColor font-sans  font-medium mb-2" htmlFor="">Additional Info</label>
              <textarea className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500" {...register('additionalInfo')} id=""></textarea>
            </div>

            <div>
              <input
                type="file"
                multiple
                onChange={(e) => handleFileChange(e, selectedFiles, setSelectedFiles)}
                style={{ display: 'none' }}
                id="fileInput"
              />
              <button
                className="flex items-center gap-1 bg-blue-400 text-white p-3 rounded-lg"
                type="button"
                onClick={() => document.getElementById('fileInput').click()}
              >
                <Attachment />
                Attach File
              </button>

              <div className="mt-2">
                {selectedFiles.length > 0 && (
                  <div>
                    <h4 className='block text-xl text-customColor font-sans  font-medium mb-2'>Selected Files:</h4>
                    <ul className='mt-4'>
                      {selectedFiles.map((file, index) => (
                        <li key={index} className="flex items-center justify-between mb-1 p-2 border-b border-gray-400">
                          <div className='mr-2'>
                            <File />
                          </div>
                          {file.name}
                          <button
                            className="text-red-500 ml-2 p-1 bg-red-500 rounded"
                            type="button"
                            onClick={() => removeFile(index, selectedFiles, setSelectedFiles)}
                          >
                            <Remove />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* {selectedFiles.length > 0 && (
                <button
                  className="mt-4 bg-green-500 text-white p-2 rounded-lg"
                  type="button"
                  onClick={() => submitFiles(selectedFiles)}
                >
                  Submit Files
                </button>
              )} */}
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
                hidden={true}
              />
              <input
                className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                {...register('ticketStatus')}
                type="text"
                value={ticketStatus}
                hidden={true}
                contentEditable="false"
              />
            </div>
            {/* hidden fields end */}

            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(3)} className="h-fit py-1 font-sans w-20 bg-blue-500  rounded text-white font-semibold">
                Previous
              </button>
              <button type="submit" className="h-fit py-1 font-sans w-20 bg-blue-500  rounded text-white font-semibold">
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
