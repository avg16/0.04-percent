import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Web3Provider } from "./hooks/Web3hook";
import Registerpage from "./pages/Registerpage";
import Marketplace from "./pages/MarketPlace";
import ClaimPage from "./pages/ClaimPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Web3Provider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Registerpage />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/claim" element={<ClaimPage />} />
        </Routes>
      </Router>
    </Web3Provider>
  );
}

export default App;
