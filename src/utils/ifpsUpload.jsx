import { NFTStorage } from 'nft.storage';

// Replace with your API key from nft.storage
const NFT_STORAGE_KEY = 'd51936c9.4c8742a4217a433fa3fd0c45c134d4f6';  // Ensure this is correct and does not have extra spaces
const client = new NFTStorage({ token: NFT_STORAGE_KEY });

const uploadToIPFS = async (file) => {
  try {
    // Ensure the file is correctly wrapped in a File object
    const imageFile = new File([file], 'image.jpg', { type: file.type });
    
    // Store the metadata on NFT.Storage
    const metadata = await client.store({
      name: 'Organization Photo',
      description: 'Carbon Credits Marketplace Organization Photo',
      image: imageFile
    });

    // Extract the IPFS CID from the URL and return it
    const ipfsHash = metadata.url.replace('ipfs://', '');
    return ipfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

export default uploadToIPFS;
