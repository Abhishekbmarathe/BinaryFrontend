// src/apiService.js

function getAllTickets() {

    const user = JSON.parse(localStorage.getItem('userDet'));
    const username = user.username;

    // const apiUrl = 'http://localhost:3000/api/getAllTickets';
    const apiUrl = 'https://binarysystemsbackend-mtt8.onrender.com/api/getAllTickets';

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }), // Passing the username in the body
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('AllTickets', JSON.stringify(data));
        // console.log('Data has been stored in local storage.');
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

export default getAllTickets;
