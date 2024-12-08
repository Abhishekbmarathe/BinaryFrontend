import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Camera from '../../assets/camera';
import Attach from '../../assets/Attachment';
import api from '../modules/Api';

const TicketImg = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [creator, setCreator] = useState(JSON.parse(localStorage.getItem('userDet')).username);
    const [responseData, setTechfiles] = useState();

    useEffect(() => {
        techFiles();
    }, []); // Empty array ensures this effect runs only once on component mount


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
    const techFiles = async () => {
        try {
            const response = await axios.post(api + 'api/getTechFiles/', { ticketNumber }, {
                headers: {
                    updatedby: creator,
                },
            });
            console.log(response.data); // Debug API response
            setTechfiles(response.data || []); // Ensure response data is valid
        } catch (error) {
            console.error('Error fetching files:', error.response?.data || error.message);
            alert('Error fetching uploaded files.');
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
                techFiles()
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
                {/* Upload button */}
                <button
                    onClick={handleSubmit}
                    className='py-2 px-4 w-fit bg-blue-500 text-white rounded-sm'>
                    Upload
                </button>
            </div>

            <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {responseData && responseData.length > 0 ? (
                        responseData.map((file, index) => (
                            <div
                                key={index}
                                className="border rounded-lg p-4  shadow-customShadow transition-shadow"
                            >
                                <h3 className="text-lg font-medium">{file.fileName}</h3>
                                <a
                                    href={file.photoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    View File
                                </a>
                            </div>
                        ))
                    ) : (
                        <p>No files uploaded yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketImg;
