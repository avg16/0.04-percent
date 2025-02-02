import { useState, useContext } from 'react';
import { ethers } from 'ethers';
import uploadToIPFS from '../../utils/ifpsUpload';
import { Web3Context } from '../../hooks/Web3hook';

const OrganisationClaimPage = () => {
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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h2 className="text-3xl font-semibold text-center mb-8">Submit Carbon Credit Claim</h2>

      {!walletAddress ? (
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 w-full mb-8"
          onClick={connectWallet}
        >
          Connect Wallet to Submit Claim
        </button>
      ) : (
        <div className="wallet-info text-center mb-8">
          <p className="text-lg">Connected as: {walletAddress}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="form-group mb-4">
          <label className="block text-lg mb-2">Coordinates X:</label>
          <input
            type="number"
            name="coordinatesX"
            value={formData.coordinatesX}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div className="form-group mb-4">
          <label className="block text-lg mb-2">Coordinates Y:</label>
          <input
            type="number"
            name="coordinatesY"
            value={formData.coordinatesY}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div className="form-group mb-4">
          <label className="block text-lg mb-2">Acres:</label>
          <input
            type="number"
            name="acres"
            value={formData.acres}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div className="form-group mb-4">
          <label className="block text-lg mb-2">Requested Tokens:</label>
          <input
            type="number"
            name="demandedTokens"
            value={formData.demandedTokens}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div className="form-group mb-4">
          <label className="block text-lg mb-2">Project Name:</label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div className="form-group mb-4">
          <label className="block text-lg mb-2">Project Details:</label>
          <textarea
            name="projectDetails"
            value={formData.projectDetails}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div className="form-group mb-4">
          <label className="block text-lg mb-2">Project Photos:</label>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            accept="image/*"
            className="w-full text-white bg-gray-700 p-2 rounded-md file:mr-2 file:px-4 file:py-2 file:bg-blue-600 file:text-white file:rounded-md hover:file:bg-blue-700"
          />
          <div className="preview mt-4">
            {formData.photos.map((cid, index) => (
              <img
                key={index}
                src={`https://ipfs.io/ipfs/${cid}`}
                alt={`Project preview ${index}`}
                className="w-32 h-32 object-cover rounded-md shadow-md mt-2"
              />
            ))}
          </div>
        </div>

        {localError && <div className="error text-red-500 text-center mb-4">{localError}</div>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 w-full"
        >
          Submit Claim
        </button>
      </form>
    </div>
  );
};

export default OrganisationClaimPage;
