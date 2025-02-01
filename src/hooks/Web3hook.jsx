import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from "../utils/constants";

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
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

      const contractInstance = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signerInstance);

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
        isBuyer: org.isBuyer,
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
    <Web3Context.Provider value={{ walletAddress, provider, signer, contract, organization, connectWallet, error }}>
      {children}
    </Web3Context.Provider>
  );
};
