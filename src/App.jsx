import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Registerpage from './pages/Registerpage';
function App() {
  return (
    <Router>
      <div>
        {/* Navigation links */}
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

        {/* Define Routes */}
        <Routes>
          <Route path="/register" element={<Registerpage />} />
          <Route path="/about" element={<div>About</div>} />
          <Route path="/login" element={<div>Dashboard</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
