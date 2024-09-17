import axios from 'axios';
import { useState, useEffect } from 'react';
import api from '../modules/Api'

function DisplayAssets() {
    const [assets, setAssets] = useState([]);
    const [assetId, setAssetId] = useState(null);

    useEffect(() => {
        // Retrieve assetId from local storage
        const storedAssetId = localStorage.getItem('assetId');
        if (storedAssetId) {
            setAssetId(storedAssetId);
        }
    }, []);

    useEffect(() => {
        const fetchAssets = async () => {
            if (assetId) {
                try {
                    // const response = await axios.get(`http://localhost:3000/api/assets/${assetId}`);
                    const response = await axios.get(`${api}api/assets/${assetId}`);
                    setAssets(response.data);
                } catch (error) {
                    console.error('Error fetching assets:', error);
                }
            }
        };

        fetchAssets();
    }, [assetId]);

    if (assets.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className='w-[95vw] m-auto'>
            {assets.map(asset => (
                <div key={asset.description} className="asset py-6">
                    <h1>Description: {asset.description}</h1>
                    <h1>Upload Date: {asset.uploadDate}</h1>
                    {asset.photo && (
                        <img src={`data:image/jpeg;base64,${asset.photo}`} alt="Asset" className='w-[250px] h-[250px] border-2' />
                    )}
                </div>
            ))}
        </div>
    );
}

export default DisplayAssets;
