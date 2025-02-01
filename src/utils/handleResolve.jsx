export default handleResolve = async (claimId) => {
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