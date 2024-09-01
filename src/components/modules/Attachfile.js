// fileHandlers.js

// Function to handle file changes
export const handleFileChange = (e, selectedFiles, setSelectedFiles) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...newFiles]);
};

// Function to remove a specific file
export const removeFile = (index, selectedFiles, setSelectedFiles) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
};
