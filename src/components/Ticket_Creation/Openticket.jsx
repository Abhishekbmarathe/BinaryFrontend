import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import getAlltickets from '../modules/getAllTickets';
import axios from 'axios';
import History from '../../assets/History';
import Delete from '../../assets/Delete';
import Attachment from '../../assets/Attachment';
import api from '../modules/Api';
import Edit from '../../assets/Edit';
import Close from '../../assets/Close';
import File from '../../assets/File';

const NewTicket = () => {
  const { handleSubmit, register, setValue, getValues } = useForm();
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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [toggleEdit, setToggleedit] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [showFiles, setShowfiles] = useState(false);
  const [getAttachedfiles, setGetattachedfiles] = useState([]);
  const [ticketFileId, setTicketFileId] = useState();
  


  const checkStatus = (val) => {
    console.log(val)
    setTicketStatus('Assigned')
  }

  console.log("attached files === ", getAttachedfiles)
  const location = useLocation();
  const { ticketId } = location.state; // Get ticketId from state
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);

  // suggestions state
  const extractCompany = getValues('companyName');
  const extractAddress = getValues('address')
  const [suggestions, setSuggestions] = useState([]);
  const [filteredAddresses, setFilteredAddresses] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [companyData, setCompanyData] = useState({});
  const [selectedCompany, setSelectedCompany] = useState('');
  const [addressInput, setAddressInput] = useState(extractAddress);
  const [productInput, setProductInput] = useState('');
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);

  // setFilteredAddresses("testing")

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


  // get attached files
  useEffect(() => {
    if (!ticketFileId) {
      console.log("ticketFileId is undefined at the initial load");
      return; // Exit early if ticketFileId is not available yet
    }

    console.log("Fetching files for ticketFileId === ", ticketFileId);

    const fetchFiles = async () => {
      try {
        const response = await axios.post(`${api}api/getFiles`, {
          ticketFileId,  // Sending the ticketId as ticketFileId
        });

        // Assuming response.data contains an array of files
        if (response.status === 200) {
          setGetattachedfiles(response.data);
          console.log("Fetched files:", response.data);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, [ticketFileId]);  // Run only when ticketFileId changes

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


  // delete a attached file
  const handleFileDeletion = async (fileUrl) => {
    if (confirm('Are you sure to delete this file ?')) {
      try {
        const response = await axios.post(`${api}api/deleteFile`, {
          fileUrl, // Send the file URL in the request body
        });

        if (response.status === 200) {
          alert('File deleted successfully')
          // Handle success, possibly by updating the state to remove the file from the list
          setGetattachedfiles(prevFiles => {
            const updatedFiles = { ...prevFiles };
            // Find the key associated with the fileUrl and delete it
            for (const key in updatedFiles) {
              if (updatedFiles[key] === fileUrl) {
                delete updatedFiles[key];
              }
            }
            return updatedFiles;
          });

          console.log('File deleted successfully')
        }
      } catch (error) {
        console.error('Error deleting the file:', error);
        alert('Something went wrong...')

      }
    }
  };

  // Handle when an address is selected
  const handleAddressSelection = (address) => {
    console.log("address=", address)
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
      setTicketFileId(currentTicket.ticketNumber);
      console.log("current ticket number = ", currentTicket.ticketNumber)

      // Populate form fields with existing ticket data
      Object.keys(currentTicket).forEach((key) => {
        setValue(key, currentTicket[key]);
      });

      // Set additional state based on ticket data
      setContacts(currentTicket.contact || [{ name: '', number: '' }]);
      setSelectedUsers(currentTicket.collaborators || []);
      setCollaborators(currentTicket.collaborators || []); // Ensure collaborators are set
      setCompanyType(prevType => (prevType === 'Call' ? 'Contract' : 'Call'));
      setTicketStatus(currentTicket.ticketStatus || 'Not Assigned');
      setTicketnumber(currentTicket.ticketNumber);

      // Check edit option based on user role and collaborators
      const isNotCreator = user.username !== currentTicket.creator;
      const isNotAdmin = user.role !== "mAdmin";
      const isNotCollaborator = !currentTicket.collaborators.includes(user.username);

      // Set edit based on conditions
      setEdit(isNotCreator && isNotAdmin && isNotCollaborator);
    }
  }, [ticketId, setValue]); // Keep your dependencies here




  const handleCompanyTypeToggle = (e) => {
    setCompanyType(e.target.checked ? 'Contract' : 'Call');
  };

  const handleAssignedToChange = (e) => {
    const value = e.target.value;
    setTicketStatus(value ? 'Assigned' : 'Open');
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
      console.log("ticket status === ",formData.ticketStatus);

      axios
        .post(api + 'api/updateTicket', formData)
        .then((response) => {
          alert('Ticket updated successfully');
          const ticketNumber = formData.ticketNumber;
          console.log("ticketnumber =", ticketNumber);
          // Instead of reloading the page, consider navigating to another page or updating the state
          submitFiles(selectedFiles, ticketNumber);

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
      axios.post(api + 'api/deleteTicket', { ticketNumber })
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


      console.log("formdata", formData);

      axios
        .post(api + 'api/updateTicket', formData)
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





  if (!ticket) return <div>Loading...</div>; // Show a loading message until the ticket is fetched

  return (
    <div className="min-h-screen py-3">
      <div className='flex items-center justify-between px-3'>
        <h1 className='my-3 font-bold text-2xl text-center sticky top-0 z-10 bg-[#f5f5f5]'>Edit <span className='text-customColor'>Ticket</span></h1>
        <div className='flex gap-2'>
          {isAdmin && (
            <>
              <button className='mx-2' onClick={handleDelete}>
                <Delete />
              </button>
            </>
          )}
          {!allowEdit && (
            <div>
              <button onClick={() => setToggleedit(true)} className={`${toggleEdit ? 'hidden' : 'block'}`}>
                <Edit />
              </button>
              {toggleEdit && (
                <div>
                  {ticketOC === "Open" && (
                    <button className='bg-transparent px-3 rounded-md text-green-500' onClick={() => changeStatus('Closed')}>Close</button>
                  )}
                  {ticketOC === "Closed" && (
                    <button className='bg-transparent px-3 rounded-md text-green-500' onClick={() => changeStatus('Reopened')}>Reopen</button>
                  )}
                  {ticketOC === "Reopened" && (
                    <button className='bg-transparent px-3 rounded-md text-green-500' onClick={() => changeStatus('Closed')}>Close</button>
                  )}
                  {ticketOC === "Assigned" && (
                    <button className='bg-transparent px-3 rounded-md text-green-500' onClick={() => changeStatus('Closed')}>Close</button>
                  )}
                </div>
              )}
            </div>
          )}



        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-8 rounded">
        {/* Step Indicators */}


        {/* Step 1: Customer Info */}
        {step === 1 && (
          <div>
            {/* Company Type */}
            <div className="mb-6">
              <label className="block text-xl text-customColor font-sans  font-medium mb-2">Company Type</label>
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
              <label htmlFor="companyName" className="block text-xl text-customColor  font-sans font-medium mb-2">
                Company Name
              </label>
              <input
                type="text"
                className="w-full p-3 border-2 border-gray-400 bg-transparent rounded"
                {...register('companyName', { required: true })}
                readOnly={true}
                value={extractCompany}
                onChange={handleCompanyInputChange}
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

            {/* Address */}
            <div className="mb-6 relative">
              <label htmlFor="address" className="block text-xl text-customColor  font-sans font-medium mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                value={addressInput}
                {...register('address', { required: true })}
                className="w-full p-3 border-2 border-gray-400 bg-transparent rounded"
                // readOnly={allowEdit}
                disabled={!toggleEdit} // if toggleedit is false then only we can edit
                onChange={handleAddressInputChange}
                onFocus={() => setShowAddressSuggestions(true)} // Show suggestions when focused
                onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 100)} // Hide suggestions on blur with a delay
                autoComplete='off'
                onClick={() => handleCompanySelection(extractCompany)}
              />
              {/* Display address suggestions based on the selected company */}
              {toggleEdit && (
                <>
                  {showAddressSuggestions && filteredAddresses.length > 0 && (
                    <ul className="suggestions-list bg-slate-600 text-white absolute w-full">
                      {filteredAddresses.map((address, index) => (
                        <li key={index} onClick={() => handleAddressSelection(address)} className='py-1 px-2'>
                          {address}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

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
            <div className='mb-4'>
              <label className="block text-xl text-customColor font-sans  font-medium mb-2" htmlFor="contactDetail">Email</label>
              <input
                className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500"
                {...register('email')}
                type="email"
                id="email"
                disabled={!toggleEdit}
              />
            </div>

            <div className="mb-6">
              <label className="block text-xl text-customColor  font-sans font-medium mb-2" htmlFor="ticketSource">Ticket Source</label>
              <select className='w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500' {...register('ticketSource')}
                disabled={!toggleEdit}
              >
                <option value="">Select source</option>
                <option value="Email">Email</option>
                <option value="Call">Call</option>
                <option value="Whatsapp">Whatsapp</option>
                <option value="Whatsapp">others</option>
              </select>
            </div>

            {/* Contacts */}
            <div className="mb-6">
              <label className="block text-xl text-customColor  font-medium font-sans mb-2">Contacts</label>
              {contacts.map((contact, index) => (
                <div key={index} className="flex items-center mb-4">
                  <input
                    type="text"
                    className="w-1/2 p-3 border-2 border-gray-400 bg-transparent rounded mr-4"
                    value={contact.name}
                    onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                    placeholder="Name"
                    disabled={!toggleEdit} // if toggleedit is false then only we can edit
                  />
                  <input
                    type="text"
                    className="w-1/2 p-3 border-2 border-gray-400 bg-transparent rounded mr-4"
                    value={contact.number}
                    onChange={(e) => handleContactChange(index, 'number', e.target.value)}
                    placeholder="Number"
                    disabled={!toggleEdit}
                  />
                  {toggleEdit && (
                    <>
                      {!allowEdit && (
                        <button
                          type="button"
                          onClick={() => handleRemoveContact(index)}
                          className=" text-red-500 hover:text-red-700"
                        >
                          <Delete />
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
              {toggleEdit && (
                <>
                  {!allowEdit && (
                    <button
                      type="button"
                      onClick={handleAddContact}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      + Add another contact
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="">
              <button
                type="button"
                className="px-6 py-2 float-start bg-blue-400 text-white rounded hover:bg-blue-700"
                onClick={() => setStep(4)}
              >
                Last
              </button>
            </div>

            <div className="">
              <button
                type="button"
                className="px-6 py-2 float-end bg-blue-400 text-white rounded hover:bg-blue-700"
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
            <div className="mb-6 relative">
              <label htmlFor="productName" className="block text-xl text-customColor  font-sans font-medium mb-2">
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                {...register('productName', { required: true })}
                className="w-full p-3 border-2 border-gray-400 bg-transparent rounded"
                // readOnly={allowEdit}
                // readOnly={!toggleEdit}
                disabled={!toggleEdit} // if toggleedit is false then only we can edit
                value={productInput}
                onChange={handleProductInputChange}
                onFocus={() => setShowProductSuggestions(true)} // Show suggestions when focused
                onBlur={() => setTimeout(() => setShowProductSuggestions(false), 100)} // Hide suggestions on blur with a delay
                autoComplete='off'
              />
              {toggleEdit && (
                <>
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
                </>
              )}

            </div>



            {/* Help Topic */}
            <div className="mb-6">
              <label className="block text-xl text-customColor  font-sans font-medium mb-2" htmlFor="helpTopic">Help Topic</label>
              <select className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500" {...register('helpTopic')} id="helpTopic" disabled={!toggleEdit}>
                <option value="">Select Help Topic</option>
                {helpTopics.map((topic, index) => (
                  <option key={index} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div className="mb-6">
              <label className="block text-xl text-customColor  font-sans font-medium mb-2" htmlFor="department">Department</label>
              <select className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500" {...register('department')} id="department" disabled={!toggleEdit}>
                <option value="">Select Department</option>
                {departments.map((department, index) => (
                  <option key={index} value={department}>{department}</option>
                ))}
              </select>
            </div>

            {/* SLA Plan */}
            <div className="mb-6">
              <label className="block text-xl text-customColor  font-sans font-medium mb-2" htmlFor="slaPlan">SLA</label>
              <select className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500" {...register('slaPlan')} id="slaPlan"
                disabled={!toggleEdit}>
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
                className="w-28 py-2 h-fit bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setStep(1)}
              >
                Previous
              </button>
              <button
                type="button"
                className="bg-blue-500 text-white w-28 py-2 h-fit rounded hover:bg-blue-700"
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
              <label className="block mb-2 font-sans text-xl text-customColor  font-medium" htmlFor="priority">Priority</label>
              <div className="flex gap-3 items-center">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="Low"
                    {...register('priority')}
                    className="form-radio text-blue-600"
                    disabled={!toggleEdit}
                  />
                  <span className="ml-2">Low</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="Normal"
                    {...register('priority')}
                    className="form-radio text-blue-600"
                    disabled={!toggleEdit}
                  />
                  <span className="ml-2">Normal</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="High"
                    {...register('priority')}
                    className="form-radio text-blue-600"
                    disabled={!toggleEdit}
                  />
                  <span className="ml-2">High</span>
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xl text-customColor  font-sans font-medium mb-2" htmlFor="issueDescription">Issue Description</label>
              <textarea className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500" {...register('issueDescription')} id="issueDescription" readOnly={!toggleEdit}></textarea>
            </div>

            <div className="mb-4 relative">
              <label className="block mb-2 text-xl text-customColor  font-sans font-medium" htmlFor="collaborators">Collaborators</label>
              <div
                className={`w-full p-3 bg-transparent border-2 border-gray-400 rounded cursor-pointer ${!toggleEdit ? 'pointer-events-none' : 'pointer-events-auto'} `}
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
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setStep(2)}
              >
                Previous
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
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
              <label className="block text-xl text-customColor  font-sans font-medium mb-2" htmlFor="cannedResponse">Canned Response</label>
              <select className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500" {...register('cannedResponse')} id="cannedResponse"
                disabled={!toggleEdit}
              >
                <option value="">Select Canned</option>
                {cannedResponse.map((canned, index) => (
                  <option key={index} value={canned}>{canned}</option>
                ))}
                <option value="response2">Response 2</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-xl text-customColor  font-sans font-medium mb-2" htmlFor="">Assign Technician</label>
              <select className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500" {...register('assignedTo')} id=""
                onChange={(e) => checkStatus(e.target.value)}
                disabled={!toggleEdit}
              >
                {/* <option value="">Select</option> */}
                {ticketAss.map((user, index) => (
                  <option key={index} value={user}>{user}</option>
                ))}
              </select>
            </div>
            {/* <input
                className="w-full p-2 bg-transparent border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                {...register('ticketStatus')}
                type="text"
                value={ticketStatus}
                hidden={true}
                contentEditable="false"
              /> */}
            <div className="mb-4">
              <label className="block text-xl text-customColor  font-sans font-medium  mb-2" htmlFor="">Additional Info</label>
              <textarea className="w-full p-3 bg-transparent border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500" {...register('additionalInfo')} id="" readOnly={!toggleEdit}></textarea>
            </div>


            <div className='mb-6'>
              <button
                className="flex items-center gap-1 bg-blue-500 text-white px-3 h-fit py-2 rounded-lg"
                type="button"
                onClick={() => setShowfiles(true)}
              >
                <Attachment />
                View Attached Files
              </button>

            </div>
            <div className='mb-6'>
              {toggleEdit && (
                <>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileChange(e, selectedFiles, setSelectedFiles)}
                    style={{ display: 'none' }}
                    id="fileInput"
                  />
                  {!allowEdit && (

                    <button
                      className="flex items-center gap-1 bg-blue-500 text-white px-3 h-fit py-2 rounded-lg"
                      type="button"
                      onClick={() => document.getElementById('fileInput').click()}
                    >
                      <Attachment />
                      Attach File
                    </button>
                  )}

                </>
              )}


              <div className="mt-2">
                {selectedFiles.length > 0 && (
                  <div>
                    <h4>Selected Files:</h4>
                    <ul>
                      {selectedFiles.map((file, index) => (
                        <li key={index} className="flex items-center justify-between mb-1">
                          {file.name}
                          <button
                            className="text-red-500 ml-2"
                            type="button"
                            onClick={() => removeFile(index, selectedFiles, setSelectedFiles)}
                          >
                            Remove
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

            <div className="flex justify-between">
              <button
                type="button"
                className="px-6 h-fit py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setStep(3)}
              >
                Previous
              </button>
              {toggleEdit && (
                <>
                  {!allowEdit && (
                    <button
                      type="submit"
                      className="px-6 h-fit py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                      update
                    </button>
                  )}
                </>
              )}
            </div>

            {/* display attached files */}
            {showFiles && (
              <>
                <div className='absolute md:w-1/2 h-[70vh] overflow-auto w-[80%] rounded-xl top-1/2 bg-slate-600 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-white p-4 pt-0'>
                  <div className='flex justify-between sticky top-0 bg-inherit py-4'>
                    <h1 className='text-customColor text-xl'>Attached Files</h1>
                    <button type='button'
                      className='bg-red-500 p-1 rounded-full'
                      onClick={() => setShowfiles(false)}
                    >
                      <Close />
                    </button>
                  </div>

                  <div className='mt-5'>
                    {/* Render attached files here */}
                    {Object.keys(getAttachedfiles).length > 0 ? (
                      Object.entries(getAttachedfiles).map(([fileNameWithId, fileUrl], index) => {
                        // Extract the file name by splitting the string at '____'
                        const fileName = fileNameWithId.split('____')[0];

                        return (
                          <div key={index} className="p-2  border-b border-gray-400 flex justify-between items-center">
                            {/* Create a clickable link for file URL and display the file name*/}
                            <a
                              href={fileUrl} // Use the URL from the dynamic object
                              target="_blank" // Open the link in a new tab
                              rel="noopener noreferrer" // Security feature
                              className=""
                            >
                              <div className='w-fit flex items-center gap-1'>
                                <File />
                                {/* Truncate on small screens, allow normal word breaking on medium screens and up */}
                                <p className='text-gray-300 text-sm max-w-[190px]  md:max-w-full truncate md:overflow-visible md:whitespace-normal /md:break-words'>
                                  {fileName}
                                </p>
                              </div>


                            </a>


                            {/* Add Delete Button */}
                            {toggleEdit && (
                              <button
                                type='button'
                                onClick={() => handleFileDeletion(fileUrl)}
                              >
                                <Delete />
                              </button>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p>No files attached</p>
                    )}
                  </div>
                </div>
              </>
            )}




          </div>


        )}
      </form>
    </div>
  );
};

export default NewTicket;
