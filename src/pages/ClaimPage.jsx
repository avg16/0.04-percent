import { useState, useContext } from 'react';
import { ethers } from 'ethers';
import uploadToIPFS from '../utils/ifpsUpload';
import { Web3Context } from '../hooks/Web3hook';
import './styles/ClaimPage.css';

const ClaimPage = () => {
  const { walletAddress, contract, connectWallet, organization, error } = useContext(Web3Context); // Use global Web3 state

  const [formData, setFormData] = useState({
    coordinatesX: '',
    coordinatesY: '',
    acres: '',
    demandedTokens: '',
    projectDetails: '',
    projectName: '',
    photos: []
  });
  const [localError, setLocalError] = useState('');

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
      setLocalError('Error uploading files to IPFS');
    }
  };

  // Submit claim
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      if (!contract) throw new Error("Contract not initialized. Try reconnecting the wallet.");
      if (!organization?.isRegistered) throw new Error("Organization not registered.");

      const tx = await contract.submitClaim(
        parseInt(formData.coordinatesX),
        parseInt(formData.coordinatesY),
        formData.acres,
        ethers.parseUnits(String(formData.demandedTokens), 18), // Ensure it's a string
        formData.projectDetails,
        formData.projectName,
        formData.photos
      );

      const receipt = await tx.wait(); // Wait for transaction confirmation

        // 🔹 Extract the claim ID from the event
        const event = receipt.logs.find(log => log.fragment.name === "ClaimSubmitted");
        if (event) {
            const claimId = event.args.claimId.toString();
            console.log("Claim submitted with ID:", claimId);
            alert(`Claim submitted successfully! Claim ID: ${claimId}`);
        } else {
            console.warn("ClaimSubmitted event not found!");
        }
    } catch (error) {
      console.error('Claim submission error:', error);
      setLocalError(error.reason || error.message);
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

        {localError && <div className="error">{localError}</div>}

        <button 
          type="submit" 
          className="submit-button"
        >
          Submit Claim
        </button>
      </form>
    </div>
  );
};

export default ClaimPage;
