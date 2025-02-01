import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { ORGANISATION_MARKETPLACE_ADDRESS, ORGANISATION_MARKETPLACE_ABI } from "../utils/constants";

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [organization, setOrganization] = useState(null);  // Store organization details
  const [error, setError] = useState("");

  // Connect wallet function
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

      const contractInstance = new ethers.Contract(
        ORGANISATION_MARKETPLACE_ADDRESS,
        ORGANISATION_MARKETPLACE_ABI,
        signerInstance
      );

      setProvider(providerInstance);
      setSigner(signerInstance);
      setWalletAddress(address);
      setContract(contractInstance);

      // Fetch organization details
      const org = await contractInstance.getOrganization(address);
      console.log("Organization detail:", org);

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

  // Disconnect wallet function
  const disconnectWallet = () => {
    setWalletAddress("");
    setProvider(null);
    setSigner(null);
    setContract(null);
    setOrganization(null); // Reset organization details
    setError(""); // Clear any existing errors
  };

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  return (
    <Web3Context.Provider value={{ walletAddress, provider, signer, contract, organization, connectWallet, disconnectWallet, error }}>
      {children}
    </Web3Context.Provider>
  );
};
