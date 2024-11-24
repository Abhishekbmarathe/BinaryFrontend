import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import getAllcustomers from '../modules/getAllcustomers';
import Nav from '../TopNav';
import Allcustomers from '../Customer_DB/Allcustomers'
import { useNavigate, Link } from 'react-router-dom';
import Delete from '../../assets/Delete';
import Clientbranches from '../modules/getClientbranches';
import api from '../modules/Api';
import Search from '../../assets/Search'
import Home from '../../assets/Home';
import Recycle from '../../assets/Recycle';
import useAdminStatus from '../modules/IsAdmin';

function AssetDb() {
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm();
  const { fields, append } = useFieldArray({
    control,
    name: 'contacts'
  });
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showForm, setShowForm] = useState(false); // Form visibility state
  const [step, setStep] = useState(1);
  const [branches, setBranches] = useState([]);
  const [creator, setCreator] = useState(JSON.parse(localStorage.getItem('userDet')).username);



  Clientbranches();
  getAllcustomers();

  const ismAdmin = useAdminStatus();
  const navigate = useNavigate();

  const handleAddBranch = () => {
    const companyName = watch('companyName'); // Get the companyName value from the form
    setBranches([...branches, { companyName, location: '', department: '' }]);
  };

  const handleBranchChange = (index, event) => {
    const newBranches = [...branches];
    newBranches[index][event.target.name] = event.target.value;
    setBranches(newBranches);
  };

  const handleRemoveBranch = (index) => {
    const newBranches = branches.filter((_, i) => i !== index);
    setBranches(newBranches);
  };

  const home = () => {
    navigate('/Server/Home');
    navigator.vibrate(60);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(api + 'api/addClient', data,
        {
          headers: {
            'Content-Type': 'application/json', // Specify the content type
            'updatedby': creator // Add the `creater` value in the headers
          }
        }
      );
      submitBranches(data.companyName); // Pass companyName to submitBranches
      getAllcustomers();
      alert('Customer added successfully...');
      setIsLoading(false);
      setShowForm(false);
    } catch (error) {
      alert(error);
      setIsLoading(false);
    }
  };

  const submitBranches = (companyName) => {
    // Include companyName in each branch before sending to the API
    const updatedBranches = branches.map(branch => ({
      ...branch,
      companyName,
    }));

    // Prepare the payload with both companyName and branches
    const payload = {
      companyName,  // Send company name separately
      newData: updatedBranches,  // Include the branches with company name in each
    };

    console.log(payload)
    // Send the payload to the API
    axios.post(api + 'api/updateClientbranches', payload)
      // axios.post('http://localhost:3000/api/updateClientbranches', payload)
      .then(response => {
        console.log('Branches and company name submitted:', response.data);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error submitting branches and company name:', error);
      });
  };


  return (
    <>
      <Nav />
      <div className='w-[90vw] sm:w-1/2 m-auto'>
        <div className='flex items-center justify-between my-6'>
          <h1 className='font-semibold font-sans text-3xl w-fit'>Customer <span className='text-customColor'>DB</span></h1>
          {ismAdmin && (
            <Link to='/recycle-bin'>
              <Recycle />
            </Link>
          )}
        </div>
        {!showForm ? (
          <div>

            <button
              className='bg-white shadow-customShadow  py-2 px-5 rounded-xl my-9 fixed bottom-0 right-8 flex justify-between items-center'
              onClick={() => setShowForm(true)}
            >
              <span className='text-customColor text-3xl font-bold '>+</span>
            </button>
          </div>
        ) : null}
        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            {step === 1 && (
              <div>
                <div>
                  <label className='block'>Company Name</label>
                  <input
                    {...register('companyName', { required: true })}
                    className='border-2 border-gray-400 focus:border-customColor outline-none rounded p-3 w-full bg-transparent'
                  />
                  {errors.companyName && <span className='text-red-500'>Company Name is required</span>}
                </div>
                <div>
                  <label className='block '>Web Address</label>
                  <input
                    {...register('web', { required: true })}
                    className='border-2 border-gray-400 focus:border-customColor outline-none rounded p-3 w-full bg-transparent'
                  />
                  {errors.web && <span className='text-red-500'>Web Address is required</span>}
                </div>
                <div>
                  <label className='block '>Email Address</label>
                  <input
                    {...register('email', { required: true })}
                    className='border-2 border-gray-400 focus:border-customColor outline-none rounded p-3 w-full bg-transparent'
                  />
                  {errors.email && <span className='text-red-500'>Email Address is required</span>}
                </div>
                <div>
                  <label className='block '>Location</label>
                  <input
                    {...register('address', { required: true })}
                    className='border-2 border-gray-400 focus:border-customColor outline-none rounded p-3 w-full bg-transparent'
                  />
                  {errors.address && <span className='text-red-500'>Address is required</span>}
                </div>
                <div>
                  <label className='block font-bold text-2xl my-2'>Contact Information</label>
                  {fields.map((item, index) => (
                    <div key={item.id} className=''>
                      <div>
                        <input
                          {...register(`contacts.${index}.name`)}
                          className=' border-b-2  pt-4 pl-2 pb-1 w-full bg-transparent outline-none'
                          placeholder={`Name${index + 1}`}
                        />
                        {errors.contacts && errors.contacts[index] && errors.contacts[index].name && <span className='text-red-500'>Contact Name is required</span>}
                      </div>
                      <div>
                        <input
                          {...register(`contacts.${index}.number`)}
                          className='border-b-2  pt-4 pl-2 pb-1 w-full bg-transparent outline-none'
                          placeholder={`Number${index + 1}`}
                        />
                        {errors.contacts && errors.contacts[index] && errors.contacts[index].number && <span className='text-red-500'>Contact Number is required</span>}
                      </div>
                    </div>
                  ))}
                  <button
                    type='button'
                    className=' text-customColor p-2 rounded mt-2'
                    onClick={() => append({ name: '', number: '' })}
                  >
                    + Add Contact
                  </button>
                </div>
                <button
                  className='mt-8 float-end bg-blue-400 text-white px-6 py-2 rounded-lg'
                  onClick={() => setStep(2)}
                >
                  Next
                </button>
              </div>
            )}

            <div>
              {step === 2 && (
                <div>
                  <div className='text-customColor flex justify-between'>
                    <label className='block'>Sub Branches</label>
                    <span className='' onClick={handleAddBranch}>+ Add</span>
                  </div>

                  {branches.map((branch, index) => (
                    <div key={index} className='mt-4 flex'>
                      <input
                        type='text'
                        name='location'
                        placeholder='Location'
                        value={branch.location}
                        onChange={(e) => handleBranchChange(index, e)}
                        className='mr-2 p-2 border rounded outline-none bg-transparent border-gray-400 w-full'
                      />
                      <input
                        type='text'
                        name='department'
                        placeholder='Department'
                        value={branch.department}
                        onChange={(e) => handleBranchChange(index, e)}
                        className='p-2 border rounded outline-none bg-transparent border-gray-400 w-full'
                      />
                      <button
                        className='ml-2 text-red-500'
                        type='button'
                        onClick={() => handleRemoveBranch(index)}
                      >
                        <Delete />
                      </button>
                    </div>
                  ))}

                  <button
                    className='mt-[50%] bg-blue-400 text-white px-6 py-2 rounded-lg'
                    onClick={() => setStep(1)}
                  >
                    Previous
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full block m-auto p-2  text-white rounded-md bg-slate-400 transition-all"
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? (
                <div className="flex justify-center items-center gap-3">
                  <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-dotted rounded-full" role="status"></div>
                  <span className="breathing">Loading...</span>
                </div>
              ) : (
                'Add '
              )}
            </button>
          </form>
        )}
        {!showForm && <Allcustomers />}
        <div className='fixed md:hidden /bg-bottom-gradient bottom-0 py-2 overflow-y-auto w-full -z-10'>
          <nav className='w-screen flex items-center justify-center px-16 py-2  '>
            <button onClick={home}>
              <Home />
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}

export default AssetDb;
