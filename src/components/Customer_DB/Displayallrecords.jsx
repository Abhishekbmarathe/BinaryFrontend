import axios from 'axios';
import { useState, useEffect } from 'react';
import api from '../modules/Api';
import Close from '../../assets/Close';

function DisplayAssets() {
    const [assets, setAssets] = useState([]);
    const [assetId, setAssetId] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState(null); // For popup

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
    };

    // Function to close popup
    const closePopup = () => {
        setSelectedAsset(null);
    };

    if (assets.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className='w-[95vw] m-auto mt-8'>
            {assets.map(asset => (
                <div
                    key={asset.description}
                    className="asset bg-cyan-100 flex items-center gap-2 border-customColor px-3 py-1 rounded mb-2 border cursor-pointer"
                    onClick={() => openPopup(asset)} // Open popup on click
                >
                    {asset.photo && (
                        <img
                            src={`data:image/jpeg;base64,${asset.photo}`}
                            alt="Asset"
                            className='w-[35px] h-[35px] rounded border-2'
                        />
                    )}
                    <h1 className='font-sans'>
                        <span className='text-xs'>Upload Date:</span> <span className='font-semibold'>{asset.uploadDate}</span>
                    </h1>
                </div>
            ))}

            {/* Popup Modal */}
            {selectedAsset && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-lg w-[90vw] md:w-[50vw]">
                        <button
                            className="absolute top-4 right-4 text-xl font-bold bg-red-500 p-1 rounded outline-none"
                            onClick={closePopup}
                        >
                            <Close />
                        </button>
                        {selectedAsset.photo && (
                            <img
                                src={`data:image/jpeg;base64,${selectedAsset.photo}`}
                                alt="Selected Asset"
                                className="w-full h-auto mb-4"
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
