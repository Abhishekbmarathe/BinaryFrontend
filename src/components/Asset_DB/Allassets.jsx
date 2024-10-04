import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from '../../assets/Home';


function AssetProfile() {
    const [allassets, setAllassets] = useState([]);
    const [editableasset, setEditableasset] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const assetDetails = JSON.parse(localStorage.getItem("getAllAssets"));
        if (assetDetails) {
            setAllassets(assetDetails);
            setEditableasset(assetDetails[0] || {});
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditableasset({
            ...editableasset,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSave = () => {
        const updatedassets = allassets.map(asset =>
            asset._id === editableasset._id ? editableasset : asset
        );
        localStorage.setItem("getAllAssets", JSON.stringify(updatedassets));
        console.log('Saved asset details:', editableasset);
    };

    const handleExpand = (assetId) => {
        navigate(`/asset/${assetId}`);
    };

    const home = () => {
        navigate('/Server/home')
    }

    if (!allassets.length) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 sm:max-w-[50vw]">
            {allassets.map((asset, index) => (
                <div key={index} className="overflow-hidden mb-2">
                    <div
                        className="border-gray-600 border-2 w-[90vw] sm:max-w-full cursor-pointer flex items-center"
                        onClick={() => handleExpand(asset._id)}
                    >
                        <div className='text-customColor text-3xl font-sans font-bold px-5 py-2'>
                            {index + 1}
                        </div>
                        <div className='flex  flex-col'>
                            <span className='font-bold font-sans'>{asset.productName}</span>
                            <span className='font-sans text-sm'>Brand: {asset.brandName}</span>
                        </div>
                    </div>
                </div>
            ))}
            <div className='fixed md:hidden bottom-0 py-2 overflow-y-auto w-full z-90 bg-inherit'>
                <nav className='w-screen flex items-center justify-center px-16 py-2'>
                    <button onClick={home}>
                        <Home />
                    </button>
                </nav>
            </div>
        </div>
    );
}

export default AssetProfile;
