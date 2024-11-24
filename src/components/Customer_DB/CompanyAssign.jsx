import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios
import { useForm, Controller } from 'react-hook-form';
import api from '../modules/Api';
import { useLocation } from 'react-router-dom';
import FetchallUsers from '../modules/fetchAllusers';
import HamburgerMenu from '../../assets/Hamburg';
import getAllcustomers from '../modules/getAllcustomers';

const CompanyAssign = () => {
    const location = useLocation();
    const { companyName } = location.state || {};
    const [creator, setCreator] = useState(JSON.parse(localStorage.getItem('userDet')).username);
    const [techPermissions, setTechPermissions] = useState([]);

    const { handleSubmit, control, setValue, watch } = useForm({
        defaultValues: {
            technicians: [], // Initialize with an empty array
        },
    });

    const [technicianList, setSuggestions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const companyAssign = () => {
        const techAssignData = JSON.parse(localStorage.getItem('AllClients')) || [];
        const clientData = techAssignData.find((client) => client.companyName === companyName);
        const extractedPermissions = clientData ? clientData.techPermision || [] : [];
        setTechPermissions(extractedPermissions);
        setValue('technicians', extractedPermissions);

    }

    useEffect(() => {
        FetchallUsers();
        const storedUsers = localStorage.getItem('onlyUsers');
        if (storedUsers) {
            const users = JSON.parse(storedUsers);
            const technicianUsers = users
                .filter((user) => user.role === 'technician')
                .map((user) => user.username);
            setSuggestions(technicianUsers);
        }
        companyAssign();


        // Set the initial values for the form based on techPermissions
    }, [companyName, setValue]);

    const filteredTechnicians = technicianList.filter((technician) =>
        technician.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post(api + 'api/updateCompanyPermission', {
                companyName: companyName,
                techPermision: data.technicians,
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'updatedby': creator
                    }
                });
            console.log('Response:', response.data);
            alert('Company Successfully Assigned to technicians!');
            getAllcustomers();

        } catch (error) {
            console.error('Error Assigning Technicians:', error);
            alert('Failed to assign technicians. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="md:w-1/2 md:shadow-customShadow p-6 md:m-auto bg-white rounded-lg"
        >
            <div className="flex justify-between items-center mb-6">
                <h1 className="font-semibold font-sans text-2xl">
                    List Of <span className="text-customColor">Technicians</span>
                </h1>
                <button
                    type="submit"
                    className="px-4 py-1 text-white rounded-sm bg-blue-400 hover:bg-blue-500 transition-all"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </div>

            {/* <HamburgerMenu /> */}
            <div className="my-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="my-4 bg-gray-100 text-gray-700 p-3 rounded-lg shadow-customShadow">
                    Select the technicians to grant access for viewing the company details
                </p>

                {/* Technician List with Checkboxes */}
                <ul className="space-y-2">
                    {filteredTechnicians.map((technician, index) => (
                        <li key={index} className="flex items-center space-x-2">
                            <Controller
                                name="technicians"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="checkbox"
                                        checked={field.value.includes(technician)}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            const updatedTechnicians = isChecked
                                                ? [...field.value, technician]
                                                : field.value.filter((t) => t !== technician);
                                            setValue('technicians', updatedTechnicians);
                                        }}
                                        className="h-5 w-5 accent-blue-500 cursor-pointer"
                                    />
                                )}
                            />
                            <label className="text-gray-700">{technician}</label>
                        </li>
                    ))}
                    {filteredTechnicians.length === 0 && (
                        <li className="text-gray-500">No technicians found.</li>
                    )}
                </ul>
            </div>
        </form>
    );
};

export default CompanyAssign;
