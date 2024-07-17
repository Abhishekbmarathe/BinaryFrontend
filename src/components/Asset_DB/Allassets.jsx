import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


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

    if (!allassets.length) {
        return <div>Loading...</div>;
    }

    return (
            <div className="max-w-md mx-auto mt-10 sm:max-w-[50vw]">
                {allassets.map((asset, index) => (
                    <div key={index} className="shadow-md rounded-lg overflow-hidden mb-4">
                        <div
                            className="border-cyan-500 border-2 w-[90vw] sm:max-w-full rounded-xl p-4 cursor-pointer flex gap-4 items-center"
                            onClick={() => handleExpand(asset._id)}
                        >
                            <span>{asset.category}</span>
                        </div>
                    </div>
                ))}
            </div>
    );
}

export default AssetProfile;
