// src/apiService.js

function getAllcustomers() {
    // const apiUrl = 'http://localhost:3000/api/getAllAsset';
    const apiUrl = 'https://binarysystemsbackend-mtt8.onrender.com/api/getAllClients';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('AllClients', JSON.stringify(data));
            console.log('Data has been stored in local storage.');
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

export default getAllcustomers;
