import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Web3Provider } from "./hooks/Web3hook";
import OrganisationRegisterPage from "./pages/CarbonCredit/Registerpage";
import OrganisationMarketplace from "./pages/CarbonCredit/MarketPlace";
import OrganisationClaimPage from "./pages/CarbonCredit/ClaimPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Web3Provider>
      <Router>
        <Navbar />
        <Routes>

          <Route path="organisation/register" element={<OrganisationRegisterPage />} />
          <Route path="organisation/marketplace" element={<OrganisationMarketplace />} />
          <Route path="organisation/claim" element={<OrganisationClaimPage />} />
        </Routes>
      </Router>
    </Web3Provider>
  );
}

export default App;
