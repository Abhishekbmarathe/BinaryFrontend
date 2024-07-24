import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Camera from '../../assets/camera';
import { useNavigate } from 'react-router-dom';

function NewPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    // Retrieve the assetId from local storage
    const assetId = localStorage.getItem('assetId'); // Change key if different

    const onSubmit = async (data) => {
        console.log('Form Data:', data);
        const formData = new FormData();
        formData.append('currentDate', data.currentDate);
        formData.append('description', data.description);

        // Append assetId to the form data
        if (assetId) {
            formData.append('assetId', assetId);
        }

        // Manually get the file input
        const file = fileInputRef.current?.files[0];
        if (file) {
            formData.append('photo', file);
        }

        try {
            const response = await axios.post('https://binarysystemsbackend-mtt8.onrender.com/api/assetPhoto', formData, {
            // const response = await axios.post('http://localhost:3000/api/assetPhoto', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                alert('Upload successful!');
                console.log('Upload successful!');
                navigate(-1);
            } else {
                alert('Upload failed');
                console.error('Upload failed');
            }
        } catch (error) {
            alert('Error uploading the file:', error)
            console.error('Error uploading the file:', error);
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className='w-screen h-[85vh] flex flex-col sm:h-auto'>
            <h1 className="w-fit m-auto font-bold text-2xl my-8">
                Add <span className="text-customColor">Record</span>
            </h1>
            <div className='w-56 h-56 mx-auto'>
                {selectedImage && (
                    <div className="mb-4">
                        <img src={selectedImage} alt="Selected" className="w-full h-full object-cover mb-4" />
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='w-[95vw] sm:w-[50%] m-auto'>
                <div className='flex flex-wrap items-center gap-14 m-auto mb-5'>
                    <div>
                        <input
                            type="text"
                            id="currentDate"
                            className="shadow bg-transparent appearance-none border w-[200px] rounded-xl p-3 leading-tight focus:outline-none focus:shadow-outline"
                            value={new Date().toLocaleDateString()}
                            readOnly
                            {...register('currentDate')}
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="file"
                            id="photo"
                            name="photo"
                            className="shadow bg-transparent appearance-none border rounded w-[50px] py-[5px] leading-tight focus:outline-none focus:shadow-outline absolute invisible"
                            capture="camera"
                            ref={fileInputRef}
                            style={{ opacity: 0, zIndex: -1 }}
                            onChange={handleImageChange}
                        />

                        <div onClick={handleClick} className='w-fit scale-[1.8]'>
                            <Camera />
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block font-bold mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        className="shadow bg-transparent appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        {...register('description', { required: 'Description is required' })}
                    />
                    {errors.description && <span className="text-red-500">{errors.description.message}</span>}
                </div>
                <button
                    type="submit"
                    className="bg-slate-200 hover:opacity-70 w-full transition-all text-purple-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Upload Record
                </button>
            </form>
        </div>
    );
}

export default NewPage;
