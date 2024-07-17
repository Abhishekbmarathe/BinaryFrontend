import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import getAllcustomers from '../modules/getAllcustomers';
import Nav from '../TopNav';
import Allcustomers from '../Customer_DB/Allcustomers'

function AssetDb() {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const { fields, append } = useFieldArray({
    control,
    name: 'contacts'
  });
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showForm, setShowForm] = useState(false); // Form visibility state

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://binarysystemsbackend-mtt8.onrender.com/api/addClient', data);
      console.log(response.data);
      getAllcustomers();
      alert("Customer added successfully...")
      setIsLoading(false);
      setShowForm(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className='w-[90vw] sm:w-1/2 m-auto'>
        <h1 className='my-6 font-bold text-3xl mx-auto w-fit'>Customer <span className='text-cyan-400'>DB</span></h1>
        {!showForm ? (
          <button
            className='bg-neutral-500 py-2 px-3 rounded-xl my-9 fixed bottom-0 right-8 flex justify-between w-20 items-center'
            onClick={() => setShowForm(true)}
          >
            <span>+</span> New
          </button>
        ) : null}
        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <div>
              <label className='block'>Company Name</label>
              <input
                {...register('companyName', { required: true })}
                className='border rounded p-2 w-full bg-transparent'
              />
              {errors.companyName && <span className='text-red-500'>Company Name is required</span>}
            </div>
            <div>
              <label className='block '>Web Address</label>
              <input
                {...register('web', { required: true })}
                className='border rounded p-2 w-full bg-transparent'
              />
              {errors.web && <span className='text-red-500'>Web Address is required</span>}
            </div>
            <div>
              <label className='block '>Email Address</label>
              <input
                {...register('email', { required: true })}
                className='border rounded p-2 w-full bg-transparent'
              />
              {errors.email && <span className='text-red-500'>Email Address is required</span>}
            </div>
            <div>
              <label className='block font-bold text-2xl my-2'>Contact Information</label>
              {fields.map((item, index) => (
                <div key={item.id} className='flex gap-4'>
                  <div>
                    <label className='block'>Contact Name</label>
                    <input
                      {...register(`contacts.${index}.name`, { required: true })}
                      className='border rounded p-2 w-full bg-transparent'
                    />
                    {errors.contacts && errors.contacts[index] && errors.contacts[index].name && <span className='text-red-500'>Contact Name is required</span>}
                  </div>
                  <div>
                    <label className='block'>Contact Number</label>
                    <input
                      {...register(`contacts.${index}.number`, { required: true })}
                      className='border rounded p-2 w-full bg-transparent'
                    />
                    {errors.contacts && errors.contacts[index] && errors.contacts[index].number && <span className='text-red-500'>Contact Number is required</span>}
                  </div>
                </div>
              ))}
              <button
                type='button'
                className='bg-blue-500 text-white p-2 rounded mt-2'
                onClick={() => append({ name: '', number: '' })}
              >
                Add Contact
              </button>
            </div>
            <button
              type="submit"
              className="w-full block m-auto p-2 bg-slate-200 text-black rounded-md hover:bg-slate-500 transition-all"
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
      </div>
    </>
  );
}

export default AssetDb;
