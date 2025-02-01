import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserWeb3Context } from '../../hooks/Web3UserHook';
import moment from "moment";

const ClaimsListingPage = () => {
  const { contract, walletAddress } = useContext(UserWeb3Context);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState({});
  const processedClaims = useRef(new Set()); // Track claims being finalized

  const handleResolve = async (claimId) => {
    console.log("Resolving claim:", claimId);
    if (!contract || !claimId) return;
    try {
      setError('');
      const tx = await contract.resolveClaim(claimId);
      await tx.wait();
      await fetchClaims(); // Refresh claims after resolution
    } catch (error) {
      console.error("Error resolving claim:", error);
      setError(error.message || "Failed to resolve claim");
      processedClaims.current.delete(claimId.toString());
    }
  };

  // Update timers and check for claims whose voting period has ended
  useEffect(() => {
    const updateTimers = () => {
      const now = moment().unix(); // Current timestamp in seconds
      console.log("Current time: ", now);
      const newTimeLeft = {};

      claims.forEach((claim) => {
        console.log("Claim endtime", claim[7]);
        if (claim?.status === 0 && claim.endTime) {
          const endTime = parseInt(claim[7].toString(), 10);
          console.log(`Claim ID: ${claim.id}, End Time: ${endTime}, Current Time: ${now}`);
          
          const timeRemaining = endTime - now;
          console.log("Time remaining (in seconds): ", timeRemaining);

          // Update timer display
          if (timeRemaining > 0) {
            newTimeLeft[claim.id] = moment.utc(timeRemaining * 1000).format("mm[m] ss[s]");
          } else {
            newTimeLeft[claim.id] = "Voting ended";
            const claimId = claim.id.toString();
            console.log(`Claim ID: ${claim.id} has expired, resolving...`);
            if (!processedClaims.current.has(claimId)) {
              processedClaims.current.add(claimId);
              handleResolve(claimId);
            }
          }
        }
      });

      setTimeLeft(newTimeLeft);
    };

    updateTimers(); 
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval); 
}, [claims]);


  // Function to get IPFS image
  const getFile = async (ipfsHash) => {
    if (!ipfsHash) return null;
    try {
      return `https://ipfs.io/ipfs/${ipfsHash}`;
    } catch (error) {
      console.error("Error getting file:", error);
      return null;
    }
  };

  // Fetch all claims
  const fetchClaims = async () => {
    try {
      if (!contract) throw new Error("Contract not initialized");

      const claimEvents = await contract.queryFilter("ClaimSubmitted");
      const claimDetails = await Promise.all(
        claimEvents.map(async (event) => {
          try {
            const claimId = event.args?.claimId;
            if (!claimId) return null;

            const claim = await contract.getClaimView(claimId);
            if (!claim) return null;

            const photoUrl = await getFile(claim.photoIpfsHash);
            const canVote = await contract.canVote(claimId, walletAddress);
            
            return {
              ...claim,
              id: claimId,
              photoUrl,
              canVote,
              name: claim.name || 'Unnamed Claim',
              claimType: claim.claimType || 'Unspecified',
              expectedCoins: claim.expectedCoins || '0',
              forVotes: claim.forVotes || '0',
              againstVotes: claim.againstVotes || '0',
              status: claim.status || 0,
              revealed: claim.revealed || false
            };
          } catch (err) {
            console.error(`Error processing claim:`, err);
            return null;
          }
        })
      );
      setClaims(claimDetails.filter(claim => claim !== null));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching claims:", error);
      setError("Failed to fetch claims");
      setLoading(false);
    }
  };

  // Auto-finalize claims when voting period ends
  const handleFinalize = async (claimId) => {
    if (!contract || !claimId) return;
    try {
      setError('');
      const tx = await contract.finalizeClaim(claimId);
      await tx.wait();
      await fetchClaims();
    } catch (error) {
      console.error("Error finalizing claim:", error);
      setError(error.message || "Failed to finalize claim");
      processedClaims.current.delete(claimId.toString());
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const newTimeLeft = {};
      
      claims.forEach(claim => {
        if (claim?.status === 0 && claim?.endTime) {
          const endTime = parseInt(claim.endTime.toString());
          const timeRemaining = endTime - now;
          
          // Update timer display
          if (timeRemaining > 0) {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            newTimeLeft[claim.id] = `${minutes}m ${seconds}s`;
          } else {
            newTimeLeft[claim.id] = "Voting ended";
          }

          // Auto-finalize if time expired and the status is still pending
          if (timeRemaining <= 0 && claim.status === 0) {
            const claimId = claim.id.toString();
            if (!processedClaims.current.has(claimId)) {
              processedClaims.current.add(claimId);
              handleFinalize(claimId);
            }
          }
        }
      });
      
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [claims]);

  // Vote on a claim
  const handleVote = async (claimId, voteFor) => {
    if (!contract || !claimId) return;
    try {
      setError('');
      const tx = await contract.vote(claimId, voteFor);
      await tx.wait();
      await fetchClaims();
      alert("Your vote was successfully submitted!");
    } catch (error) {
      console.error("Error voting:", error);
      setError(error.message || "Failed to vote");

    }
  };

  // Initial fetch
  useEffect(() => {
    if (contract) fetchClaims();
  }, [contract, walletAddress]);

  if (loading) return <div className="p-4">Loading claims...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!claims.length) return <div className="p-4">No claims found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Active Claims</h1>
      <div className="grid gap-6">
        {claims.map((claim) => claim && (
          <div key={claim.id?.toString()} className="border rounded-lg p-4 bg-white shadow">
            <div className="flex gap-4">
              {claim.photoUrl && (
                <img 
                  src={claim.photoUrl} 
                  alt={claim.name || 'Claim image'}
                  className="w-32 h-32 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{claim.name}</h2>
                <p className="text-gray-600">Type: {claim.claimType}</p>
                <p className="text-gray-600">
                  Expected Coins: {claim.expectedCoins.toString()}
                </p>
                <p className="text-gray-600">
                  Endtime (UTC): {claim.endTime}
                </p>
                <p className="text-gray-600">
                  Status: {['Pending', 'Approved', 'Rejected'][claim.status] || 'Unknown'}
                </p>
                {claim.status === 0 && timeLeft[claim.id] && (
                  <p className="text-blue-600 font-semibold">
                    Time left: {timeLeft[claim.id]}
                  </p>
                )}
                {claim.revealed && (
                  <div className="mt-2">
                    <p>Votes For: {claim.forVotes.toString()}</p>
                    <p>Votes Against: {claim.againstVotes.toString()}</p>
                  </div>
                )}
                {claim.canVote && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleVote(claim.id, true)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Vote For
                    </button>
                    <button
                      onClick={() => handleVote(claim.id, false)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Vote Against
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClaimsListingPage;
