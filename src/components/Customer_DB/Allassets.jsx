import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../modules/Api'

function Allassets({ companyName }) {
    const [allassets, setAllassets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await axios.post(`${api}api/getAllClientAssets`, {
                    companyName: companyName
                });
                setAllassets(response.data);
            } catch (error) {
                console.error('There was an error fetching the assets!', error);
            }
        };

        if (companyName) {
            fetchAssets();
        }
    }, [companyName]);

    const handleBrandClick = (productName, brand, category, _id, location, department, serialNo,additionalData) => {
        console.log({ productName, brand, category, _id }); // Debugging line
        navigate(`/productName/${productName}`, { state: { productName, brand, category, _id, location, department, serialNo,additionalData } });
    };

    return (
        <div className="w-[95vw] mx-auto mt-10 sm:max-w-[50vw]">
            <div className=" rounded-lg overflow-hidden mb-4">
                {allassets.length === 0 ? (
                    <p className='text-customColor m-auto w-fit text-3xl'>No assets!</p>
                ) : (
                    <ul className='mt-4'>
                        {allassets.map(asset => (
                            <li key={asset._id} className="mb-2">
                                <div
                                    className="cursor-pointer border border-customColor bg-cyan-50 rounded m-auto p-3"
                                    onClick={() => handleBrandClick(asset.productName, asset.brand, asset.category, asset._id, asset.location, asset.department, asset.serialNo, asset.additionalData)}
                                >
                                    <span>{asset.productName}</span><br />
                                    <span>Location: {asset.location}</span><br />
                                    <span>Department: {asset.department}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Allassets;
