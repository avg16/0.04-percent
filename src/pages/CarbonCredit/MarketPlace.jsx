import React, { useEffect, useState, useContext } from "react";
import { Web3Context } from "../../hooks/Web3hook";
import "./styles/Marketplace.css"; 

const OrganisationMarketplace = () => {
    const { walletAddress, contract } = useContext(Web3Context); // Use global Web3 state
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
            const formattedOrgs = orgs.map(event => ({
                address: event.args.orgAddress,
                name: event.args.name,
            }));

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
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrganisationMarketplace;
