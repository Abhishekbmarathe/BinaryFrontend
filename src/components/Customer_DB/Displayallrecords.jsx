import axios from 'axios';
import { useState, useEffect } from 'react';

function DisplayAssets() {
    const [assets, setAssets] = useState([]);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await axios.get('https://binarysystemsbackend-mtt8.onrender.com/api/assets');
                setAssets(response.data);
            } catch (error) {
                console.error('Error fetching assets:', error);
            }
        };

        fetchAssets();
    }, []);

    if (assets.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className='w-[95vw] m-auto'>
            {assets.map(asset => (
                <div key={asset.assetId} className="asset py-6">
                    <h1>Description : {asset.description}</h1>
                    <h1>Upload date : {asset.uploadDate}</h1>
                    {asset.photo && (
                        <img src={`data:image/jpeg;base64,${asset.photo}`} alt="Asset" className='w-[250px] h-[250px]' />
                    )}
                </div>
            ))}
        </div>
    );
}

export default DisplayAssets;
