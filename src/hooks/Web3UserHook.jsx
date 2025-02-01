import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import {USER_MARKETPLACE_ADDRESS, USER_MARKETPLACE_ABI} from "../utils/constants";

export const UserWeb3Context = createContext();

export const UserWeb3Provider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [user, setUser] = useState(null);  // Store organization details
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
      const contractInstance = new ethers.Contract(USER_MARKETPLACE_ADDRESS,USER_MARKETPLACE_ABI, signerInstance);
      console.log("contractInstance",contractInstance);
      setProvider(providerInstance);
      setSigner(signerInstance);
      setWalletAddress(address);
      setContract(contractInstance);
      // const user = await contractInstance.getUser(address);
      // setUser({
      //   name: user.name,
      //   isRegistered: user.isRegistered,
      //   totalClaimsSubmitted: user.totalClaimsSubmitted,
      //   photoIpfsHash: user.profilePhotoIpfsHash,
      //   totalVotesCast: user.totalVotesCast,
      //   correctVotes: user.correctVotes,
      //   reputationScore: user.reputationScore,
      //   successfulClaims: user.successfulClaims
      // });
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
    <UserWeb3Context.Provider value={{ walletAddress, provider,signer, contract,user,connectWallet, error }}>
      {children}
    </UserWeb3Context.Provider>
  );
};
