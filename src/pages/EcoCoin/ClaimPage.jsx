import React, { useState } from 'react';

const UserClaimSubmissionPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    photoIpfsHash: '',
    claimType: '',
    expectedCoins: ''
  });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      // Connect to Web3 provider (assuming MetaMask is installed)
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to submit claims');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Contract interaction code would go here
      // This is a placeholder for the actual contract call
      console.log('Submitting claim with data:', formData);
      
      setStatus({
        loading: false,
        error: '',
        success: 'Claim submitted successfully!'
      });

      // Reset form
      setFormData({
        name: '',
        photoIpfsHash: '',
        claimType: '',
        expectedCoins: ''
      });

    } catch (err) {
      setStatus({
        loading: false,
        error: err.message,
        success: ''
      });
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Submit New Claim</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">
            Project Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </label>
        </div>

        <div>
          <label className="block mb-2">
            Photo IPFS Hash
            <input
              type="text"
              name="photoIpfsHash"
              value={formData.photoIpfsHash}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </label>
        </div>

        <div>
          <label className="block mb-2">
            Claim Type
            <select
              name="claimType"
              value={formData.claimType}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
            >
              <option value="">Select claim type</option>
              <option value="Renewable Energy">Renewable Energy</option>
              <option value="Carbon Reduction">Carbon Reduction</option>
              <option value="Reforestation">Reforestation</option>
              <option value="Waste Management">Waste Management</option>
            </select>
          </label>
        </div>

        <div>
          <label className="block mb-2">
            Expected EcoCoins
            <input
              type="number"
              name="expectedCoins"
              value={formData.expectedCoins}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
              min="1"
            />
          </label>
        </div>

        {status.error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {status.error}
          </div>
        )}

        {status.success && (
          <div className="bg-green-100 text-green-700 p-3 rounded">
            {status.success}
          </div>
        )}

        <button
          type="submit"
          disabled={status.loading}
          className={`w-full p-2 rounded text-white ${
            status.loading 
              ? 'bg-gray-400' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {status.loading ? 'Submitting...' : 'Submit Claim'}
        </button>
      </form>
    </div>
  );
};

export default UserClaimSubmissionPage;