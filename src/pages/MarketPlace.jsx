import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MARKETPLACE_ABI,MARKETPLACE_ADDRESS } from "../utils/constants";

const Marketplace = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            if (!window.ethereum) {
                alert("Please install MetaMask to use this feature.");
                return;
            }
            
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider);
            
            const accounts = await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner(accounts[0]);

            const orgs = await contract.queryFilter("OrganizationRegistered");
            const formattedOrgs = orgs.map(event => ({
                address: event.args.orgAddress,
                name: event.args.name,
                isBuyer: event.args.isBuyer ? "Buyer" : "Seller"
            }));

            setOrganizations(formattedOrgs);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching organizations:", error);
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4">Make a Claim</button>
            <h2 className="text-xl font-semibold mb-4">Organizations</h2>
            {loading ? (
                <p>Loading organizations...</p>
            ) : (
                <ul>
                    {organizations.map((org, index) => (
                        <li key={index} className="border p-2 rounded-md mb-2">
                            <p><strong>Name:</strong> {org.name}</p>
                            <p><strong>Type:</strong> {org.isBuyer}</p>
                            <p><strong>Address:</strong> {org.address}</p>
                            <p><strong>Balance:</strong> {org.balance ? org.balance : "None"}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Marketplace;
