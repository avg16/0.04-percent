import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import Registerpage from './pages/Registerpage';
import Marketplace from './pages/MarketPlace';
import ClaimPage from './pages/ClaimPage';
import Navbar from './components/Navbar';
function App() {
  return (
    <Router>
      <div>
      <Navbar/>
        <Routes>
          <Route path="/register" element={<Registerpage />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/login" element={<div>Dashboard</div>} />
          <Route path="/claim" element={<ClaimPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
