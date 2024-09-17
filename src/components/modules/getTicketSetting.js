// src/apiService.js
import api from './Api'

function getAllAsset() {
    // const apiUrl = 'http://localhost:3000/api/getAllAsset';
    const apiUrl = api + 'getTicketSetting';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('TicketSettings', JSON.stringify(data));
            // console.log('Data has been stored in local storage.');
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

export default getAllAsset;
