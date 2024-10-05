import axios from 'axios';
import { useState, useEffect } from 'react';
import api from '../modules/Api';
import Close from '../../assets/Close';

function DisplayAssets() {
    const [assets, setAssets] = useState([]); // Store assets fetched from API
    const [assetId, setAssetId] = useState(null); // Store asset ID from localStorage
    const [selectedAsset, setSelectedAsset] = useState(null); // For displaying asset in a popup
    const [tooltipVisible, setTooltipVisible] = useState(null); // Track the tooltip visibility for delete actions

    // Fetch assetId from localStorage when the component mounts
    useEffect(() => {
        const storedAssetId = localStorage.getItem('assetId');
        if (storedAssetId) {
            setAssetId(storedAssetId);
        }
    }, []);

    // Fetch assets from API based on assetId
    useEffect(() => {
        const fetchAssets = async () => {
            if (assetId) {
                try {
                    const response = await axios.get(`${api}api/assets`, {
                        params: { assetId }
                    });
                    setAssets(response.data);
                } catch (error) {
                    console.error('Error fetching assets:', error);
                }
            }
        };

        fetchAssets();
    }, [assetId]);

    // Function to open the popup with the selected asset details
    const openPopup = (asset) => {
        setSelectedAsset(asset);
        console.log('Selected Asset:', asset);
    };

    // Function to close the popup
    const closePopup = () => {
        setSelectedAsset(null);
    };

    // Function to handle delete action for asset photo
    const handleDeleteClick = async (e, photoLink) => {
        e.preventDefault(); // Prevent default button behavior
        e.stopPropagation(); // Stop the click event from propagating to the parent div

        // Show confirmation dialog
        const isConfirmed = window.confirm('Are you sure you want to delete this photo? This action cannot be undone.');

        // If confirmed, proceed with the delete request
        if (isConfirmed) {
            try {
                const response = await axios.post(api + 'api/deletePhoto', { fileUrl: photoLink });

                if (response.status === 200) {
                    alert('Photo deleted successfully');
                    console.log('Photo deleted successfully:', response.data);
                    // Optionally update the assets list after successful deletion
                    setAssets(assets.filter(asset => asset.photoLink !== photoLink));
                } else {
                    console.error('Failed to delete photo:', response.data);
                }
            } catch (error) {
                alert('Error deleting photo');
                console.error('Error deleting photo:', error);
            }
        } else {
            console.log('Delete action cancelled by user');
        }
    };

    // Function to toggle tooltip visibility for delete actions
    const toggleTooltip = (e, index) => {
        e.stopPropagation(); // Prevent triggering the popup
        setTooltipVisible(prev => (prev === index ? null : index)); // Toggle the tooltip for the current asset by index
    };

    // Display loading state if no assets are available
    if (assets.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className='w-[95vw] md:w-[80vw] lg:w-[70vw] mx-auto mt-8'>
            {assets.map((asset, index) => (
                <div
                    key={asset._id || index} // Use fallback key if asset._id is missing
                    className="relative asset bg-cyan-100 flex items-center justify-between gap-4 border border-customColor p-2 rounded mb-3 cursor-pointer hover:bg-cyan-200 transition"
                    onClick={() => openPopup(asset)} // Open popup on asset click
                >
                    <div className='flex items-center gap-4'>
                        {asset.photoLink && (
                            <img
                                src={`${asset.photoLink}`}
                                alt="Asset"
                                className='w-[35px] h-[35px] md:w-[50px] md:h-[50px] rounded border border-white object-cover'
                            />
                        )}
                        <h1 className='font-sans'>
                            <span className='text-xs'>Upload Date:</span> <span className='font-semibold'>{asset.uploadDate}</span>
                        </h1>
                    </div>
                    <button
                        className='w-fit float-right z-30 p-1 text-[6px] rotate-90'
                        onClick={(e) => toggleTooltip(e, index)} // Toggle tooltip for the current asset
                    >
                        ●●●
                    </button>

                    {/* Tooltip for Delete */}
                    {tooltipVisible === index && (
                        <div className="absolute right-0 top-2 mt-2 w-24 bg-white border border-gray-300 shadow-lg rounded p-2">
                            <button
                                className="w-full text-left text-red-500 hover:text-red-700"
                                onClick={(e) => handleDeleteClick(e, asset.photoLink)} // Handle delete click
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {/* Popup Modal for displaying selected asset details */}
            {selectedAsset && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="relative bg-white p-4 rounded-lg w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[60vw] overflow-scroll">
                        <button
                            className="absolute top-4 right-4 text-xl font-bold bg-red-500 p-2 rounded-full outline-none"
                            onClick={closePopup}
                        >
                            <Close />
                        </button>
                        {selectedAsset.photoLink && (
                            <img
                                src={`${selectedAsset.photoLink}`}
                                alt="Selected Asset"
                                className="w-full md:h-[80vh] mb-4 object-cover"
                            />
                        )}
                        <h1 className="text-lg font-semibold">Upload Date: {selectedAsset.uploadDate}</h1>
                        <p className="mt-2 text-gray-700">Description: {selectedAsset.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DisplayAssets;
