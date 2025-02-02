import React, { useState, useContext } from "react";
import { Web3Context } from "../../hooks/Web3hook";
import { useIPFS } from "../../context/IpfsContext"; // Import the IPFS context hook
import { Link } from "react-router-dom"; // Import Link for navigation
import backgroundImage from "../../assets/cover.jpg"; // Import the local image
import metamaskLogo from "../../assets/metamask-logo.png"; // Import MetaMask logo

export default function OrganisationRegisterPage() {
  const { walletAddress, contract, connectWallet, disconnectWallet, error: web3Error } = useContext(Web3Context);
  const { uploadFile, error: ipfsError } = useIPFS(); // Use the IPFS context

  const [formData, setFormData] = useState({
    name: "",
    netEmission: "",
    photo: null,
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

      const tx = await contract.registerOrganization(
        formData.name,
        formData.netEmission,
        photoIpfsHash
      );

      await tx.wait();
      alert("Organization registered successfully!");

      setFormData({
        name: "",
        netEmission: "",
        photo: null,
      });

    } catch (error) {
      console.error("Registration error:", error);
      setLocalError(error.reason || error.message || "Failed to register organization. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-gray-100">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Home Button */}
      <Link to="/" className="absolute top-6 left-6 bg-gray-900 bg-opacity-80 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
        ⬅ Home
      </Link>

      <div className="relative z-10 bg-gray-800 bg-opacity-90 p-10 rounded-2xl shadow-2xl w-full max-w-2xl backdrop-blur-lg">
        <h1 className="text-3xl font-semibold mb-8 text-center">Register Organization</h1>

        {!walletAddress ? (
          <div className="flex flex-col items-center bg-gray-900 p-6 rounded-xl shadow-lg">
            <img src={metamaskLogo} alt="MetaMask" className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-gray-400 mb-4">Please connect your MetaMask wallet to continue</p>
            <button onClick={connectWallet} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
              Connect MetaMask
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-white text-center">
              <span className="text-lg">Connected Wallet</span>
              <div className="text-sm font-semibold mt-2 break-words">{walletAddress}</div>
              <button onClick={disconnectWallet} className="mt-4 w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition">
                Disconnect
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold">Organization Name</label>
              <input type="text" required placeholder="Enter organization name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 mt-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold">Net Emission (tons CO2)</label>
              <input type="number" required placeholder="Enter net emission" value={formData.netEmission} onChange={(e) => setFormData({ ...formData, netEmission: e.target.value })} className="w-full p-3 mt-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>

            <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg text-white ${loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700 transition"}`}>
              {loading ? "Registering..." : "Register Organization"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
