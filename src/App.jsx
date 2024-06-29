import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'
import Login from './components/Auth/Login'
import Manageuser from './components/Manageuser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/server/Home" element={<Home />} />
        <Route path="/manage-user" element={<Manageuser />} />
      </Routes>
    </Router>
  );
}

export default App;
