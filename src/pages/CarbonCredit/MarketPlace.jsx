import React, { useEffect, useState, useContext } from "react";
import { Web3Context } from "../../hooks/Web3hook";
import { useIPFS } from "../../context/IpfsContext"; // Import the IPFS context hook
import "./styles/Marketplace.css";

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
        <div className="marketplace-container">
            <h2 className="title">Organizations</h2>

            {!walletAddress ? (
                <p className="error-text">Connect your wallet to view organizations.</p>
            ) : loading ? (
                <p className="loading-text">Loading organizations...</p>
            ) : (
                <ul className="organization-list">
                    {organizations.map((org, index) => (
                        <li key={index} className="organization-item">
                            <p><strong>Name:</strong> {org.name}</p>
                            <p><strong>Address:</strong> {org.address}</p>
                            <p><strong>Balance:</strong> {org.balance ? org.balance : "None"}</p>
                            {org.photoUrl && (
                                <div>
                                    <img
                                        src={org.photoUrl}
                                        alt={org.name}
                                        className="organization-image"
                                        style={{ width: "150px", height: "150px", objectFit: "cover" }} // Add size here
                                    />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrganisationMarketplace;
