import React from "react";
import { Link } from "react-router-dom";
import "./styles/Navbar.css"; // Import CSS

/*************  ✨ Codeium Command ⭐  *************/
/**
 * The Navbar component is a React component that renders a navigation
 * bar at the top of each page. It will not render when the user is
 * on the register page.
 *
 * The Navbar component renders the following links:
 * - /claim: Claim a carbon credit
 * - /marketplace: View the marketplace of carbon credits
/******  7c8bdbf2-5e63-4946-8d68-e2caffa25112  *******/
const Navbar = () => {
  if (window.location.pathname.includes("/register")) {
    return null;
  }

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
