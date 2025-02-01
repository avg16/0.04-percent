import React, { useState, useContext } from "react";
import { Web3Context } from "../../hooks/Web3hook";
import { useIPFS } from "../../context/IpfsContext"; // Import the IPFS context hook
import "./styles/OrganisationRegisterPage.css";

export default function OrganisationRegisterPage() {
  const { walletAddress, contract, connectWallet, disconnectWallet, error: web3Error } = useContext(Web3Context);
  const { uploadFile, error: ipfsError } = useIPFS(); // Use the IPFS context

  const [formData, setFormData] = useState({
    name: "",
    netEmission: "",
    photo: null, // Changed from photoIpfsHash to photo
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLoading(true);

    try {
      if (!contract) {
        throw new Error("Contract not initialized. Try reconnecting the wallet.");
      }

      // Upload photo to IPFS if it exists
      let photoIpfsHash = "";
      if (formData.photo) {
        try {
          photoIpfsHash = await uploadFile(formData.photo);
          if (!photoIpfsHash) {
            throw new Error("Failed to upload photo to IPFS");
          }
        } catch (ipfsError) {
          throw new Error(`IPFS Upload Error: ${ipfsError.message}`);
        }
      }

      alert("ipfsHash: " + photoIpfsHash);
      // Register organization
      const tx = await contract.registerOrganization(
        formData.name,
        formData.netEmission,
        photoIpfsHash
      );

      await tx.wait();
      alert("Organization registered successfully!");

      // Clear form after successful registration
      setFormData({
        name: "",
        netEmission: "",
        photo: null
      });

    } catch (error) {
      console.error("Registration error:", error);
      setLocalError(error.reason || error.message || "Failed to register organization. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic file validation
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setLocalError("File size too large. Maximum size is 10MB.");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setLocalError("Only image files are allowed.");
        return;
      }
      setLocalError("");
      setFormData({ ...formData, photo: file });
    }
  };

  const renderWalletButton = () => (
    <div className="wallet-connect-container">
      <div className="wallet-icon">🦊</div>
      <h3>Connect Your Wallet</h3>
      <p>Please connect your MetaMask wallet to continue</p>
      <button onClick={connectWallet} className="connect-button">
        Connect MetaMask
      </button>
    </div>
  );

  const renderWalletInfo = () => (
    <div className="wallet-info">
      <span>Connected Wallet</span>
      <div className="wallet-address">{walletAddress}</div>
      <button onClick={disconnectWallet} className="disconnect-button">
        Disconnect
      </button>
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="registration-form">
      {renderWalletInfo()}

      <div className="form-group">
        <label>Organization Name</label>
        <input
          type="text"
          required
          placeholder="Enter organization name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Net Emission (tons CO2)</label>
        <input
          type="number"
          required
          placeholder="Enter net emission"
          value={formData.netEmission}
          onChange={(e) => setFormData({ ...formData, netEmission: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Organization Photo</label>
        <div className="file-input-wrapper">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {formData.photo && (
            <div className="file-info">
              Selected: {formData.photo.name}
            </div>
          )}
        </div>
      </div>

      {(localError || web3Error || ipfsError) && (
        <div className="error-message">
          {localError || web3Error || ipfsError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`submit-button ${loading ? "loading" : ""}`}
      >
        {loading ? "Registering..." : "Register Organization"}
      </button>
    </form>
  );

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Register Organization</h1>
        {!walletAddress ? renderWalletButton() : renderForm()}
      </div>
    </div>
  );
}