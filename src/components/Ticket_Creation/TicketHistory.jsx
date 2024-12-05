import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import api from '../modules/Api';

const TicketHistory = () => {
    const [responseData, setResponseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFetch = async () => {
        setLoading(true);
        try {
            const response = await axios.post(api + 'api/getOrCreateStartStop', {
                // Add your request payload here (if needed)
                key1: 'value1',  // Example data
                key2: 'value2',
            });
            setResponseData(response.data);
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleFetch} className="btn">Fetch Data</button>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {responseData && <pre>{JSON.stringify(responseData, null, 2)}</pre>}
        </div>
    );
}

export default TicketHistory
