import React, { useState } from 'react';
// import { BrowserRouter as  Router, Routes, Route } from 'react-router-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'
import Login from './components/Auth/Login'
import Manageuser from './components/Manage_Users/Manageuser';
import Editprofile from './components/Manage_Users/Editprofile';
import EditUserdetails from './components/Manage_Users/EditUserProfile';
import AssetDb from './components/Asset_DB/AssetDb';
import CreateTicket from './components/Ticket_Creation/Alltickets'

import fetchAndStoreUsers from './components/modules/fetchAllusers'
import getAllAsset from './components/modules/getAllAssets'
import getAllcustomers from './components/modules/getAllcustomers';
import getAllTickets from './components/modules/getAllTickets';

import Editassets from './components/Asset_DB/Editallassets'
import CustomerDb from './components/Customer_DB/CustomerDb'
import EditCustomer from './components/Customer_DB/Editcustomers'
import CustomerDetail from './components/Customer_DB/Customerdetails'
import CustomerAsset from './components/Customer_DB/Customerasset'
import Assetdetails from './components/Customer_DB/Assetdetails'
import CapturePhoto from './components/Customer_DB/CapturePhoto';
import Addrecord from './components/Customer_DB/Addrecord';
import PrivateData from './components/Customer_DB/PrivateData'
import AssetPrivateData from './components/Customer_DB/AssetPrivatedata'

import NewTicket from './components/Ticket_Creation/Newticket';
import Alltickets from './components/Ticket_Creation/Alltickets';
import Settings from './components/Ticket_Creation/Settings';
import Openticket from './components/Ticket_Creation/Openticket';
import Recyclepage from './components/Customer_DB/Recyclepage';
import CompanyAssign from './components/Customer_DB/CompanyAssign';
import TicketInfo from './components/Ticket_Creation/TicketInfo';
import PermitedCompany from './components/Ticket_Creation/PermitedCompany';

import Logs from './components/Logs';



function App() {
  useState(() => {
    window.onload = () => {
      fetchAndStoreUsers();
      getAllAsset();
      getAllcustomers();
      getAllTickets();
    }
  })

  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/server/Home" element={<Home />} />
        <Route path="/manage-user" element={<Manageuser />} />
        <Route path="/Edit-profile" element={<Editprofile />} />
        <Route path="/asset-db" element={<AssetDb />} />
        <Route path="/customer-db" element={<CustomerDb />} />
        <Route path="/create-ticket" element={<CreateTicket />} />

        <Route path="/user/:userId" element={<EditUserdetails />} />
        <Route path="/asset/:assetId" element={<Editassets />} />

        <Route path="/customer/:customerId" element={<CustomerDetail />} />
        <Route path="/customer/edit/:customerId" element={<EditCustomer />} />
        <Route path="/customer/new" element={<CustomerAsset />} />
        <Route path="/productName/:productName" element={<Assetdetails />} />
        <Route path="/capturePhoto" element={<CapturePhoto />} />
        <Route path="/add-record" element={<Addrecord />} />
        <Route path='/customer/private-data' element={<PrivateData />} />
        <Route path='/assetPrivatedet' element={<AssetPrivateData />} />
        <Route path='/customer/companyAssign' element={<CompanyAssign />} />

        <Route path="/newticket" element={<NewTicket />} />
        <Route path="/create-ticket" element={<Alltickets />} />
        <Route path="/openSettings" element={<Settings />} />
        <Route path="/open-ticket" element={<Openticket />} />
        <Route path="/TicketInfo" element={<TicketInfo />} />
        <Route path="/PermitedCompanies" element={<PermitedCompany />} />

        <Route path="/recycle-bin" element={<Recyclepage />} />
        <Route path="/Logs" element={<Logs />} />


      </Routes>
    </Router>
  );
}

export default App;
