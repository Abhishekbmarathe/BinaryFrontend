import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import fetchAndStoreassets from '../modules/getAllAssets';
import api from '../modules/Api'
import Delete from '../../assets/Delete';
import useAdminStatus from '../modules/IsAdmin';

function AssetDetail() {
    const { assetId } = useParams();
    const [asset, setAsset] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const ismAdmin = useAdminStatus();


    useEffect(() => {
        const assetDetails = JSON.parse(localStorage.getItem("getAllAssets"));
        const selectedAsset = assetDetails.find(asset => asset._id === assetId);
        setAsset(selectedAsset);
    }, [assetId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAsset({
            ...asset,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const conf = confirm("Are you sure to save the changes ?");
            if (conf) {
                const payload = { ...asset, id: asset._id };
                const response = await axios.post(api + 'api/updateAsset', payload);
                fetchAndStoreassets();
                alert("Saved successfully...");
                navigate('/asset-db');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error saving asset details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const conf = confirm("Are you sure to delete this asset ?");
            if (conf) {
                await axios.post(api + 'api/deleteAsset', { id: asset._id });
                fetchAndStoreassets();
                alert("Asset deleted successfully...");
                navigate('/asset-db');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error deleting asset:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!asset) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="max-w-md mx-auto mt-6 sm:max-w-[50vw]">
                <nav />
                <div className="overflow-auto mb-4">
                    <div className='flex justify-between px-4 mb-6'>
                        <h1 className='font-sans w-fit font-semibold text-2xl'>Edit <span className='text-customColor '>Asset</span></h1>
                        {ismAdmin && (
                            <button
                                onClick={handleDelete}
                            >
                                <Delete />
                            </button>
                        )}
                    </div>
                    <div className="p-4">
                        {isLoading && (
                            <div className="flex justify-center items-center gap-3">
                                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-dotted rounded-full" role="status"></div>
                                <span className="breathing">Loading...</span>
                            </div>
                        )}
                        {!isLoading && (
                            <form onSubmit={(e) => e.preventDefault()}>
                                {Object.keys(asset).map((key, idx) => (
                                    !['createdAt', 'updatedAt', '__v', '_id', 'role'].includes(key) && (
                                        <div key={idx} className="mb-4">
                                            {typeof asset[key] === 'boolean' ? (
                                                <div className="flex items-center">
                                                    <input
                                                        className="mr-2 leading-tight w-6 h-6 cursor-pointer text-black"
                                                        type="checkbox"
                                                        id={`${key}-${idx}`}
                                                        name={key}
                                                        checked={asset[key]}
                                                        onChange={handleChange}
                                                    />
                                                    <span className="">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <label className="block text-xl text-customColor font-sans  font-medium mb-2" htmlFor={`${key}-${idx}`}>
                                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                                    </label>
                                                    <input
                                                        className="border-2 border-gray-600 rounded w-full py-4 px-3 bg-transparent text-black  focus:outline-none sm:py-4 sm:rounded-xl"
                                                        type="text"
                                                        id={`${key}-${idx}`}
                                                        name={key}
                                                        value={asset[key]}
                                                        onChange={handleChange}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    )
                                ))}
                                <button
                                    className="w-3/4 m-auto mt-10 block bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={handleSave}
                                >
                                    UPDATE
                                </button><br />
                                {/* <button
                                    className="block bg-slate-200 hover:bg-slate-100 text-red-400 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={handleDelete}
                                >
                                    DELETE
                                </button> */}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AssetDetail;
