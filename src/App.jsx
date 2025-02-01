import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Registerpage from './pages/Registerpage';
import Marketplace from './pages/MarketPlace';
function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/register" element={<Registerpage />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/login" element={<div>Dashboard</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
