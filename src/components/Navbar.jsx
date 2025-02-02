import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./styles/Navbar.css"; // Import custom CSS for styling
import MetaMaskLogo from "../assets/metamask-logo.png"; // Import MetaMask logo as PNG (or SVG)

const Navbar = () => {
  const location = useLocation(); // This will trigger a re-render when the route changes

  // Hides the navbar on the register page
  if (location.pathname.includes("/register")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Marketplace", href: "/organisation/marketplace/" },
    { label: "Claims", href: "/organisation/claim/" },
  ];

  return (
    <div className="fixed w-full z-50 bg-black bg-opacity-70 backdrop-blur-lg text-white font-poppins px-10">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* CO₂ Label Section */}
          <div className="nav-left">
            <span className="co2-label">0.04% CO₂</span>
          </div>

          {/* Navigation and Connect Wallet Button */}
          <div className="flex items-center">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`whitespace-nowrap transition-colors ${location.pathname === item.href
                      ? "text-yellow-400 font-bold" // Highlight active item
                      : "text-white hover:text-yellow-400"
                    }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Register Button */}
              <Link to="/organisation/register">
                <button className="flex items-center bg-yellow-800 text-black px-4 py-2 rounded hover:bg-yellow-600 transition-colors">
                  <img src={MetaMaskLogo} alt="MetaMask" className="h-6 w-6 mr-2" />
                  Register
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
