import React from "react";
import { useState } from "react";
import { ethers } from "ethers";
import { MARKETPLACE_ABI,MARKETPLACE_ADDRESS } from "../utils/constants";
export default function RegisterPage() {
    const [walletAddress, setWalletAddress] = useState('');
    const [formData, setFormData] = useState({
      name: '',
      isBuyer: false,
      netEmission: '',
      photo: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    const connectWallet = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
      } catch (error) {
        console.error("Error connecting wallet:", error);
        setError('Failed to connect wallet. Please make sure MetaMask is installed.');
      }
    };
  
    const uploadToIPFS = async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer YOUR_PINATA_JWT`, // Replace with your Pinata JWT
          },
          body: formData
        });
        
        const data = await response.json();
        return data.IpfsHash;
      } catch (error) {
        console.error('Error uploading to IPFS:', error);
        throw error;
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);
  
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);
  
        // Upload photo to IPFS
        let photoHash = '';
        if (formData.photo) {
          photoHash = await uploadToIPFS(formData.photo);
        }
  
        // Register organization
        const tx = await contract.registerOrganization(
          formData.name,
          formData.isBuyer,
          formData.netEmission,
          photoHash
        );
  
        await tx.wait();
        alert('Organization registered successfully!');
        
      } catch (error) {
        console.error('Registration error:', error);
        setError('Failed to register organization. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Register Organization
          </h2>
  
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
                <label className="block text-sm font-medium text-gray-700">
                  Connected Wallet
                </label>
                <div className="mt-1 text-sm text-gray-500">
                  {walletAddress}
                </div>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Organization Name
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Organization Type
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.isBuyer}
                  onChange={(e) => setFormData({ ...formData, isBuyer: e.target.value === 'true' })}
                >
                  <option value="false">Seller</option>
                  <option value="true">Buyer</option>
                </select>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Net Emission (tons CO2)
                </label>
                <input
                  type="number"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.netEmission}
                  onChange={(e) => setFormData({ ...formData, netEmission: e.target.value })}
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Organization Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full"
                  onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
                />
              </div>
  
              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}
  
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Registering...' : 'Register Organization'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }