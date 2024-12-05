import React, { useState } from 'react';
import axios from 'axios';
import Camera from '../../assets/camera';
import Attach from '../../assets/Attachment';
import api from '../modules/Api';

const TicketImg = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [creator, setCreator] = useState(JSON.parse(localStorage.getItem('userDet')).username);


    // Function to handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };
    const ticketNumber = localStorage.getItem('ticketNumber')
    // Function to handle capture from camera
    const handleCapture = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const mediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'image/jpeg' });
                setSelectedFile(new File([blob], 'capture.jpg', { type: 'image/jpeg' }));
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setTimeout(() => mediaRecorder.stop(), 3000); // Capture for 3 seconds
        } catch (error) {
            console.error('Error accessing the camera:', error);
        }
    };

    // Function to send file to the API
    const handleSubmit = async () => {
        if (!selectedFile) {
            alert('Please select or capture a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('photo', selectedFile); // 'photo' matches the backend field
        formData.append('ticketNumber', ticketNumber);
        formData.append('filename', selectedFile.name); // Explicitly send the filename

        try {
            const response = await axios.post(api + 'api/techFileAttach', formData, {
                headers: {
                    'updatedby': creator, // Add the `creator` value in the headers
                },
            });
            if (response.data.status) {
                alert('File uploaded successfully');
            } else {
                alert('File upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error.response?.data || error.message);
            alert('Error uploading file.');
        }
    };

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex gap-4'>
                <button
                    onClick={handleCapture}
                    className='shadow-customShadow py-2 px-4 flex items-center gap-2 rounded-sm bg-gray-100'>
                    <Camera />
                    <span>Capture</span>
                </button>

                {/* Hidden file input */}
                <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <button
                    onClick={() => document.getElementById('fileInput').click()}
                    className='flex items-center shadow-customShadow py-2 px-4 rounded-sm gap-2 bg-gray-100'>
                    <div className='bg-customColor block w-fit rounded-md p-[1px]'>
                        <Attach />
                    </div>
                    <span>Attach</span>
                </button>
            </div>

            {/* Upload button */}
            <button
                onClick={handleSubmit}
                className='py-2 px-4 bg-blue-500 text-white rounded-sm'>
                Upload
            </button>
        </div>
    );
};

export default TicketImg;
