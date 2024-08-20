import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Openticket() {
    const location = useLocation();
    const { ticketId } = location.state; // Get ticketId from state
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        // Fetch the ticket from local storage
        const allTickets = JSON.parse(localStorage.getItem('AllTickets'));
        const currentTicket = allTickets.find(ticket => ticket._id === ticketId);
        if (currentTicket) {
            setTicket(currentTicket);
        }
    }, [ticketId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicket(prevTicket => ({
            ...prevTicket,
            [name]: value
        }));
    }

    const handleUpdate = () => {
        const allTickets = JSON.parse(localStorage.getItem('AllTickets'));
        const updatedTickets = allTickets.map(t => t._id === ticketId ? ticket : t);
        localStorage.setItem('AllTickets', JSON.stringify(updatedTickets));
        alert('Ticket updated successfully!');
        navigate('/alltickets'); // Navigate back to the ticket list
    }

    const handleDelete = () => {
        const allTickets = JSON.parse(localStorage.getItem('AllTickets'));
        const updatedTickets = allTickets.filter(t => t._id !== ticketId);
        localStorage.setItem('AllTickets', JSON.stringify(updatedTickets));
        alert('Ticket deleted successfully!');
        navigate('/alltickets'); // Navigate back to the ticket list
    }

    if (!ticket) {
        return <p>Loading ticket details...</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Edit Ticket</h1>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Ticket Number</label>
                <input
                    type="text"
                    name="ticketNumber"
                    value={ticket.ticketNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                    type="text"
                    name="companyName"
                    value={ticket.companyName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Updated Date</label>
                <input
                    type="text"
                    name="updatedDate"
                    value={ticket.updatedDate}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                    name="priority"
                    value={ticket.priority}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <input
                    type="text"
                    name="ticketStatus"
                    value={ticket.ticketStatus}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            <div className="flex justify-between">
                <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                    Save Changes
                </button>
                <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white py-2 px-4 rounded-md"
                >
                    Delete Ticket
                </button>
            </div>
        </div>
    );
}

export default Openticket;
