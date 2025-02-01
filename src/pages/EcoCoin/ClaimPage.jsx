import React, { useState, useContext } from 'react';
import { UserWeb3Context } from '../../hooks/Web3UserHook';
import { useIPFS } from '../../context/IpfsContext';

const UserClaimSubmissionPage = () => {
  const { walletAddress, contract, connectWallet, error: web3Error } = useContext(UserWeb3Context);
  const { uploadFile, error: ipfsError } = useIPFS();

  const [formData, setFormData] = useState({
    name: '',
    claimType: '',
    expectedCoins: '',
    photo: null,
  });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setStatus({ loading: false, error: 'File size too large. Maximum size is 10MB.', success: '' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        setStatus({ loading: false, error: 'Only image files are allowed.', success: '' });
        return;
      }
      setStatus({ loading: false, error: '', success: '' });
      setFormData({ ...formData, photo: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      if (!contract) throw new Error('Contract not initialized. Try reconnecting the wallet.');
      if (!walletAddress) throw new Error('Please connect your wallet first.');

      let photoIpfsHash = '';
      if (formData.photo) {
        try {
          photoIpfsHash = await uploadFile(formData.photo);
          if (!photoIpfsHash) {
            throw new Error('Failed to upload photo to IPFS');
          }
        } catch (ipfsError) {
          throw new Error(`IPFS Upload Error: ${ipfsError.message}`);
        }
      }

      const tx = await contract.submitClaim(
        formData.name,
        photoIpfsHash,
        formData.claimType,
        formData.expectedCoins
      );

      await tx.wait();
      setStatus({ loading: false, error: '', success: 'Claim submitted successfully!' });
      setFormData({ name: '', claimType: '', expectedCoins: '', photo: null });
    } catch (error) {
      setStatus({ loading: false, error: error.message || 'Error submitting claim', success: '' });
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Submit New Claim</h1>

      {!walletAddress ? (
        <button onClick={connectWallet} className="w-full p-2 rounded text-white bg-blue-600 hover:bg-blue-700 mb-6">
          Connect Wallet to Submit Claim
        </button>
      ) : (
        <div className="mb-6 p-3 bg-gray-100 rounded">
          <p>Connected as: {walletAddress}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Project Name</label>
          <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block mb-2">Project Photo</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" />
          {formData.photo && <div className="mt-2">Selected: {formData.photo.name}</div>}
        </div>

        <div>
          <label className="block mb-2">Claim Type</label>
          <select required value={formData.claimType} onChange={(e) => setFormData({ ...formData, claimType: e.target.value })} className="w-full p-2 border rounded">
            <option value="">Select claim type</option>
            <option value="Renewable Energy">Renewable Energy</option>
            <option value="Carbon Reduction">Carbon Reduction</option>
            <option value="Reforestation">Reforestation</option>
            <option value="Waste Management">Waste Management</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Expected EcoCoins</label>
          <input type="number" required min="1" value={formData.expectedCoins} onChange={(e) => setFormData({ ...formData, expectedCoins: e.target.value })} className="w-full p-2 border rounded" />
        </div>

        {(status.error || ipfsError || web3Error) && <div className="bg-red-100 text-red-700 p-3 rounded">{status.error || ipfsError || web3Error}</div>}
        {status.success && <div className="bg-green-100 text-green-700 p-3 rounded">{status.success}</div>}

        <button type="submit" disabled={status.loading || !walletAddress} className={`w-full p-2 rounded text-white ${status.loading || !walletAddress ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {status.loading ? 'Submitting...' : 'Submit Claim'}
        </button>
      </form>
    </div>
  );
};

export default UserClaimSubmissionPage;
