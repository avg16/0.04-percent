import React from "react";
import { Link } from "react-router-dom";
import "./styles/Navbar.css"; // Import CSS

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="co2-label">0.04 CO₂</span>
      </div>
      <div className="nav-right">
        <Link to="/claim" className="nav-item">Claim</Link>
        <Link to="/marketplace" className="nav-item">Marketplace</Link>
        <Link to="/profile" className="nav-item">Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;
