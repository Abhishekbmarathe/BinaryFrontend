import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Camera from '../../assets/camera';
import Imag from '../../assets/img';

function NewPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    const onSubmit = (data) => {
        console.log(data);
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
        <div className='w-screen h-[85vh] flex flex-col'>
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
            <form onSubmit={handleSubmit(onSubmit)} className='w-[95vw] m-auto'>
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
                            className="shadow bg-transparent appearance-none border rounded w-[50px] py-[5px] leading-tight focus:outline-none focus:shadow-outline absolute invisible"
                            capture="camera"
                            {...register('photo'/*, { required: 'Photo is required' }*/)}
                            ref={fileInputRef}
                            style={{ opacity: 0, zIndex: -1 }} // Hide the file input
                            onChange={handleImageChange}
                        />
                        <div onClick={handleClick} className='w-fit scale-[1.8]'>
                            <Camera />
                        </div>
                        {/* {errors.photo && <span className="text-red-500">{errors.photo.message}</span>} */}
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block font-bold mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        className="shadow bg-transparent appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        {...register('description', { required: 'Discription is required' })}
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
