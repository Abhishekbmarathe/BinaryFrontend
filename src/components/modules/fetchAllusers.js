// src/apiService.js
import api from './Api'

function fetchAndStoreUsers() {
    const apiUrl = api + 'api/getallusers';
    // const apiUrl = 'http://localhost:3000/api/getallusers';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Store the fetched data in local storage with the key "allUsers"
            localStorage.setItem('allUsers', JSON.stringify(data));
            // console.log('Data has been stored in local storage.');
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

export default fetchAndStoreUsers;
