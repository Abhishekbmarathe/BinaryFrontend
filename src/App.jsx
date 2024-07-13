import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'
import Login from './components/Auth/Login'
import Manageuser from './components/Manage_Users/Manageuser';
import EditUserdetails from './components/Manage_Users/EditUserProfile';
import AssetDb from './components/Asset_DB/AssetDb';
import fetchAndStoreUsers from './components/modules/fetchAllusers'
import getAllAsset from './components/modules/getAllAssets'
import Editassets from './components/Asset_DB/Editallassets'

function App() {
  useState(() => {
    window.onload = () => {
      fetchAndStoreUsers();
      getAllAsset();
    }
  })
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/server/Home" element={<Home />} />
        <Route path="/manage-user" element={<Manageuser />} />
        <Route path="/asset-db" element={<AssetDb />} />
        <Route path="/user/:userId" element={<EditUserdetails />} />
        <Route path="/asset/:assetId" element={<Editassets />} />
      </Routes>
    </Router>
  );
}

export default App;
