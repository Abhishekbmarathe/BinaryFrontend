import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'
import Login from './components/Auth/Login'
import Manageuser from './components/Manage_Users/Manageuser';
import EditUserdetails from './components/Manage_Users/EditUserProfile';
import AssetDb from './components/Asset_DB/AssetDb';

import fetchAndStoreUsers from './components/modules/fetchAllusers'
import getAllAsset from './components/modules/getAllAssets'
import getAllcustomers from './components/modules/getAllcustomers';

import Editassets from './components/Asset_DB/Editallassets'
import CustomerDb from './components/Customer_DB/CustomerDb'
import EditCustomer from './components/Customer_DB/Editcustomers'
import CustomerDetail from './components/Customer_DB/Customerdetails'
import CustomerAsset from './components/Customer_DB/Customerasset'
import Assetdetails from './components/Customer_DB/Assetdetails'
import CapturePhoto from './components/Customer_DB/CapturePhoto';
import Addrecord from './components/Customer_DB/Addrecord';



function App() {
  useState(() => {
    window.onload = () => {
      fetchAndStoreUsers();
      getAllAsset();
      getAllcustomers();
    }
  })

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/server/Home" element={<Home />} />
        <Route path="/manage-user" element={<Manageuser />} />
        <Route path="/asset-db" element={<AssetDb />} />
        <Route path="/customer-db" element={<CustomerDb />} />

        <Route path="/user/:userId" element={<EditUserdetails />} />
        <Route path="/asset/:assetId" element={<Editassets />} />

        <Route path="/customer/:customerId" element={<CustomerDetail />} />
        <Route path="/customer/edit/:customerId" element={<EditCustomer />} />
        <Route path="/customer/new" element={<CustomerAsset />} />
        <Route path="/productName/:productName" element={<Assetdetails />} />
        <Route path="/capturePhoto" element={<CapturePhoto />} />
        <Route path="/add-record" element={<Addrecord />} />
      </Routes>
    </Router>
  );
}

export default App;
