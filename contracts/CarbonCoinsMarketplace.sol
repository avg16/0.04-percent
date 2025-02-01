// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// CarbonCoin Token
contract CarbonToken is ERC20, Ownable {
    constructor(address initialOwner) 
        ERC20("CarbonCoin", "CC")
        Ownable(initialOwner)
    {}
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

// Main Marketplace Contract
contract CarbonMarketplace is ReentrancyGuard, Ownable {
    CarbonToken public carbonToken;
    
    struct Organization {
        string name;
        uint256 netEmission;
        string photoIpfsHash;
        bool isRegistered;
        uint256 balance;
    }
    
    struct Claim {
        uint256 id;
        address seller;
        int256 coordinatesX;
        int256 coordinatesY;
        uint256 acres;
        uint256 demandedTokens;
        uint256 eligibleTokens; // Added to track approved tokens
        string projectDetails;
        string projectName;
        uint256 timestamp;
        string[] photoIpfsHashes;
        uint256 startYear; //
        ClaimStatus status;
    }
    
    enum ClaimStatus { Pending, Approved, Declined }
    
    mapping(address => Organization) public organizations;
    mapping(uint256 => Claim) public claims;
    uint256 public claimCounter;
    
    event OrganizationRegistered(address indexed orgAddress, string name);
    event ClaimSubmitted(uint256 indexed claimId, address indexed seller);
    event ClaimStatusUpdated(uint256 indexed claimId, ClaimStatus status, uint256 eligibleTokens);
    event CreditsPurchased(address indexed buyer, address indexed seller, uint256 amount);
    
    constructor(address _carbonToken, address initialOwner) 
        Ownable(initialOwner)
    {
        carbonToken = CarbonToken(_carbonToken);
    }
    
    function registerOrganization(
        string memory _name,
        uint256 _netEmission,
        string memory _photoIpfsHash
    ) external {
        require(!organizations[msg.sender].isRegistered, "Already registered");
        
        organizations[msg.sender] = Organization({
            name: _name,
            netEmission: _netEmission,
            photoIpfsHash: _photoIpfsHash,
            isRegistered: true,
            balance: 0
        });
        
        emit OrganizationRegistered(msg.sender, _name);
    }
    
    function submitClaim(
        int256 _coordinatesX,
        int256 _coordinatesY,
        uint256 _acres,
        uint256 _demandedTokens,
        string memory _projectDetails,
        string memory _projectName,
        string[] memory _photoIpfsHashes,
        uint256 startYear
    ) external {
        require(organizations[msg.sender].isRegistered, "Not registered");
        
        uint256 claimId = claimCounter++;
        
        claims[claimId] = Claim({
            id: claimId,
            seller: msg.sender,
            coordinatesX: _coordinatesX,
            coordinatesY: _coordinatesY,
            acres: _acres,
            demandedTokens: _demandedTokens,
            eligibleTokens: 0, // Initialize to 0
            projectDetails: _projectDetails,
            projectName: _projectName,
            timestamp: block.timestamp,
            photoIpfsHashes: _photoIpfsHashes,
            status: ClaimStatus.Pending,
            startYear: startYear
        });
        emit ClaimSubmitted(claimId, msg.sender);
    }
    
    function approveClaim(uint256 _claimId, uint256 _eligibleTokens) external onlyOwner {
        require(claims[_claimId].status == ClaimStatus.Pending, "Invalid claim status");
        require(_eligibleTokens <= claims[_claimId].demandedTokens, "Eligible tokens cannot exceed demanded tokens");
        
        claims[_claimId].status = ClaimStatus.Approved;
        claims[_claimId].eligibleTokens = _eligibleTokens; // Store the eligible tokens amount
        
        // Mint the eligible amount of tokens, not the demanded amount
        carbonToken.mint(claims[_claimId].seller, _eligibleTokens);
        organizations[claims[_claimId].seller].balance += _eligibleTokens;
        
        emit ClaimStatusUpdated(_claimId, ClaimStatus.Approved, _eligibleTokens);
    }
    
    function declineClaim(uint256 _claimId) external onlyOwner {
        require(claims[_claimId].status == ClaimStatus.Pending, "Invalid claim status");
        
        claims[_claimId].status = ClaimStatus.Declined;
        claims[_claimId].eligibleTokens = 0; // Explicitly set eligible tokens to 0
        
        emit ClaimStatusUpdated(_claimId, ClaimStatus.Declined, 0);
    }
    
    function purchaseCredits(address _seller, uint256 _amount) external nonReentrant {
        require(organizations[msg.sender].isRegistered, "Buyer not registered");
        require(organizations[_seller].isRegistered, "Seller not registered");
        require(organizations[_seller].balance >= _amount, "Insufficient seller balance");
        
        organizations[_seller].balance -= _amount;
        carbonToken.transferFrom(msg.sender, _seller, _amount);
        
        emit CreditsPurchased(msg.sender, _seller, _amount);
    }
    
    function getOrganization(address _org) external view returns (Organization memory) {
        return organizations[_org];
    }
    
    function getClaim(uint256 _claimId) external view returns (Claim memory) {
        return claims[_claimId];
    }
}
