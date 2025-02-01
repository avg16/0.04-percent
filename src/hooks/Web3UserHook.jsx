import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import {ORGANISATION_MARKETPLACE_ADDRESS, ORGANISATION_MARKETPLACE_ABI} from "../utils/constants";

export const UserWeb3Context = createContext();

export const UserWeb3Provider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [organization, setOrganization] = useState(null);  // Store organization details
  const [error, setError] = useState("");

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask not installed!");
        return;
      }

      const providerInstance = new ethers.BrowserProvider(window.ethereum);
      await providerInstance.send("eth_requestAccounts", []);

      const signerInstance = await providerInstance.getSigner();
      const address = await signerInstance.getAddress();

      const contractInstance = new ethers.Contract(ORGANISATION_MARKETPLACE_ADDRESS,ORGANISATION_MARKETPLACE_ABI, signerInstance);

      setProvider(providerInstance);
      setSigner(signerInstance);
      setWalletAddress(address);
      setContract(contractInstance);

      // 🔹 Fetch organization details
      const org = await contractInstance.getOrganization(address);
      console.log("Organization details:", org);

      setOrganization({
        name: org.name,
        isRegistered: org.isRegistered,
        netEmission: org.netEmission,
        photoIpfsHash: org.photoIpfsHash,
      });

    } catch (error) {
      console.error("Wallet connection error:", error);
      setError("Failed to connect wallet.");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  return (
    <UserWeb3Context.Provider value={{ walletAddress, provider, signer, contract, organization, connectWallet, error }}>
      {children}
    </UserWeb3Context.Provider>
  );
};
