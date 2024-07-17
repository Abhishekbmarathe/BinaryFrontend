import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import fetchAndStoreUsers from '../modules/fetchAllusers';
import getAllAsset from '../modules/getAllAssets';
import Allassets from './Allassets'
import Nav from '../TopNav'

function AssetDb() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showForm, setShowForm] = useState(false); // Form visibility state


  const onSubmit = async (data) => {
    setIsLoading(true);
    try {

      const response = await axios.post('https://binarysystemsbackend-mtt8.onrender.com/api/addAsset', data)
      // const response = await axios.post('http://localhost:3000/api/addAsset', data)
      console.log(response.data)
      getAllAsset();
      setIsLoading(false);
      setShowForm(false);
    } catch (error) {
      console.log(error)
      setIsLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className='w-[90vw] sm:w-1/2 m-auto'>
        <h1 className='my-6 font-bold text-3xl mx-auto w-fit'>Asset <span className='text-red-400'>DB</span></h1>
        {!showForm ? (
          <button
            className='bg-neutral-500 py-2 px-3 rounded-xl my-9 fixed bottom-0 right-8 flex justify-between w-20 items-center'
            onClick={() => setShowForm(true)}
          >
            <span className='text-red-400 text-xl font-bold' >+</span> New
          </button>
        ) : null}
        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <div>
              <label className='block'>Brand Name</label>
              <input
                {...register('brandName', { required: true })}
                className='border-2 rounded p-3 w-full bg-transparent'
              />
              {errors.brandName && <span className='text-red-500'>Brand Name is required</span>}
            </div>
            <div>
              <label className='block '>Product Name</label>
              <input
                {...register('productName', { required: true })}
                className='border-2 rounded p-3 w-full bg-transparent'
              />
              {errors.productName && <span className='text-red-500'>Product Name is required</span>}
            </div>
            <div>
              <label className='block '>Category</label>
              <input
                {...register('category', { required: true })}
                className='border-2 rounded p-3 w-full bg-transparent'
              />
              {errors.category && <span className='text-red-500'>Category is required</span>}
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-slate-200 text-purple-500 rounded-md hover:bg-slate-100"
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? (
                <div className="flex justify-center items-center gap-3">
                  <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-dotted rounded-full" role="status"></div>
                  <span className="breathing">Loading...</span>
                </div>
              ) : (
                'CREATE '
              )}
            </button>
          </form>
        )}
        {!showForm && <Allassets />}
      </div>
    </> 
  );
}

export default AssetDb;
