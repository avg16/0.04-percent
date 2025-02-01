import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Web3Provider } from "./hooks/Web3hook";
import { UserWeb3Provider } from "./hooks/Web3UserHook";
import OrganisationRegisterPage from "./pages/CarbonCredit/Registerpage";
import OrganisationMarketplace from "./pages/CarbonCredit/MarketPlace";
import OrganisationClaimPage from "./pages/CarbonCredit/ClaimPage";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import UserRegisterPage from "./pages/EcoCoin/Registerpage";


function App() {
  return (
    <Router>

      {/* Organisation Routes - Wrapped in Web3Provider */}
      {/* <UserWeb3Provider>
        <Navbar />
        <Routes>
          <Route path="organisation/register" element={<OrganisationRegisterPage />} />
          <Route path="organisation/marketplace" element={<OrganisationMarketplace />} />
          <Route path="organisation/claim" element={<OrganisationClaimPage />} />
        </Routes>
      </UserWeb3Provider> */}

      {/* User Routes - Wrapped in UserWeb3Provider */}
      <UserWeb3Provider>
        <Routes>
          <Route path="user/register" element={<UserRegisterPage/>} />
        </Routes>
      </UserWeb3Provider>

      {/* Common Routes */}
      <Routes>
        <Route path="register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
