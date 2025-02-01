import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import uploadToIPFS from '../utils/ifpsUpload';
import { MARKETPLACE_ABI,MARKETPLACE_ADDRESS } from "../utils/constants";
import './styles/ClaimPage.css';

import { use } from 'react';

const ClaimPage = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [contract, setContract] = useState(null);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const [formData, setFormData] = useState({
    coordinatesX: '',
    coordinatesY: '',
    acres: '',
    demandedTokens: '',
    projectDetails: '',
    projectName: '',
    photos: []
  });

  // Connect wallet and check registration status
  
  const connectWallet = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const contract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);
      setContract(contract);
      console.log("address",address);
      setWalletAddress(address);
      
      // Check registration status
      const org = await contract.getOrganization(address);
      console.log(org);
      setIsRegistered(org.isRegistered);
      setIsBuyer(org.isBuyer);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError('Failed to connect wallet. Please make sure MetaMask is installed.');
    }
  };

  useEffect(() => {
    connectWallet();
   
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    try {
      const files = Array.from(e.target.files);
      const cids = await Promise.all(files.map(file => uploadToIPFS(file)));
      setFormData({ ...formData, photos: cids });
    } catch (error) {
      setError('Error uploading files to IPFS');
    }
  };

  // Submit claim
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (!isRegistered) {
        throw new Error('Organization not registered');
      }
      if (isBuyer) {
        throw new Error('Buyers cannot submit claims');
      }

      const tx = await contract.submitClaim(
        parseInt(formData.coordinatesX),
        parseInt(formData.coordinatesY),
        formData.acres,
        ethers.parseUnits(formData.demandedTokens, 18), // Assuming 18 decimals
        formData.projectDetails,
        formData.projectName,
        formData.photos
      );
      await tx.wait();
      alert('Claim submitted successfully!');
    } catch (error) {
      console.error('Claim submission error:', error);
      setError(error.reason || error.message);
    }
  };

  return (
    <div className="claim-page">
      <h2>Submit Carbon Credit Claim</h2>
      
      {!walletAddress ? (
        <button className="connect-wallet" onClick={connectWallet}>
          Connect Wallet to Submit Claim
        </button>
      ) : (
        <div className="wallet-info">
          <p>Connected as: {walletAddress}</p>
          {!isRegistered && <p className="error">Organization not registered</p>}
          {isBuyer && <p className="error">Buyer accounts cannot submit claims</p>}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Coordinates X:</label>
          <input
            type="number"
            name="coordinatesX"
            value={formData.coordinatesX}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Coordinates Y:</label>
          <input
            type="number"
            name="coordinatesY"
            value={formData.coordinatesY}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Acres:</label>
          <input
            type="number"
            name="acres"
            value={formData.acres}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Requested Tokens:</label>
          <input
            type="number"
            name="demandedTokens"
            value={formData.demandedTokens}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Project Name:</label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Project Details:</label>
          <textarea
            name="projectDetails"
            value={formData.projectDetails}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Project Photos:</label>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            accept="image/*"
          />
          <div className="preview">
            {formData.photos.map((cid, index) => (
              <img 
                key={index} 
                src={`https://ipfs.io/ipfs/${cid}`} 
                alt={`Project preview ${index}`} 
              />
            ))}
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <button 
          type="submit" 
          className="submit-button"
          disabled={!walletAddress || !isRegistered || isBuyer}
        >
          Submit Claim
        </button>
      </form>
    </div>
  );
};

export default ClaimPage;