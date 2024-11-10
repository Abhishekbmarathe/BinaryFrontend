import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Camera from '../../assets/camera';
import { useNavigate } from 'react-router-dom';
import api from '../modules/Api';
import GalleryIcon from '../../assets/img'; // Assuming you have a gallery icon

function NewPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const galleryInputRef = useRef(null); // New reference for the gallery input

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
        const file = fileInputRef.current?.files[0] || galleryInputRef.current?.files[0]; // Check both inputs
        if (file) {
            formData.append('photo', file);
        }

        try {
            const response = await axios.post(api + 'api/assetPhoto', formData, {
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
            alert('Error uploading the file:', error);
            console.error('Error uploading the file:', error);
        }
    };

    const handleClick = (inputRef) => {
        inputRef.current.click();
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
        <div className="min-h-screen flex flex-col items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <h1 className="text-3xl font-semibold font-sans text-gray-900 mb-10">
                Add <span className="text-customColor">Record</span>
            </h1>
            <div className="w-72 h-full mb-8">
                {selectedImage && (
                    <div className="rounded-lg shadow-lg overflow-hidden">
                        <img src={selectedImage} alt="Selected" className="w-full h-96 object-cover" />
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg bg-white p-8 shadow-lg rounded-lg">
                <div className="flex flex-wrap justify-between items-center mb-8">
                    <div className="w-full sm:w-auto">
                        <input
                            type="text"
                            id="currentDate"
                            className="w-full sm:w-auto bg-gray-100 text-gray-800 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={new Date().toLocaleDateString()}
                            readOnly
                            {...register('currentDate')}
                        />
                    </div>
                    <div className="flex items-center gap-8">
                        <div>
                            <input
                                type="file"
                                id="photo"
                                name="photo"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                            />
                            <div onClick={() => handleClick(fileInputRef)} className="cursor-pointer p-3 rounded-lg bg-blue-100 hover:bg-blue-200">
                                <Camera className="text-blue-500 w-8 h-8" />
                            </div>
                        </div>
                        <div>
                            <input
                                type="file"
                                id="gallery"
                                name="gallery"
                                className="hidden"
                                ref={galleryInputRef}
                                onChange={handleImageChange}
                            />
                            <div onClick={() => handleClick(galleryInputRef)} className="cursor-pointer p-[12px] rounded-lg bg-customColor hover:bg-green-200">
                                <GalleryIcon className="text-green-500 w-8 h-8" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-8">
                    <label htmlFor="description" className="block text-xl font-medium text-gray-700 mb-3">
                        Description
                    </label>
                    <textarea
                        id="description"
                        className="w-full h-40 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register('description', { required: 'Description is required' })}
                    />
                    {errors.description && <span className="text-red-600 text-sm mt-2">{errors.description.message}</span>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Upload Record
                </button>
            </form>
        </div>
    );
    
}

export default NewPage;
