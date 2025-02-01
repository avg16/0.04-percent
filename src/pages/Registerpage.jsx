import React, { useState, useContext } from "react";
import { Web3Context } from "../hooks/Web3hook";
import uploadToIPFS from "../utils/ifpsUpload";

export default function RegisterPage() {
  const { walletAddress, contract, connectWallet, error } = useContext(Web3Context); // Use global Web3 state
  console.log("walletAddress",walletAddress);
  console.log("contract",contract);
  const [formData, setFormData] = useState({
    name: "",
    netEmission: "",
    photoIpfsHash: null,
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLoading(true);

    try {
      if (!contract) throw new Error("Contract not initialized. Try reconnecting the wallet.");

      // Upload photo to IPFS
      let photoIpfsHash = "";
      if (formData.photo) {
        photoIpfsHash= await uploadToIPFS(formData.photo);
      }

      // Register organization
      const tx = await contract.registerOrganization(
        formData.name,
        formData.netEmission,
        photoIpfsHash
      );

      await tx.wait();
      alert("Organization registered successfully!");
    } catch (error) {
      console.error("Registration error:", error);
      setLocalError(error.reason || "Failed to register organization. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Register Organization</h2>

        {!walletAddress ? (
          <button
            onClick={connectWallet}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Connect Wallet
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Connected Wallet</label>
              <div className="mt-1 text-sm text-gray-500">{walletAddress}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Organization Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Net Emission (tons CO2)</label>
              <input
                type="number"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.netEmission}
                onChange={(e) => setFormData({ ...formData, netEmission: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Organization Photo</label>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full"
                onChange={(e) => setFormData({ ...formData, photoIpfsHash: e.target.files[0] })}
              />
            </div>

            {localError && <div className="text-red-600 text-sm">{localError}</div>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 
                ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Registering..." : "Register Organization"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
