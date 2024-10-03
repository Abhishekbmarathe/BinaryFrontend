import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import fetchAndStoreassets from '../modules/getAllAssets';
import api from '../modules/Api'

function AssetDetail() {
    const { assetId } = useParams();
    const [asset, setAsset] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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
            <div className="max-w-md mx-auto mt-10 sm:max-w-[50vw]">
                <nav />
                <div className="shadow-md rounded-lg overflow-hidden mb-4">
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
                                                        className="mr-2 leading-tight w-6 h-6 cursor-pointer"
                                                        type="checkbox"
                                                        id={`${key}-${idx}`}
                                                        name={key}
                                                        checked={asset[key]}
                                                        onChange={handleChange}
                                                    />
                                                    <span className="text-white">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <label className="block text-white text-sm font-bold mb-2" htmlFor={`${key}-${idx}`}>
                                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                                    </label>
                                                    <input
                                                        className="shadow appearance-none border-2  rounded w-full py-4 px-3 bg-transparent text-white leading-tight focus:outline-none focus:shadow-outline sm:py-4 sm:rounded-xl"
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
                                    className="w-full block bg-slate-200 hover:bg-slate-100 text-purple-600 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={handleSave}
                                >
                                    UPDATE
                                </button><br />
                                <button
                                    className="block bg-slate-200 hover:bg-slate-100 text-red-400 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={handleDelete}
                                >
                                    DELETE
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AssetDetail;
