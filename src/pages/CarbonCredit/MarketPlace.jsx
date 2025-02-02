import React, { useEffect, useState, useContext } from "react";
import { Web3Context } from "../../hooks/Web3hook";
import { useIPFS } from "../../context/IpfsContext"; // Import the IPFS context hook

const OrganisationMarketplace = () => {
    const { walletAddress, contract } = useContext(Web3Context); // Use global Web3 state
    const { getFile, isLoading, error } = useIPFS(); // Use IPFS hook to get images
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (contract) {
            fetchOrganizations();
        }
    }, [contract]);

    const fetchOrganizations = async () => {
        try {
            if (!contract) {
                console.error("Contract not initialized");
                return;
            }

            const orgs = await contract.queryFilter("OrganizationRegistered");

            // Format the organizations array to include the correct properties
            const formattedOrgs = await Promise.all(
                orgs.map(async (event) => {
                    const photoUrl = await getFile(event.args.photoIpfsHash); // Get image URL using IPFS CID
                    return {
                        address: event.args.orgAddress,
                        name: event.args.name,
                        photoUrl, // Store the image URL here
                        balance: event.args.balance || 0,
                    };
                })
            );

            setOrganizations(formattedOrgs);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching organizations:", error);
            setLoading(false);
        }
    };

    return (
        <div className="marketplace-container bg-gray-900 min-h-screen text-gray-100 py-8 px-4">
            <h2 className="text-3xl font-semibold mb-6 text-center">Organizations Marketplace</h2>

            {!walletAddress ? (
                <div className="bg-red-600 text-white p-4 rounded-lg text-center">
                    Connect your wallet to view organizations.
                </div>
            ) : loading ? (
                <div className="bg-blue-600 text-white p-4 rounded-lg text-center">
                    Loading organizations...
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizations.map((org, index) => (
                        <div
                            key={index}
                            className="organization-item bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center space-y-4"
                        >
                            {org.photoUrl && (
                                <img
                                    src={org.photoUrl}
                                    alt={org.name}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
                                />
                            )}
                            <div className="text-center space-y-2">
                                <p className="text-xl font-semibold">{org.name}</p>
                                <p className="text-sm text-gray-400">Address: {org.address}</p>
                                <p className="text-sm font-semibold">
                                    Balance: {org.balance ? org.balance : "None"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrganisationMarketplace;
