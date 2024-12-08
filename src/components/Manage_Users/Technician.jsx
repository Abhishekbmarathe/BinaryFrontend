import React, { useState, useEffect } from 'react';
import Hammenu from '../../assets/HamburgMenu';
import Hamburg from '../../assets/Hamburg';
import axios from 'axios';
// import Alltickets from '../Manage_Users/TechTickets';
import Alltickets from '../Ticket_Creation/Alltickets';
import api from '../modules/Api'; // Ensure this points to your base URL (e.g., 'http://localhost:3000/')

const Technician = () => {
    const [username, setUsername] = useState('');

    // Fetch user details from localStorage when the component mounts
    useEffect(() => {
        const userDetails = localStorage.getItem('userDet'); // Fetch data from localStorage
        if (userDetails) {
            const parsedDetails = JSON.parse(userDetails); // Parse the JSON string
            setUsername(parsedDetails.username || ''); // Set the username if available
        }
    }, []);

    // Fetch tickets when username is available
    // useEffect(() => {
    //     if (username) {  // Ensure username is set before making the API call
    //         getTechTicket();
    //     }
    // }, [username]);

    // Function to fetch technical tickets
    // const getTechTicket = async () => {
    //     try {
    //         localStorage.removeItem('AllTickets'); // Clear old data
    //         const response = await axios.post(`${api}api/getTechTicket`, {
    //             username, // Payload
    //         });

    //         localStorage.setItem('AllTickets', JSON.stringify(response.data)); // Store the new data
    //         console.log('Response:', response.data);
    //     } catch (error) {
    //         console.error('Error fetching tech ticket:', error);
    //     }
    // };

    return (
        <div>
            <Alltickets />
        </div>
    );
};

export default Technician;
