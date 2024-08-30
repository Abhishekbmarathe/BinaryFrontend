import axios from 'axios';

// Function to handle file change event and update the selected files list
export const handleFileChange = (event, selectedFiles, setSelectedFiles) => {
  const files = Array.from(event.target.files);
  setSelectedFiles([...selectedFiles, ...files]);
};

// Function to remove a selected file from the list
export const handleRemoveFile = (index, selectedFiles, setSelectedFiles) => {
  setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
};

// Function to handle form submission and send files to the server
export const handleSubmitt = async (selectedFiles) => {
  const formData = new FormData();
  selectedFiles.forEach((file, index) => {
    formData.append(`file${index}`, file);
  });

  console.log("form-data : ",formData)
  try {
    const response = await axios.post('https://your-server-endpoint/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Files uploaded successfully:', response.data);
  } catch (error) {
    console.error('Error uploading files:', error);
  }
};
