import axios from 'axios';
import { useState, useEffect } from 'react';
import api from '../modules/Api';
import Close from '../../assets/Close';

function DisplayAssets() {
    const [assets, setAssets] = useState([]);
    const [assetId, setAssetId] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState(null); // For popup
    const [tooltipVisible, setTooltipVisible] = useState(null); // Track visible tooltip by index

    useEffect(() => {
        const storedAssetId = localStorage.getItem('assetId');
        if (storedAssetId) {
            setAssetId(storedAssetId);
        }
    }, []);

    useEffect(() => {
        const fetchAssets = async () => {
            if (assetId) {
                try {
                    const response = await axios.get(`${api}api/assets/${assetId}`);
                    setAssets(response.data);
                } catch (error) {
                    console.error('Error fetching assets:', error);
                }
            }
        };

        fetchAssets();
    }, [assetId]);

    // Function to open popup with selected asset
    const openPopup = (asset) => {
        setSelectedAsset(asset);
        console.log(asset);
    };

    // Function to close popup
    const closePopup = () => {
        setSelectedAsset(null);
    };

    // Function to handle delete button click inside tooltip
    const handleDeleteClick = async (e, assetId, index) => {
        e.stopPropagation(); // Prevent triggering the popup
        try {
            await axios.post(`${api}api/deleteAsset`, assetId); // Call the delete API
            setAssets(assets.filter(asset => asset.assetId !== assetId)); // Remove asset from state
            setTooltipVisible(null); // Close tooltip after deletion
            console.error('asset photo deleted successfully', error);
        } catch (error) {
            console.error('Error deleting asset:', error);
        }
    };

    // Toggle tooltip visibility using index
    const toggleTooltip = (e, index) => {
        e.stopPropagation(); // Prevent triggering the popup
        setTooltipVisible(prev => (prev === index ? null : index)); // Toggle the tooltip for the current asset by index
    };

    if (assets.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className='w-[95vw] md:w-[80vw] lg:w-[70vw] mx-auto mt-8'>
            {assets.map((asset, index) => (
                <div
                    key={asset._id || index} // Use a fallback key if asset._id is missing
                    className="relative asset bg-cyan-100 flex items-center justify-between gap-4 border border-customColor p-2 rounded mb-3 cursor-pointer hover:bg-cyan-200 transition"
                    onClick={() => openPopup(asset)}
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
                        className='w-fit float-right z-30 p-1 text-[8px]'
                        onClick={(e) => toggleTooltip(e, index)} // Use index instead of asset.photoFileId
                    >
                        ●●●
                    </button>

                    {/* Tooltip for Delete */}
                    {tooltipVisible === index && (
                        <div className="absolute right-0 top-2  mt-2 w-24 bg-white border border-gray-300 shadow-lg rounded p-2">
                            <button
                                className="w-full text-left text-red-500 hover:text-red-700"
                                onClick={(e) => handleDeleteClick(e, asset.assetId, index)} // Use asset.assetId for deletion
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {/* Popup Modal */}
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
